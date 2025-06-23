import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { findAllProduk } from "../../services/ProdukService";

const ProdukListPage = () => {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const response = await findAllProduk();
        setProduk(response.data);
      } catch (err) {
        setError('Gagal memuat produk. Silakan coba lagi.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, []);

  const handleAddToCart = (produk) => {
    try {
      addToCart({
        id: produk.id,
        nama: produk.nama,
        harga: produk.harga,
        gambar: produk.gambar,
        deskripsi: produk.deskripsi,
        kategori: produk.kategori,
        stok: produk.stok
      });
      alert('Produk berhasil ditambahkan ke keranjang');
    } catch (error) {
      alert('Gagal menambahkan produk ke keranjang');
    }
  };

  if (loading) return <div className="text-center py-8">Memuat produk...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Daftar Produk</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {produk.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <Link to={`/user/produk/${item.id}`}>
              <img 
                src={`/api/images/${item.gambar}` || '/placeholder.jpg'} 
                alt={item.nama}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.nama}</h3>
                <p className="text-gray-600 mb-4">Rp {item.harga.toLocaleString('id-ID')}</p>
              </div>
            </Link>
            <button
              onClick={() => handleAddToCart(item)}
              className="w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition-colors"
            >
              + Keranjang
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProdukListPage;
