export const WhatsAppService = {
  async sendReceipt() {
    return {
      queued: false,
      provider: null,
      message: "WhatsApp provider is not configured",
    };
  },
  async sendStatement() {
    return {
      queued: false,
      provider: null,
      message: "WhatsApp provider is not configured",
    };
  },
  async sendReminder() {
    return {
      queued: false,
      provider: null,
      message: "WhatsApp provider is not configured",
    };
  },
};
