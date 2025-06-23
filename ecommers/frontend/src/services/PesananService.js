    import api from "./api";

    export const createPesanan = async (data) => {
    return await api.post("/api/pesanans", data);
    };

    export const getPesananByUser = async () => {
    return await api.get("/api/pesanans"); // endpoint user
    };

    export const getPesananById = async (id) => {
    return await api.get(`/api/pesanans/${id}`);
    };

    export const konfirmasiPesanan = async (pesananId) => {
    return await api.patch(`/api/pesanans/${pesananId}/konfirmasi`);
    };

    export const batalkanPesanan = async (pesananId) => {
    return await api.patch(`/api/pesanans/${pesananId}/cancel`);
    };

    export const terimaPesanan = async (pesananId) => {
    return await api.patch(`/api/pesanans/${pesananId}/terima`);
    };      


export const packingPesanan = async (id) => {
  return await api.patch(`/api/pesanans/${id}/packing`);
};

export const kirimPesanan = async (id) => {
  return await api.patch(`/api/pesanans/${id}/kirim`);
};
