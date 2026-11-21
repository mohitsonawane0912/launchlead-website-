export interface ContactEnquiryInput {
  name: string;
  email: string;
  message: string;
  _hp?: string; // Honeypot field
}

export interface StudentRegistrationInput {
  fullName: string;
  age: number | string;
  grade: string;
  city: string;
  state: string;
  email: string;
  mobile: string;
  plan: string;
  startupIdea?: string;
  guardianConsent?: boolean;
  privacyConsent: boolean;
  _hp?: string; // Honeypot field
}

export interface ValidationResult<T> {
  isValid: boolean;
  errors: Record<string, string>;
  data?: T;
}

// Regex for standard email validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// 10-digit Indian mobile number regex (starts with 6, 7, 8, or 9)
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

export function validateContactEnquiry(input: any): ValidationResult<{
  name: string;
  email: string;
  message: string;
}> {
  const errors: Record<string, string> = {};

  if (!input || typeof input !== 'object') {
    return { isValid: false, errors: { form: 'Invalid submission data.' } };
  }

  // Honeypot check
  if (input._hp && String(input._hp).trim() !== '') {
    return { isValid: false, errors: { form: 'Spam detected.' } };
  }

  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';

  if (!name) {
    errors.name = 'Your Name is required.';
  } else if (name.length < 2 || name.length > 100) {
    errors.name = 'Name must be between 2 and 100 characters.';
  }

  if (!email) {
    errors.email = 'Your Email is required.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!message) {
    errors.message = 'Your Message is required.';
  } else if (message.length < 10) {
    errors.message = 'Please provide a message with at least 10 characters.';
  } else if (message.length > 3000) {
    errors.message = 'Message must not exceed 3000 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: Object.keys(errors).length === 0 ? { name, email, message } : undefined,
  };
}

export function validateStudentRegistration(
  input: any,
  allowedPlans: string[] = ['basic', 'premium']
): ValidationResult<{
  fullName: string;
  age: number;
  grade: string;
  city: string;
  state: string;
  email: string;
  mobile: string;
  plan: string;
  startupIdea?: string;
  guardianConsent: boolean;
  privacyConsent: boolean;
}> {
  const errors: Record<string, string> = {};

  if (!input || typeof input !== 'object') {
    return { isValid: false, errors: { form: 'Invalid submission data.' } };
  }

  // Honeypot check
  if (input._hp && String(input._hp).trim() !== '') {
    return { isValid: false, errors: { form: 'Spam detected.' } };
  }

  const fullName = typeof input.fullName === 'string' ? input.fullName.trim() : '';
  const parsedAge = parseInt(String(input.age), 10);
  const grade = typeof input.grade === 'string' ? input.grade.trim() : '';
  const city = typeof input.city === 'string' ? input.city.trim() : '';
  const state = typeof input.state === 'string' ? input.state.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const cleanMobile = typeof input.mobile === 'string' ? input.mobile.replace(/\D/g, '') : '';
  const plan = typeof input.plan === 'string' ? input.plan.trim().toLowerCase() : '';
  const startupIdea = typeof input.startupIdea === 'string' ? input.startupIdea.trim() : '';
  const guardianConsent = Boolean(input.guardianConsent);
  const privacyConsent = Boolean(input.privacyConsent);

  if (!fullName) {
    errors.fullName = 'Student Full Name is required.';
  } else if (fullName.length < 2 || fullName.length > 100) {
    errors.fullName = 'Full Name must be between 2 and 100 characters.';
  }

  if (isNaN(parsedAge) || parsedAge < 5 || parsedAge > 99) {
    errors.age = 'Please enter a valid age (between 5 and 99).';
  }

  if (!grade) {
    errors.grade = 'Class / Grade is required (e.g. Grade 10).';
  }

  if (!city) {
    errors.city = 'City is required.';
  }

  if (!state) {
    errors.state = 'State is required.';
  }

  if (!email) {
    errors.email = 'Email Address is required.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!cleanMobile) {
    errors.mobile = 'Mobile Number is required.';
  } else if (!INDIAN_MOBILE_REGEX.test(cleanMobile)) {
    errors.mobile = 'Please enter a valid 10-digit Indian mobile number starting with 6-9.';
  }

  if (!plan) {
    errors.plan = 'Please select a program plan.';
  } else if (!allowedPlans.includes(plan)) {
    errors.plan = 'Invalid plan selected. Please choose a valid plan.';
  }

  if (parsedAge < 18 && !guardianConsent) {
    errors.guardianConsent =
      'Parent or guardian consent is required for students under 18.';
  }

  if (!privacyConsent) {
    errors.privacyConsent = 'You must agree to the privacy notice to proceed.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data:
      Object.keys(errors).length === 0
        ? {
            fullName,
            age: parsedAge,
            grade,
            city,
            state,
            email,
            mobile: cleanMobile,
            plan,
            startupIdea: startupIdea || undefined,
            guardianConsent,
            privacyConsent,
          }
        : undefined,
  };
}
