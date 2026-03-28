import api from "./api";

const cartService = {
  getCart: async () => {
    const { data } = await api.get("/cart");
    return data;
  },
  addToCart: async (productId, quantity = 1) => {
    const { data } = await api.post("/cart", { productId, quantity });
    return data;
  },
  updateCartItem: async (itemId, quantity) => {
    const { data } = await api.put(`/cart/${itemId}`, { quantity });
    return data;
  },
  removeFromCart: async (itemId) => {
    const { data } = await api.delete(`/cart/${itemId}`);
    return data;
  },
  clearCart: async () => {
    const { data } = await api.delete("/cart");
    return data;
  },
};

export default cartService;