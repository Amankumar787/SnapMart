import api from "./api";

const paymentService = {
  createRazorpayOrder: async (orderId) => {
    const { data } = await api.post("/payments/create-order", { orderId });
    return data;
  },
  verifyPayment: async (payload) => {
    const { data } = await api.post("/payments/verify", payload);
    return data;
  },
};

export default paymentService;