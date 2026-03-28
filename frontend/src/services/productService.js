import api from "./api";

const productService = {
  getProducts: async (params) => {
    const { data } = await api.get("/products", { params });
    return data;
  },
  getProduct: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
  addReview: async (id, reviewData) => {
    const { data } = await api.post(`/products/${id}/reviews`, reviewData);
    return data;
  },
};

export default productService;