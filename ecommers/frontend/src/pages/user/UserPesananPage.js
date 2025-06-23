import React, { useEffect, useState } from "react";
import { batalkanPesanan, terimaPesanan } from "../../services/PesananService";
import api from "../../services/api";

const UserPesananPage = () => {
  const [pesanans, setPesanans] = useState([]);

  useEffect(() => {
    fetchPesanans();
  }, []);

  const fetchPesanans = async () => {
    try {
      const response = await api.get("/api/pesanans");
      setPesanans(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan user", error);
    }
  };

  const handleAksi = async (aksi, id) => {
    try {
      if (aksi === "cancel") {
        const konfirmasi = window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?");
        if (!konfirmasi) return;
        await batalkanPesanan(id);
      } else if (aksi === "terima") {
        const konfirmasi = window.confirm("Apakah Anda yakin ingin menandai pesanan sebagai diterima?");
        if (!konfirmasi) return;
        await terimaPesanan(id);
      }

      fetchPesanans();
    } catch (error) {
      console.error(`Gagal melakukan aksi ${aksi}:`, error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pesanan Saya</h1>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tanggal</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pesanans.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.id}</td>
              <td className="p-2 border">{new Date(p.tanggal).toLocaleDateString()}</td>
              <td className="p-2 border">Rp {p.total?.toLocaleString("id-ID")}</td>
              <td className="p-2 border">{p.statusPesanan}</td>
              <td className="p-2 border">
                {p.statusPesanan === "DRAFT" && (
                  <button
                    onClick={() => handleAksi("cancel", p.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-1"
                  >
                    Batalkan
                  </button>
                )}
                {p.statusPesanan === "PENGIRIMAN" && (
                  <button
                    onClick={() => handleAksi("terima", p.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Terima
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPesananPage;
