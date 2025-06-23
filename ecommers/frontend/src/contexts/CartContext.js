import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // pastikan ini benar

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // ⏫ Hitung total saat cart berubah
  useEffect(() => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.produk.harga * item.quantity,
      0
    );
    setCartTotal(total);
  }, [cartItems]);

  // ✅ Ambil data keranjang dari backend saat load
  useEffect(() => {
    const fetchKeranjang = async () => {
      try {
        const res = await api.get('/api/keranjangs');
        const mapped = res.data.map(item => ({
          produk: item.produk,
          quantity: item.kuantitas,
        }));
        setCartItems(mapped);
      } catch (err) {
        console.error('Gagal mengambil keranjang:', err);
      }
    };
    fetchKeranjang();
  }, []);

  const addToCart = async (produk, quantity = 1) => {
    const existingItem = cartItems.find(item => item.produk.id === produk.id);
    let updatedItems;

    if (existingItem) {
      updatedItems = cartItems.map(item =>
        item.produk.id === produk.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [...cartItems, { produk, quantity }];
    }

    setCartItems(updatedItems);

    try {
      await api.post('/api/keranjangs', {
        produkId: produk.id,
        kuantitas: quantity
      });
    } catch (err) {
      console.error('Gagal menyimpan ke backend keranjang', err);
    }
  };

  const updateQuantity = async (produkId, qty) => {
    if (qty <= 0) {
      removeFromCart(produkId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.produk.id === produkId
        ? { ...item, quantity: qty }
        : item
    );
    setCartItems(updatedItems);

    try {
      await api.patch(`/api/keranjangs/${produkId}?kuantitas=${qty}`);
    } catch (err) {
      console.error('Gagal update kuantitas di backend', err);
    }
  };

  const removeFromCart = async (produkId) => {
    setCartItems(prev => prev.filter(item => item.produk.id !== produkId));
    try {
      await api.delete(`/api/keranjangs/${produkId}`);
    } catch (err) {
      console.error('Gagal hapus item keranjang di backend', err);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    try {
      await api.delete('/api/keranjangs/clear');
    } catch (err) {
      console.error('Gagal menghapus seluruh keranjang di backend', err);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
