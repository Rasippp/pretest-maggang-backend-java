import React, { useState, useEffect } from 'react';

import { useParams, Link } from 'react-router-dom';
import { getPesananById, batalkanPesanan, konfirmasiPesanan, terimaPesanan } from '../../services/PesananService';

const PesananDetailPage = () => {
  const { id } = useParams();
  const [pesanan, setPesanan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        const response = await getPesananById(id);
        setPesanan(response.data);
      } catch (err) {
        setError('Gagal memuat detail pesanan.');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPesanan();
  }, [id]);

  const handleBatalkan = async () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      try {
        await batalkanPesanan(id);
        setPesanan({...pesanan, status: 'dibatalkan'});
        alert('Pesanan berhasil dibatalkan');
      } catch (error) {
        alert('Gagal membatalkan pesanan');
      }
    }
  };

  const handleKonfirmasi = async () => {
    try {
      await konfirmasiPesanan(id);
      setPesanan({...pesanan, status: 'dikonfirmasi'});
      alert('Pembayaran berhasil dikonfirmasi');
    } catch (error) {
      alert('Gagal mengkonfirmasi pembayaran');
    }
  };

  const handleTerima = async () => {
    try {
      await terimaPesanan(id);
      setPesanan({...pesanan, status: 'selesai'});
      alert('Pesanan berhasil diterima');
    } catch (error) {
      alert('Gagal mengonfirmasi penerimaan pesanan');
    }
  };

  if (loading) return <div className="text-center py-8">Memuat detail pesanan...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!pesanan) return <div className="text-center py-8">Pesanan tidak ditemukan.</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Detail Pesanan #{pesanan.id}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Informasi Pesanan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><strong>Tanggal:</strong> {new Date(pesanan.tanggal).toLocaleString('id-ID')}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                pesanan.status === 'selesai' ? 'bg-green-200 text-green-800' : 
                pesanan.status === 'diproses' ? 'bg-yellow-200 text-yellow-800' : 
                pesanan.status === 'dibatalkan' ? 'bg-red-200 text-red-800' :
                'bg-blue-200 text-blue-800'
              }`}>
                {pesanan.status}
              </span>
            </p>
          </div>
          <div>
            <p><strong>Total:</strong> Rp {pesanan.total.toLocaleString('id-ID')}</p>
            <p><strong>Metode Pembayaran:</strong> {pesanan.metodePembayaran}</p>
          </div>
          <div className="md:col-span-2">
            <p><strong>Alamat Pengiriman:</strong> {pesanan.alamat}</p>
            {pesanan.catatan && <p><strong>Catatan:</strong> {pesanan.catatan}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Item Pesanan</h2>
        <div className="space-y-4">
          {pesanan.items.map(item => (
            <div key={item.id} className="flex items-center border-b border-gray-200 pb-4">
              <img 
                src={`/api/images/${item.produk.gambar}` || '/placeholder.jpg'} 
                alt={item.produk.nama}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold">{item.produk.nama}</h3>
                <p className="text-gray-600">Rp {item.hargaSatuan.toLocaleString('id-ID')}</p>
              </div>
              <div className="ml-4">
                <p className="font-semibold">x{item.quantity}</p>
                <p className="text-right">Rp {(item.hargaSatuan * item.quantity).toLocaleString('id-ID')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {pesanan.status === 'menunggu_pembayaran' && (
          <button
            onClick={handleKonfirmasi}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Konfirmasi Pembayaran
          </button>
        )}
        
        {pesanan.status === 'dikirim' && (
          <button
            onClick={handleTerima}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Konfirmasi Diterima
          </button>
        )}
        
        {['menunggu_pembayaran', 'diproses'].includes(pesanan.status) && (
          <button
            onClick={handleBatalkan}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Batalkan Pesanan
          </button>
        )}
        
        <Link 
          to="/user/pesanan"
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          Kembali ke Daftar
        </Link>
      </div>
    </div>
  );
};

export default PesananDetailPage;