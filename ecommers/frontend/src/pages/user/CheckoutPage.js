import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { createPesanan } from '../../services/PesananService';


const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [alamat, setAlamat] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
  console.log("cartItems:", cartItems);
}, [cartItems]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError('Keranjang kosong.');
      return;
    }

    const items = cartItems.map((item) => ({
      produkId: item.produk.id,
      kuantitas: item.quantity,
    }));

    const pesananData = {
      ongkir: 10000,
      alamatPengiriman: alamat,
      items: items,
    };

    console.log("Data yang dikirim ke backend:", pesananData);

    try {
      setIsSubmitting(true);
      setError(null);

      await createPesanan(pesananData);
      clearCart();
      navigate('/user/pesanan');
    } catch (err) {
      console.error('Checkout error:', err);
      console.error('Response data:', err.response?.data);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat proses checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <div className="mb-4">
          <label>Alamat Pengiriman</label>
          <textarea
            name="alamat"
            required
            value={alamat}
            onChange={(e) => setAlamat(e.target.value)}
            className="w-full border px-3 py-2"
          />
        </div>

        <div className="mb-4">
          <label>Total</label>
          <p className="font-semibold">Rp {cartTotal.toLocaleString('id-ID')}</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {isSubmitting ? 'Memproses...' : 'Konfirmasi Pesanan'}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
