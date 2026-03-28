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
};

export default orderService;