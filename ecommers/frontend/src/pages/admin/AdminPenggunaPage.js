import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminPenggunaPage = () => {
  const [penggunas, setPenggunas] = useState([]);

  useEffect(() => {
    fetchPenggunas();
  }, []);

  const fetchPenggunas = async () => {
    try {
         const response = await api.get("/api/penggunas"); // ganti sesuai endpoint backend kamu
         console.log(response.data);
         setPenggunas(response.data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Pengguna</h1>
      <table className="w-full table-auto border">
        <thead>
  <tr className="bg-gray-200">
    <th className="p-2 border">ID</th>
    <th className="p-2 border">nama</th> 
    <th className="p-2 border">Email</th>
    <th className="p-2 border">Role</th>
  </tr>
</thead>
        <tbody>
  {penggunas.map((p) => (
    <tr key={p.id}>
      <td className="p-2 border">{p.id}</td>
      <td className="p-2 border">{p.nama}</td>       {/* bukan p.username */}
      <td className="p-2 border">{p.email}</td>
      <td className="p-2 border">{p.roles}</td>       {/* roles tipe string */}
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
};

export default AdminPenggunaPage;
