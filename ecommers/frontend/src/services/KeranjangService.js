import api from "./api";

export const fetchKeranjang = async () => {
  return await api.get('/api/keranjangs');
};

export const addToKeranjang = async (data) => {
  return await api.post("/api/keranjangs", data);
};

export const getKeranjang = async () => {
  return await api.get("/api/keranjangs");
};

export const updateItem = async (id, data) => {
  return await api.put(`/api/keranjangs/${id}`, data);
};

export const deleteItem = async (id) => {
  return await api.delete(`/api/keranjangs/${id}`);
};

