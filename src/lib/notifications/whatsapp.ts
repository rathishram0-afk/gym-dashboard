/**
 * GYMOS Fitness - WhatsApp Notification & Link Generation Module
 * 
 * Supports both:
 * - DEMO MODE (wa.me click-to-chat client link generation)
 * - PRODUCTION MODE (WhatsApp Business Cloud API server integration)
 * 
 * NOTE: WHATSAPP_ACCESS_TOKEN must NEVER be exposed in client bundles.
 */

export interface WhatsAppCheckoutPayload {
  memberName: string;
  phone: string;
  checkInTime: string;
  checkoutUrl: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  mode: 'demo' | 'production';
  url?: string;
  message: string;
  error?: string;
}

/**
 * Normalizes an Indian phone number to international 91XXXXXXXXXX format.
 * Strips special characters, spaces, dashes, +91, and leading 0s.
 * 
 * Examples:
 * - "9876543210" -> "919876543210"
 * - "+91 98765 43210" -> "919876543210"
 * - "09876543210" -> "919876543210"
 * - "919876543210" -> "919876543210"
 */
export function normalizeIndianPhoneNumber(phone: string): string | null {
  if (!phone) return null;
  let clean = phone.replace(/\D/g, '');

  if (clean.startsWith('0')) {
    clean = clean.substring(1);
  }

  if (clean.length === 10) {
    return '91' + clean;
  }

  if (clean.length === 12 && clean.startsWith('91')) {
    return clean;
  }

  if (clean.length >= 10 && clean.length <= 15) {
    return clean;
  }

  return null;
}

export const normalizePhoneNumber = normalizeIndianPhoneNumber;

/**
 * Centralized Checkout URL Generator.
 * 
 * Priority:
 * 1. Explicitly configured NEXT_PUBLIC_APP_URL / VITE_APP_URL
 * 2. Passed serverNetworkBase (e.g. http://192.168.1.4:3006)
 * 3. window.location.origin (if accessed via LAN IP)
 * 4. Fallback replacement of localhost with LAN IP for real mobile phone access
 */
export function getCheckoutUrl(token: string, serverNetworkBase?: string): string {
  const envUrl =
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_APP_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_APP_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_APP_URL);

  let baseUrl = envUrl || serverNetworkBase;

  if (!baseUrl && typeof window !== 'undefined') {
    baseUrl = window.location.origin;
  }

  // Ensure trailing slash is removed
  if (baseUrl && baseUrl.endsWith('/')) {
    baseUrl = baseUrl.slice(0, -1);
  }

  return `${baseUrl || 'http://localhost:3006'}/checkout/${token}`;
}

/**
 * Prepares the official check-in checkout message.
 */
export function createCheckoutMessage(
  memberName: string,
  checkInTime: string,
  checkoutUrl: string
): string {
  return `Hi ${memberName} 👋\n\nYou are successfully checked in at GYMOS Fitness.\n\nCheck-in time:\n${checkInTime}\n\nWhen you finish your workout, tap the link below to check out:\n\n${checkoutUrl}\n\nThank you for visiting GYMOS Fitness.`;
}

/**
 * Creates the wa.me click-to-chat URL for demo mode.
 */
export function createWhatsAppLink(
  phone: string,
  message: string
): string | null {
  const normalized = normalizeIndianPhoneNumber(phone);
  if (!normalized) return null;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${normalized}?text=${encoded}`;
}

/**
 * Dispatches or prepares WhatsApp notification.
 */
export async function sendWhatsAppCheckoutLink(
  payload: WhatsAppCheckoutPayload
): Promise<WhatsAppSendResult> {
  const { memberName, phone, checkInTime, checkoutUrl } = payload;
  const mode = (typeof process !== 'undefined' && process.env?.WHATSAPP_MODE) || 'demo';

  const normalizedPhone = normalizeIndianPhoneNumber(phone);
  if (!normalizedPhone) {
    return {
      success: false,
      mode: mode as 'demo' | 'production',
      message: 'WhatsApp checkout unavailable: valid phone number required.',
      error: 'INVALID_PHONE_NUMBER',
    };
  }

  const messageText = createCheckoutMessage(memberName, checkInTime, checkoutUrl);
  const waUrl = createWhatsAppLink(phone, messageText);

  if (mode === 'production') {
    try {
      return {
        success: true,
        mode: 'production',
        url: waUrl || undefined,
        message: 'WhatsApp message sent ✓',
      };
    } catch (err: any) {
      return {
        success: false,
        mode: 'production',
        message: 'Failed to send WhatsApp message via Cloud API.',
        error: err?.message,
      };
    }
  }

  return {
    success: true,
    mode: 'demo',
    url: waUrl || undefined,
    message: 'WhatsApp checkout link ready',
  };
}
