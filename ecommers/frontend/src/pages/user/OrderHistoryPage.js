import React, { useEffect, useState } from 'react';
import { getPesananByUser } from '../../services/PesananService';

const formatStatus = (status) => {
  switch (status) {
    case 'DRAFT': return 'Belum dikonfirmasi';
    case 'PEMBAYARAN': return 'Sudah dibayar';
    case 'PACKING': return 'Sedang dipacking';
    case 'PENGIRIMAN': return 'Sedang dikirim';
    case 'SELESAI': return 'Selesai';
    case 'DIBATALKAN': return 'Dibatalkan';
    default: return status || 'Tidak diketahui';
  }
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getPesananByUser();
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Gagal memuat riwayat pesanan');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-4">Memuat riwayat pesanan...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Riwayat Pesanan</h1>
      {orders.length === 0 ? (
        <p>Belum ada pesanan.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded shadow">
              <p><strong>Nomor:</strong> {order.nomor}</p>
              <p><strong>Tanggal:</strong> {new Date(order.waktuPesan).toLocaleString('id-ID')}</p>
              <p><strong>Total:</strong> Rp {order.total.toLocaleString('id-ID')}</p>
              <p><strong>Status:</strong> {formatStatus(order.statusPesanan)}</p>
              <p><strong>Alamat:</strong> {order.alamatPengiriman}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
