import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const CartPage = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Keranjang belanja Anda kosong');
      return;
    }
    navigate('/user/checkout');
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Keranjang belanja Anda kosong</p>
          <Link
            to="/user/produk"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div key={item.produk.id} className="flex items-center border-b border-gray-200 py-4">
                <img
                  src={item.produk.gambar || '/placeholder.jpg'}
                  alt={item.produk.nama}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold text-lg">{item.produk.nama}</h3>
                  <p className="text-gray-600">Rp {item.produk.harga.toLocaleString('id-ID')}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.produk.id, item.quantity - 1)}
                      className="px-3 py-1 bg-gray-200 rounded-l"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.produk.id, item.quantity + 1)}
                      className="px-3 py-1 bg-gray-200 rounded-r"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.produk.id)}
                      className="ml-4 text-red-600 hover:text-red-800"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="font-semibold">Rp {(item.produk.harga * item.quantity).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Belanja</h2>
            <div className="space-y-2 mb-4">
              {cartItems.map(item => (
                <div key={item.produk.id} className="flex justify-between">
                  <div>
                    <p>{item.produk.nama}</p>
                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                  </div>
                  <p>Rp {(item.produk.harga * item.quantity).toLocaleString('id-ID')}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-300 pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
            >
              Lanjut ke Pembayaran
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;