import api from "./api";

const paymentService = {
  createPaymentIntent: async (orderId) => {
    const { data } = await api.post("/payments/create-intent", { orderId });
    return data;
  },
  verifyPayment: async (paymentIntentId, orderId) => {
    const { data } = await api.post("/payments/verify", { paymentIntentId, orderId });
    return data;
  },
};

export default paymentService;