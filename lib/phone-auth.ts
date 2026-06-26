import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !phoneNumber) {
  console.warn("Twilio credentials not configured");
}

const client = twilio(accountSid, authToken);

export interface PhoneAuthSession {
  phoneNumber: string;
  verificationCode: string;
  expiresAt: Date;
  attempts: number;
}

// Store sessions in memory (use Redis in production)
const phoneSessions = new Map<string, PhoneAuthSession>();

/**
 * Send OTP to phone number
 */
export async function sendPhoneOTP(phoneNumber: string): Promise<{
  success: boolean;
  message: string;
  sessionId?: string;
}> {
  try {
    // Validate phone number format
    if (!phoneNumber.startsWith("+")) {
      return {
        success: false,
        message: "Phone number must include country code (e.g., +234)",
      };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send SMS
    if (client) {
      await client.messages.create({
        body: `Your AfriMatch verification code is: ${otp}. Valid for 10 minutes.`,
        from: phoneNumber,
        to: phoneNumber,
      });
    }

    // Store session
    const sessionId = `${phoneNumber}_${Date.now()}`;
    phoneSessions.set(sessionId, {
      phoneNumber,
      verificationCode: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      attempts: 0,
    });

    return {
      success: true,
      message: "OTP sent successfully",
      sessionId,
    };
  } catch (error) {
    console.error("Phone OTP error:", error);
    return {
      success: false,
      message: "Failed to send OTP. Please try again.",
    };
  }
}

/**
 * Verify phone OTP
 */
export async function verifyPhoneOTP(
  sessionId: string,
  otp: string
): Promise<{
  success: boolean;
  message: string;
  phoneNumber?: string;
}> {
  try {
    const session = phoneSessions.get(sessionId);

    if (!session) {
      return {
        success: false,
        message: "Session expired. Please request a new OTP.",
      };
    }

    // Check expiration
    if (new Date() > session.expiresAt) {
      phoneSessions.delete(sessionId);
      return {
        success: false,
        message: "OTP expired. Please request a new one.",
      };
    }

    // Check attempts
    if (session.attempts >= 3) {
      phoneSessions.delete(sessionId);
      return {
        success: false,
        message: "Too many attempts. Please request a new OTP.",
      };
    }

    // Verify OTP
    if (otp !== session.verificationCode) {
      session.attempts++;
      return {
        success: false,
        message: `Invalid OTP. ${3 - session.attempts} attempts remaining.`,
      };
    }

    // Success - clean up session
    phoneSessions.delete(sessionId);

    return {
      success: true,
      message: "Phone verified successfully",
      phoneNumber: session.phoneNumber,
    };
  } catch (error) {
    console.error("OTP verification error:", error);
    return {
      success: false,
      message: "Verification failed. Please try again.",
    };
  }
}

/**
 * Format phone number to international format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, "");

  // If doesn't start with +, assume it's missing country code
  if (!cleaned.startsWith("+")) {
    // Default to Nigeria (+234) if no country code
    return `+234${cleaned.slice(-10)}`;
  }

  return cleaned;
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // Check if it matches international format: +[country code][number]
  return /^\+\d{10,15}$/.test(formatted);
}

/**
 * Get country code from phone number
 */
export function getCountryCode(phone: string): string {
  const formatted = formatPhoneNumber(phone);
  const match = formatted.match(/^\+(\d+)/);
  return match ? match[1] : "";
}

/**
 * African country phone codes
 */
export const AFRICAN_COUNTRY_CODES: Record<string, { name: string; code: string }> = {
  "234": { name: "Nigeria", code: "+234" },
  "27": { name: "South Africa", code: "+27" },
  "256": { name: "Uganda", code: "+256" },
  "254": { name: "Kenya", code: "+254" },
  "255": { name: "Tanzania", code: "+255" },
  "233": { name: "Ghana", code: "+233" },
  "212": { name: "Morocco", code: "+212" },
  "213": { name: "Algeria", code: "+213" },
  "216": { name: "Tunisia", code: "+216" },
  "251": { name: "Ethiopia", code: "+251" },
  "260": { name: "Zambia", code: "+260" },
  "263": { name: "Zimbabwe", code: "+263" },
  "265": { name: "Malawi", code: "+265" },
  "267": { name: "Botswana", code: "+267" },
  "268": { name: "Eswatini", code: "+268" },
  "269": { name: "Mauritius", code: "+269" },
  "220": { name: "Gambia", code: "+220" },
  "221": { name: "Senegal", code: "+221" },
  "225": { name: "Ivory Coast", code: "+225" },
  "226": { name: "Burkina Faso", code: "+226" },
  "228": { name: "Togo", code: "+228" },
  "229": { name: "Benin", code: "+229" },
  "230": { name: "Mauritius", code: "+230" },
  "231": { name: "Liberia", code: "+231" },
  "232": { name: "Sierra Leone", code: "+232" },
  "235": { name: "Chad", code: "+235" },
  "236": { name: "Central African Republic", code: "+236" },
  "237": { name: "Cameroon", code: "+237" },
  "238": { name: "Cape Verde", code: "+238" },
  "239": { name: "Sao Tome and Principe", code: "+239" },
  "240": { name: "Equatorial Guinea", code: "+240" },
  "241": { name: "Gabon", code: "+241" },
  "242": { name: "Congo", code: "+242" },
  "243": { name: "Democratic Republic of Congo", code: "+243" },
  "244": { name: "Angola", code: "+244" },
  "245": { name: "Guinea-Bissau", code: "+245" },
  "246": { name: "Diego Garcia", code: "+246" },
  "248": { name: "Seychelles", code: "+248" },
  "249": { name: "Sudan", code: "+249" },
  "250": { name: "Rwanda", code: "+250" },
  "257": { name: "Burundi", code: "+257" },
  "258": { name: "Mozambique", code: "+258" },
  "261": { name: "Madagascar", code: "+261" },
  "262": { name: "Reunion", code: "+262" },
  "264": { name: "Namibia", code: "+264" },
  "266": { name: "Lesotho", code: "+266" },
  "290": { name: "Saint Helena", code: "+290" },
  "291": { name: "Eritrea", code: "+291" },
  "297": { name: "Aruba", code: "+297" },
  "298": { name: "Faroe Islands", code: "+298" },
  "299": { name: "Greenland", code: "+299" },
  "350": { name: "Gibraltar", code: "+350" },
  "352": { name: "Luxembourg", code: "+352" },
  "353": { name: "Ireland", code: "+353" },
  "354": { name: "Iceland", code: "+354" },
  "355": { name: "Albania", code: "+355" },
  "356": { name: "Malta", code: "+356" },
  "357": { name: "Cyprus", code: "+357" },
  "358": { name: "Finland", code: "+358" },
  "359": { name: "Bulgaria", code: "+359" },
  "370": { name: "Lithuania", code: "+370" },
  "371": { name: "Latvia", code: "+371" },
  "372": { name: "Estonia", code: "+372" },
  "373": { name: "Moldova", code: "+373" },
  "374": { name: "Armenia", code: "+374" },
  "375": { name: "Belarus", code: "+375" },
  "376": { name: "Andorra", code: "+376" },
  "377": { name: "Monaco", code: "+377" },
  "378": { name: "San Marino", code: "+378" },
  "380": { name: "Ukraine", code: "+380" },
  "381": { name: "Serbia", code: "+381" },
  "382": { name: "Montenegro", code: "+382" },
  "383": { name: "Kosovo", code: "+383" },
  "385": { name: "Croatia", code: "+385" },
  "386": { name: "Slovenia", code: "+386" },
  "387": { name: "Bosnia and Herzegovina", code: "+387" },
  "389": { name: "Macedonia", code: "+389" },
  "420": { name: "Czech Republic", code: "+420" },
  "421": { name: "Slovakia", code: "+421" },
  "423": { name: "Liechtenstein", code: "+423" },
  "500": { name: "Falkland Islands", code: "+500" },
};
