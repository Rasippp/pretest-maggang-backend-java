import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPesananByUser, batalkanPesanan, konfirmasiPesanan, terimaPesanan } from '../../services/PesananService';

const PesananListPage = () => {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        const response = await getPesananByUser();
        setPesanan(response.data);
      } catch (err) {
        setError('Gagal memuat pesanan. Silakan coba lagi.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPesanan();
  }, []);

  const handleBatalkan = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      try {
        await batalkanPesanan(id);
        setPesanan(pesanan.map(p => p.id === id ? {...p, status: 'dibatalkan'} : p));
      } catch (error) {
        alert('Gagal membatalkan pesanan');
      }
    }
  };

  const handleKonfirmasi = async (id) => {
    try {
      await konfirmasiPesanan(id);
      setPesanan(pesanan.map(p => p.id === id ? {...p, status: 'dikonfirmasi'} : p));
    } catch (error) {
      alert('Gagal mengkonfirmasi pembayaran');
    }
  };

  const handleTerima = async (id) => {
    try {
      await terimaPesanan(id);
      setPesanan(pesanan.map(p => p.id === id ? {...p, status: 'selesai'} : p));
    } catch (error) {
      alert('Gagal mengonfirmasi penerimaan pesanan');
    }
  };

  if (loading) return <div className="text-center py-8">Memuat pesanan...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Daftar Pesanan</h1>
      
      {pesanan.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Anda belum memiliki pesanan</p>
          <Link 
            to="/user/produk" 
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID Pesanan</th>
                <th className="py-2 px-4 border-b">Tanggal</th>
                <th className="py-2 px-4 border-b">Total</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pesanan.map(order => (
                <tr key={order.id}>
                  <td className="py-2 px-4 border-b text-center">{order.id}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {new Date(order.tanggal).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-2 px-4 border-b text-center">Rp {order.total.toLocaleString('id-ID')}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'selesai' ? 'bg-green-200 text-green-800' : 
                      order.status === 'diproses' ? 'bg-yellow-200 text-yellow-800' : 
                      order.status === 'dibatalkan' ? 'bg-red-200 text-red-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <Link 
                      to={`/user/pesanan/${order.id}`}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Detail
                    </Link>
                    
                    {order.status === 'menunggu_pembayaran' && (
                      <button
                        onClick={() => handleKonfirmasi(order.id)}
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
                        Konfirmasi
                      </button>
                    )}
                    
                    {order.status === 'dikirim' && (
                      <button
                        onClick={() => handleTerima(order.id)}
                        className="text-green-600 hover:text-green-800 mr-2"
                      >
                        Terima
                      </button>
                    )}
                    
                    {['menunggu_pembayaran', 'diproses'].includes(order.status) && (
                      <button
                        onClick={() => handleBatalkan(order.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Batalkan
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PesananListPage;