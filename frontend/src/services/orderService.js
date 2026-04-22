import api from "./api";

const orderService = {
  createOrder: async (orderData) => {
    const { data } = await api.post("/orders", orderData);
    return data;
  },
  getMyOrders: async () => {
    const { data } = await api.get("/orders/my");
    return data;
  },
  getOrder: async (id) => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },
  applyCoupon: async (code) => {
    const { data } = await api.post("/coupons/apply", { code });
    return data;
  },
  removeCoupon: async () => {
    const { data } = await api.delete("/coupons/remove");
    return data;
  },
};

export default orderService;