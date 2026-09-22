/**
 * S5 — Payment & Fee Status Tracker Service
 * Table: payments_fees (amount, due_date, status, license_id, etc.)
 * Logic: Real Razorpay SDK integration with automated environment-driven mock fallback.
 * Keys: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, RAZORPAY_MODE
 */

const crypto = require('crypto');
const { sDb } = require('../database');

let Razorpay = null;
try {
  Razorpay = require('razorpay');
} catch (_) {
  Razorpay = null;
}

function getRazorpayConfig() {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const explicitMode = (process.env.RAZORPAY_MODE || '').trim().toLowerCase();

  const isPlaceholder = (val) =>
    !val ||
    val.includes('your_key') ||
    val.includes('your_secret') ||
    val.includes('placeholder') ||
    val === 'mock';

  const hasRealKeys =
    Boolean(keyId) &&
    Boolean(keySecret) &&
    !isPlaceholder(keyId) &&
    !isPlaceholder(keySecret) &&
    explicitMode !== 'mock' &&
    Boolean(Razorpay);

  return {
    isReal: hasRealKeys,
    mode: hasRealKeys ? (explicitMode === 'live' ? 'live' : 'sandbox') : 'mock',
    keyId: hasRealKeys ? keyId : null,
    keySecret: hasRealKeys ? keySecret : null,
  };
}

class PaymentsGSTService {
  async getStatus(applicationId) {
    return this.getFeesForLicense(applicationId);
  }

  async getFeesForLicense(licenseId) {
    const rawId = (licenseId || '').trim();
    const fees = await sDb.getTable('payments_fees');
    const matchingFees = fees.filter(f =>
      f.license_id === rawId ||
      f.license_id.replace(/[^A-Z0-9]/g, '') === rawId.replace(/[^A-Z0-9]/g, '')
    );

    const pendingTotal = matchingFees
      .filter(f => f.status === 'PENDING')
      .reduce((sum, f) => sum + Number(f.total_amount || 0), 0);

    return {
      license_id: licenseId,
      total_records: matchingFees.length,
      pending_due_inr: pendingTotal,
      fees: matchingFees,
      timestamp: new Date().toISOString()
    };
  }

  async createFeeInvoice({
    license_id = 'CM/L-8400192831',
    applicant_id = 'usr-100',
    fee_type = 'MINIMUM_MARKING_FEE',
    business_scale = 'SMALL',
    due_days = 30
  } = {}) {
    const isMicroSmall = ['MICRO', 'SMALL'].includes((business_scale || '').toUpperCase());
    const baseAmount = isMicroSmall ? 25000.00 : 50000.00;
    const gstAmount = Number((baseAmount * 0.18).toFixed(2));
    const totalAmount = baseAmount + gstAmount;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + due_days);

    const feeRecord = {
      id: 'fee_' + Date.now(),
      license_id,
      applicant_id,
      fee_type,
      amount: baseAmount,
      gst_amount: gstAmount,
      total_amount: totalAmount,
      due_date: dueDate.toISOString().split('T')[0],
      status: 'PENDING',
      payment_gateway_ref: null,
      paid_at: null,
      created_at: new Date().toISOString()
    };

    await sDb.insert('payments_fees', feeRecord);

    const rzpConfig = getRazorpayConfig();
    let razorpayOrder = null;

    if (rzpConfig.isReal) {
      try {
        const instance = new Razorpay({
          key_id: rzpConfig.keyId,
          key_secret: rzpConfig.keySecret,
        });
        const orderRes = await instance.orders.create({
          amount: Math.round(totalAmount * 100),
          currency: 'INR',
          receipt: 'rcpt_' + feeRecord.id,
          notes: {
            license_id,
            applicant_id,
            fee_type
          }
        });
        razorpayOrder = {
          order_id: orderRes.id,
          currency: orderRes.currency || 'INR',
          amount_paise: orderRes.amount,
          status: orderRes.status || 'created',
          mode: rzpConfig.mode,
          checkout_url: `https://api.razorpay.com/v1/checkout?order=${orderRes.id}`
        };
      } catch (err) {
        console.warn(`[S5 Razorpay Warning] Live order creation failed (${err.message}). Falling back to mock.`);
      }
    }

