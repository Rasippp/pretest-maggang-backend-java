import React, { useEffect, useState } from "react";
import {
  konfirmasiPesanan,
  packingPesanan,
  kirimPesanan,
} from "../../services/PesananService";
import api from "../../services/api";

const AdminPesananPage = () => {
  const [pesanans, setPesanans] = useState([]);

  useEffect(() => {
    fetchPesanans();
  }, []);

  const fetchPesanans = async () => {
    try {
      const response = await api.get("/api/pesanans/admin");
      setPesanans(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pesanan admin", error);
    }
  };

  const handleAksi = async (aksi, id) => {
    try {
      if (aksi === "konfirmasi") await konfirmasiPesanan(id);
      else if (aksi === "packing") await packingPesanan(id);
      else if (aksi === "kirim") await kirimPesanan(id);

      fetchPesanans(); // Refresh data setelah aksi
    } catch (error) {
      console.error(`Gagal melakukan aksi ${aksi}:`, error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Semua Pesanan</h1>
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
              <td className="p-2 border">
                {new Date(p.tanggal).toLocaleDateString()}
              </td>
              <td className="p-2 border">
                Rp {p.total?.toLocaleString("id-ID")}
              </td>
              <td className="p-2 border">{p.statusPesanan}</td>
              <td className="p-2 border">
                {p.statusPesanan === "DRAFT" && (
                  <button
                    onClick={() => handleAksi("konfirmasi", p.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-1"
                  >
                    Konfirmasi
                  </button>
                )}
                {p.statusPesanan === "PEMBAYARAN" && (
                  <button
                    onClick={() => handleAksi("packing", p.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  >
                    Packing
                  </button>
                )}
                {p.statusPesanan === "PACKING" && (
                  <button
                    onClick={() => handleAksi("kirim", p.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Kirim
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

export default AdminPesananPage;
