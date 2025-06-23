import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useCart } from '../../contexts/CartContext';

const ProdukDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const response = await api.get(`/api/produks/${id}`);
        setProduk(response.data);
      } catch (err) {
        setError('Produk tidak ditemukan.');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, [id]);

  const tambahKeKeranjang = () => {
    if (!produk) return;
    if (quantity > produk.stok) {
      alert('Jumlah melebihi stok yang tersedia!');
      return;
    }
    addToCart(produk, quantity);
    alert('Produk berhasil ditambahkan ke keranjang!');
  };

  const handleBeliLangsung = () => {
    if (!produk) return;
    if (quantity > produk.stok) {
      alert('Jumlah melebihi stok yang tersedia!');
      return;
    }
    addToCart(produk, quantity);
    navigate('/user/checkout');
  };

  if (loading) return <div className="text-center py-8">Memuat detail produk...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img 
            src={`http://localhost:8080/api/gambar/${produk.gambar}`} 
            alt={produk.nama}
            className="w-full rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{produk.nama}</h1>
          <p className="text-2xl text-blue-600 mb-2">Rp {produk.harga.toLocaleString('id-ID')}</p>
          <p className="text-sm text-gray-600 mb-4">Sisa Stok: {produk.stok}</p>
          <p className="text-gray-700 mb-6">{produk.deskripsi}</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah
            </label>
            <input
              type="number"
              min="1"
              max={produk.stok}
              value={quantity}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val >= 1 && val <= produk.stok) {
                  setQuantity(val);
                }
              }}
              className="w-20 px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={tambahKeKeranjang}
              className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
            >
              + Keranjang
            </button>
            <button
              onClick={handleBeliLangsung}
              className="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdukDetailPage;