    if (!razorpayOrder) {
      const mockOrderId = 'order_rzp_mock_' + Math.random().toString(36).substring(2, 10);
      razorpayOrder = {
        order_id: mockOrderId,
        currency: 'INR',
        amount_paise: Math.round(totalAmount * 100),
        status: 'created',
        mode: 'mock',
        checkout_url: `https://api.razorpay.com/v1/checkout/mock?order=${mockOrderId}`
      };
    }

    return {
      status: 'INVOICE_GENERATED',
      fee_record: feeRecord,
      payment_gateway: {
        provider: razorpayOrder.mode === 'mock' ? 'Razorpay (Test/Mock Mode)' : `Razorpay (${razorpayOrder.mode.toUpperCase()})`,
        mode: razorpayOrder.mode,
        order_id: razorpayOrder.order_id,
        amount_inr: totalAmount,
        currency: 'INR',
        checkout_url: razorpayOrder.checkout_url
      },
      timestamp: new Date().toISOString()
    };
  }

  async reconcilePayment({ fee_id, payment_id, order_id, signature, status = 'SUCCESS' } = {}) {
    const fee = await sDb.findOne('payments_fees', f => f.id === fee_id);
    if (!fee) {
      return {
        status: 'RECONCILIATION_FAILED',
        error: `Fee record with ID ${fee_id} not found.`
      };
    }

    const rzpConfig = getRazorpayConfig();

    if (status === 'SUCCESS') {
      if (rzpConfig.isReal && order_id && payment_id && signature) {
        const body = order_id + '|' + payment_id;
        const expectedSignature = crypto
          .createHmac('sha256', rzpConfig.keySecret)
          .update(body.toString())
          .digest('hex');

        if (expectedSignature !== signature) {
          return {
            status: 'PAYMENT_VERIFICATION_FAILED',
            mode: rzpConfig.mode,
            fee_id,
            error: 'Razorpay HMAC signature mismatch'
          };
        }
      }

      const activeMode = rzpConfig.isReal ? rzpConfig.mode : 'mock';
      const paymentRef = payment_id || (activeMode === 'mock' ? ('pay_rzp_mock_' + Date.now()) : ('pay_' + Date.now()));

      const updated = await sDb.update(
        'payments_fees',
        f => f.id === fee_id,
        {
          status: 'PAID',
          payment_gateway_ref: paymentRef,
          paid_at: new Date().toISOString()
        }
      );

      return {
        status: 'PAYMENT_RECONCILED_SUCCESS',
        mode: activeMode,
        fee_id,
        license_id: updated.license_id,
        amount_paid: updated.total_amount,
        payment_gateway_ref: updated.payment_gateway_ref,
        paid_at: updated.paid_at,
        receipt_number: 'REC-BIS-' + Date.now().toString().slice(-6)
      };
    }

    return {
      status: 'PAYMENT_FAILED_UNPROCESSED',
      mode: rzpConfig.isReal ? rzpConfig.mode : 'mock',
      fee_id,
      payment_id
    };
  }

  calculateFees({ product_standard = "IS 269:2015", business_scale = "MICRO", factory_state = "Maharashtra" } = {}) {
    const isMicro = (business_scale || '').toUpperCase() === 'MICRO';
    const baseAppFee = isMicro ? 500.0 : 1000.0;
    const baseMarkingFee = isMicro ? 25000.0 : 50000.0;
    const subtotal = baseAppFee + baseMarkingFee;
    const gstRate = 0.18;
    const gstAmount = subtotal * gstRate;

    return {
      product_standard,
      business_scale,
      base_application_fee_inr: baseAppFee,
      base_marking_fee_inr: baseMarkingFee,
      msme_concession_applied_pct: isMicro ? 50.0 : 0.0,
      subtotal_inr: subtotal,
      gst_rate_pct: 18.0,
      gst_amount_inr: gstAmount,
      total_payable_inr: subtotal + gstAmount,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  PaymentsGSTService
};
