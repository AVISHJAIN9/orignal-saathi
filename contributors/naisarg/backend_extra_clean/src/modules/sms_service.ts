import { Controller, Post, Body, HttpCode, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/guards/public.decorator';
import axios from 'axios';

interface SendOtpDto {
  phone: string;
  purpose?: string;
  name?: string;
}

interface VerifyOtpDto {
  phone: string;
  otp: string;
}

// In-memory OTP storage for validation
const activeOtps = new Map<string, { otp: string; expiresAt: number }>();

@ApiTags('SMS & Telecom Gateway Alternative')
@Controller('api/v1/sms')
export class SmsGatewayController {
  private readonly logger = new Logger(SmsGatewayController.name);

  private readonly fast2SmsKey = process.env.FAST2SMS_API_KEY;
  private readonly twilioSid = process.env.TWILIO_ACCOUNT_SID;
  private readonly twilioToken = process.env.TWILIO_AUTH_TOKEN;
  private readonly twilioFrom = process.env.TWILIO_FROM_PHONE;

  @Public()
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP via Fast2SMS / Twilio / WhatsApp / Simulation' })
  @ApiResponse({ status: 200, description: 'OTP dispatched successfully' })
  async sendOtp(@Body() body: SendOtpDto) {
    const { phone, purpose = 'BIS Portal Authentication', name = 'Citizen' } = body;
    if (!phone || phone.length < 10) {
      throw new BadRequestException('Valid 10-digit mobile number required');
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    activeOtps.set(cleanPhone, { otp, expiresAt });

    const messageText = `[BIS SAATHI] Namaste ${name}, your verification OTP for ${purpose} is ${otp}. Valid for 10 mins. Do not share this with anyone.`;
    let deliveredVia = 'In-App Simulation & Terminal';

    // 1. Try Fast2SMS (Indian Cellular Delivery)
    const fast2SmsKey = process.env.FAST2SMS_API_KEY || this.fast2SmsKey;
    if (fast2SmsKey) {
      try {
        const smsRes = await axios.post(
          'https://www.fast2sms.com/dev/bulkV2',
          {
            route: 'otp',
            variables_values: otp,
            numbers: cleanPhone,
          },
          {
            headers: {
              authorization: fast2SmsKey,
              'Content-Type': 'application/json'
            },
            timeout: 5000
          },
        );
        if (smsRes.data?.return === true || smsRes.status === 200) {
          deliveredVia = 'Fast2SMS Indian Cellular Gateway';
          this.logger.log(`Dispatched SMS OTP to +91${cleanPhone} via Fast2SMS: ${JSON.stringify(smsRes.data)}`);
        }
      } catch (err: any) {
        this.logger.warn(`Fast2SMS cellular dispatch notice: ${err.response?.data?.message || err.message}`);
      }
    }

    // 2. Try Twilio (International / Indian Telecom)
    if (this.twilioSid && this.twilioToken && this.twilioFrom && deliveredVia === 'In-App Simulation & Terminal') {
      try {
        const authHeader = `Basic ${Buffer.from(`${this.twilioSid}:${this.twilioToken}`).toString('base64')}`;
        const formData = new URLSearchParams();
        formData.append('To', `+91${cleanPhone}`);
        formData.append('From', this.twilioFrom);
        formData.append('Body', messageText);

        await axios.post(`https://api.twilio.com/2010-04-01/Accounts/${this.twilioSid}/Messages.json`, formData, {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        deliveredVia = 'Twilio SMS Cellular Gateway';
        this.logger.log(`Dispatched SMS OTP to +91${cleanPhone} via Twilio`);
      } catch (err: any) {
        this.logger.warn(`Twilio SMS failed: ${err.message}`);
      }
    }

    this.logger.log(`[SMS OTP GENERATED] Phone: +91${cleanPhone} | Code: ${otp} | Delivered Via: ${deliveredVia}`);

    return {
      status: 'success',
      phone: `+91${cleanPhone}`,
      deliveredVia,
      otp, // surfaced for in-app autofill simulator
      message: messageText,
      validMinutes: 10,
    };
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify mobile OTP' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully' })
  async verifyOtp(@Body() body: VerifyOtpDto) {
    const { phone, otp } = body;
    if (!phone || !otp) {
      throw new BadRequestException('Phone and OTP required');
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const record = activeOtps.get(cleanPhone);

    if (!record) {
      // Fallback verification for demo/universal test code 123456
      if (otp === '123456') {
        return { status: 'success', verified: true, message: 'Demo OTP verified successfully' };
      }
      throw new BadRequestException('No active OTP found. Please request a new one.');
    }

    if (Date.now() > record.expiresAt) {
      activeOtps.delete(cleanPhone);
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    if (record.otp !== otp.trim() && otp !== '123456') {
      throw new BadRequestException('Invalid OTP. Please check the code and try again.');
    }

    activeOtps.delete(cleanPhone);
    return {
      status: 'success',
      verified: true,
      phone: `+91${cleanPhone}`,
      message: 'Mobile number authenticated successfully.',
    };
  }
}
