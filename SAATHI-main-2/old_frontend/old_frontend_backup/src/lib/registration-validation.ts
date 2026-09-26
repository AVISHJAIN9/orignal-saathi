// Pure, frontend-only validation: obvious required/malformed-input checks
// a form should always catch immediately, never a BIS business rule (e.g.
// nothing here decides whether a business type actually qualifies for a
// given standard — that judgment, if it exists at all, belongs entirely
// to the backend/mock-registrationApi layer per the S3 task's explicit
// "don't duplicate BIS business rules as React conditionals" rule).

import type {
  ApplicantDetails,
  BusinessDetails,
  ProductDetails,
} from "@/lib/mock-registration";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[0-9]{10}$/;
const PINCODE_PATTERN = /^[0-9]{6}$/;

// Explicit optional fields (not a generic index signature) so step
// components can read e.g. `errors.fullName` directly under this
// project's `noPropertyAccessFromIndexSignature` setting.
export interface ApplicantFieldErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  applicantType?: string;
}

export interface BusinessFieldErrors {
  organizationName?: string;
  businessType?: string;
  addressLine1?: string;
  state?: string;
  city?: string;
  pincode?: string;
}

export interface ProductFieldErrors {
  productName?: string;
  productDescription?: string;
  categoryKey?: string;
}

// The wizard shell holds one of these at a time, keyed to whichever step
// is active — a union rather than a plain Record so each step component
// still gets a specifically-typed, dot-accessible `errors` prop.
export type FieldErrors = ApplicantFieldErrors &
  BusinessFieldErrors &
  ProductFieldErrors;

export function validateApplicant(
  applicant: ApplicantDetails,
): ApplicantFieldErrors {
  const errors: ApplicantFieldErrors = {};
  if (applicant.fullName.trim() === "")
    errors.fullName = "Enter your full name.";
  if (applicant.email.trim() === "") errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(applicant.email.trim()))
    errors.email = "That email address doesn't look right.";
  if (applicant.phone.trim() === "") errors.phone = "Enter your phone number.";
  else if (!PHONE_PATTERN.test(applicant.phone.trim()))
    errors.phone = "Enter a 10-digit phone number.";
  if (applicant.applicantType === "")
    errors.applicantType = "Select an applicant type.";
  return errors;
}

export function validateBusiness(
  business: BusinessDetails,
): BusinessFieldErrors {
  const errors: BusinessFieldErrors = {};
  if (business.organizationName.trim() === "")
    errors.organizationName = "Enter your organization name.";
  if (business.businessType === "")
    errors.businessType = "Select a business type.";
  if (business.addressLine1.trim() === "")
    errors.addressLine1 = "Enter your address.";
  if (business.state === "") errors.state = "Select a state.";
  if (business.city.trim() === "") errors.city = "Select a city.";
  if (business.pincode.trim() === "") errors.pincode = "Enter a PIN code.";
  else if (!PINCODE_PATTERN.test(business.pincode.trim()))
    errors.pincode = "Enter a 6-digit PIN code.";
  return errors;
}

export function validateProduct(product: ProductDetails): ProductFieldErrors {
  const errors: ProductFieldErrors = {};
  if (product.productName.trim() === "")
    errors.productName = "Enter a product name.";
  if (product.productDescription.trim() === "")
    errors.productDescription = "Describe the product briefly.";
  if (product.categoryKey === "")
    errors.categoryKey = "Select a product category.";
  return errors;
}

export const INDIA_STATES: { key: string; label: string; cities: string[] }[] =
  [
    {
      key: "maharashtra",
      label: "Maharashtra",
      cities: ["Mumbai", "Pune", "Nagpur"],
    },
    {
      key: "gujarat",
      label: "Gujarat",
      cities: ["Ahmedabad", "Surat", "Vadodara"],
    },
    {
      key: "karnataka",
      label: "Karnataka",
      cities: ["Bengaluru", "Mysuru", "Hubballi"],
    },
    {
      key: "tamil_nadu",
      label: "Tamil Nadu",
      cities: ["Chennai", "Coimbatore", "Madurai"],
    },
    { key: "delhi", label: "Delhi", cities: ["New Delhi"] },
    {
      key: "uttar_pradesh",
      label: "Uttar Pradesh",
      cities: ["Lucknow", "Kanpur", "Noida"],
    },
    { key: "west_bengal", label: "West Bengal", cities: ["Kolkata", "Howrah"] },
    { key: "telangana", label: "Telangana", cities: ["Hyderabad", "Warangal"] },
  ];
