import React, { useState, useEffect } from "react";

// Single-file Shop React with Register/Login (email, username, password)
// - Accounts stored in localStorage (demo only)
// - Session stored in localStorage
// - Shows "Hi, username | Logout" in header when logged in
// - Profile modal with upload avatar saved to localStorage
// - Manual payment numbers (DANA & GoPay) and payment modal
// - WhatsApp auto-open after "Saya Sudah Bayar"
// Tailwind CSS utility classes assumed to be available

const SAMPLE_PRODUCTS = [
  { id: 1, title: "Kaos Retro", price: 119000, category: "Pakaian", img: "https://placehold.co/400x300?text=Kaos" },
  { id: 2, title: "Headset Gaming", price: 349000, category: "Elektronik", img: "https://placehold.co/400x300?text=Headset" },
  { id: 3, title: "Sepatu Running", price: 249000, category: "Sepatu", img: "https://placehold.co/400x300?text=Sepatu" },
  { id: 4, title: "Topi Snapback", price: 89900, category: "Aksesoris", img: "https://placehold.co/400x300?text=Topi" },
  { id: 5, title: "Powerbank 10.000mAh", price: 129000, category: "Elektronik", img: "https://placehold.co/400x300?text=Powerbank" },
];

function currencyIDR(n) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n);
}

function ProductCard({ p, onAdd }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col">
      <img src={p.img} alt={p.title} className="h-40 w-full object-cover rounded-md mb-4" />
      <h3 className="font-semibold text-lg">{p.title}</h3>
      <p className="text-sm text-gray-500">{p.category}</p>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xl font-bold">{currencyIDR(p.price)}</div>
        <button onClick={() => onAdd(p)} className="px-3 py-1 rounded-xl bg-indigo-600 text-white text-sm">Tambah</button>
      </div>
    </div>
  );
}

function Cart({ items, onRemove, onChangeQty, onClear }) {
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);
  return (
    <div className="bg-white rounded-2xl shadow p-4 max-h-[60vh] overflow-auto">
      <h2 className="font-bold text-lg">Keranjang</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 mt-2">Keranjang kosong</p>
      ) : (
        <div className="mt-3 space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-center gap-3">
              <img src={it.img} alt={it.title} className="w-14 h-14 rounded" />
              <div className="flex-1">
                <div className="font-semibold">{it.title}</div>
                <div className="text-sm text-gray-500">{currencyIDR(it.price)}</div>
                <div className="mt-1 flex items-center gap-2">
                  <button onClick={() => onChangeQty(it.id, Math.max(1, it.qty - 1))} className="px-2 py-1 rounded bg-gray-100">-</button>
                  <div className="w-8 text-center">{it.qty}</div>
                  <button onClick={() => onChangeQty(it.id, it.qty + 1)} className="px-2 py-1 rounded bg-gray-100">+</button>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{currencyIDR(it.price * it.qty)}</div>
                <button onClick={() => onRemove(it.id)} className="text-xs text-red-500 mt-2">Hapus</button>
              </div>
            </div>
          ))}
          <div className="border-t pt-3 flex items-center justify-between">
            <div className="font-semibold">Total</div>
            <div className="font-bold text-lg">{currencyIDR(total)}</div>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={onClear} className="flex-1 py-2 rounded-xl border">Kosongkan</button>
            <button className="flex-1 py-2 rounded-xl bg-green-600 text-white">Checkout (Mock)</button>
          </div>
        </div>
      )}
    </div>
  );
}

function AuthForm({ mode, onSwitch, onLogin, onRegister }) {
  // mode: 'login' | 'register'
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { setError(""); }, [mode]);

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === 'register') {
      if (!email || !username || !password || !confirm) return setError('Lengkapi semua field');
      if (password !== confirm) return setError('Password dan konfirmasi tidak cocok');
      onRegister({ email, username, password }, setError, () => {
        // clear form after successful register
        setEmail(''); setUsername(''); setPassword(''); setConfirm('');
      });
    } else {
      if (!password || (!email && !username)) return setError('Isi email/username dan password');
      onLogin({ identifier: email || username, password }, setError);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-bold mb-3">{mode === 'login' ? 'Login / Sign In' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === 'register' && (
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full px-3 py-2 rounded-xl border" />
        )}
        <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username (atau kosongkan saat login)" className="w-full px-3 py-2 rounded-xl border" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full px-3 py-2 rounded-xl border" />
        {mode === 'register' && (
          <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Confirm Password" type="password" className="w-full px-3 py-2 rounded-xl border" />
        )}
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex items-center justify-between">
          <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white">{mode === 'login' ? 'Login / Sign In' : 'Daftar'}</button>
          <button type="button" onClick={() => onSwitch(mode === 'login' ? 'register' : 'login')} className="text-sm text-gray-500">{mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}</button>
        </div>
      </form>
    </div>
  );
}

function ProfileModal({ open, onClose, profile, onSave }) {
  const [email, setEmail] = useState(profile?.email || "");
  const [avatar, setAvatar] = useState(profile?.avatar || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setEmail(profile?.email || "");
    setAvatar(profile?.avatar || "");
    setError("");
  }, [profile, open]);

  function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      setAvatar(evt.target.result); // base64
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!email) return setError("Email tidak boleh kosong");
    onSave({ ...profile, email, avatar });
    onClose();
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Edit Profil</h3>
        <div className="flex items-center gap-4">
          <img src={avatar || "https://i.pravatar.cc/80"} alt="avatar" className="w-20 h-20 rounded-full object-cover" />
          <div className="flex-1">
            <label className="text-sm text-gray-600">Ganti Foto</label>
            <input type="file" accept="image/*" onChange={handleFile} className="mt-2" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm">Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-xl border mt-1" />
        </div>
        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded-xl border">Batal</button>
          <button onClick={handleSave} className="px-3 py-2 rounded-xl bg-indigo-600 text-white">Simpan</button>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ open, onClose, onConfirm, danaNumber, gopayNumber }) {
  const [method, setMethod] = useState("DANA");

  useEffect(() => { if (open) setMethod("DANA"); }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Pembayaran</h3>
        <p className="text-sm text-gray-600">Silakan transfer ke salah satu nomor berikut, lalu klik <strong>Saya Sudah Bayar</strong>.</p>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-semibold">DANA</div>
              <div className="text-sm text-gray-600">{danaNumber}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => navigator.clipboard.writeText(danaNumber)} className="px-3 py-1 rounded-xl border text-sm">Salin</button>
              <button onClick={() => setMethod("DANA")} className={`px-3 py-1 rounded-xl text-sm ${method === "DANA" ? "bg-indigo-600 text-white" : "border"}`}>Pilih</button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-semibold">GoPay</div>
              <div className="text-sm text-gray-600">{gopayNumber}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={() => navigator.clipboard.writeText(gopayNumber)} className="px-3 py-1 rounded-xl border text-sm">Salin</button>
              <button onClick={() => setMethod("GOPAY")} className={`px-3 py-1 rounded-xl text-sm ${method === "GOPAY" ? "bg-indigo-600 text-white" : "border"}`}>Pilih</button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">Metode: <strong>{method}</strong></div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-3 py-2 rounded-xl border">Batal</button>
            <button onClick={() => onConfirm(method)} className="px-3 py-2 rounded-xl bg-green-600 text-white">Saya Sudah Bayar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopApp() {
  const [products] = useState(SAMPLE_PRODUCTS);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [cart, setCart] = useState(() => {
    try { const raw = localStorage.getItem('shop_cart_v1'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  });

  const [authMode, setAuthMode] = useState('login'); // which form to show when not logged in
  const [user, setUser] = useState(() => {
    try { const raw = localStorage.getItem('shop_session'); return raw ? JSON.parse(raw) : null; } catch { return null; }
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  useEffect(() => { localStorage.setItem('shop_cart_v1', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('shop_session', JSON.stringify(user)); }, [user]);

  // --- Auth helpers (localStorage-based, demo only) ---
  function loadUsers() {
    try { const raw = localStorage.getItem('shop_users'); return raw ? JSON.parse(raw) : []; } catch { return []; }
  }
  function saveUsers(users) { localStorage.setItem('shop_users', JSON.stringify(users)); }

  function handleRegister({ email, username, password }, setError, onSuccess) {
    const users = loadUsers();
    if (users.find(u => u.email === email)) return setError('Email sudah terdaftar');
    if (users.find(u => u.username === username)) return setError('Username sudah dipakai');
    const newUser = { email, username, password, avatar: "" };
    users.push(newUser);
    saveUsers(users);
    // Auto-login after register
    setUser({ email: newUser.email, username: newUser.username, avatar: newUser.avatar });
    onSuccess();
  }

  function handleLogin({ identifier, password }, setError) {
    const users = loadUsers();
    const found = users.find(u => (u.email === identifier || u.username === identifier) && u.password === password);
    if (!found) return setError('Email/Username atau password salah');
    setUser({ email: found.email, username: found.username, avatar: found.avatar || "" });
  }

  function handleLogout() {
    setUser(null);
    // keep cart, but clear session
    localStorage.removeItem('shop_session');
  }

  // --- Cart functions ---
  function handleAdd(p) {
    setCart((cur) => {
      const found = cur.find((c) => c.id === p.id);
      if (found) return cur.map((c) => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      return [...cur, { ...p, qty: 1 }];
    });
  }
  function handleRemove(id) { setCart((cur) => cur.filter((c) => c.id !== id)); }
  function handleChangeQty(id, qty) { setCart((cur) => cur.map((c) => c.id === id ? { ...c, qty } : c)); }
  function handleClear() { setCart([]); }

  const categories = ["Semua", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p => {
    const matchQuery = p.title.toLowerCase().includes(query.toLowerCase());
    const matchCat = category === 'Semua' ? true : p.category === category;
    return matchQuery && matchCat;
  });

  // Top-right cart badge count
  const cartCount = cart.reduce((s, it) => s + it.qty, 0);

  // Payment numbers (from user)
  const DANA_NUMBER = "083895332832";
  const GOPAY_NUMBER = "083852308484";

  function openProfile() {
    setIsProfileOpen(true);
  }

  function saveProfile(updated) {
    // update user session and update stored user in shop_users
    setUser(prev => {
      const next = { ...prev, email: updated.email, avatar: updated.avatar };
      // update users array
      const users = loadUsers().map(u => {
        if (u.username === next.username) return { ...u, email: next.email, avatar: next.avatar };
        return u;
      });
      saveUsers(users);
      return next;
    });
  }

  function handleOpenPayment() {
    setIsPaymentOpen(true);
  }

  function handleConfirmPayment(method) {
    // create a simple order object and mark as pending
    const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
    const order = {
      id: Date.now(),
      user: user.username,
      email: user.email,
      items: cart,
      total,
      method,
      status: "Menunggu Konfirmasi",
      createdAt: new Date().toISOString(),
    };
    // save to localStorage orders list
    const orders = (() => { try { const raw = localStorage.getItem('shop_orders'); return raw ? JSON.parse(raw) : []; } catch { return []; } })();
    orders.push(order);
    localStorage.setItem('shop_orders', JSON.stringify(orders));
    // open WhatsApp with message
    sendWhatsAppMessage(order);
    // clear cart
    setCart([]);
    setIsPaymentOpen(false);
    alert("Pesanan dibuat dan WhatsApp akan terbuka untuk mengirim notifikasi kepada admin.");
  }

  function sendWhatsAppMessage(order) {
    const phoneNumber = "6283852308484"; // admin WhatsApp (converted to international)
    const messageArr = [];
    messageArr.push("Halo admin, saya sudah melakukan pembayaran.");
    messageArr.push("");
    messageArr.push(`Nama: ${order.user}`);
    messageArr.push(`Email: ${order.email}`);
    messageArr.push(`Total: ${currencyIDR(order.total)}`);
    messageArr.push(`Metode Pembayaran: ${order.method}`);
    messageArr.push("");
    messageArr.push("Produk:");
    order.items.forEach(it => {
      messageArr.push(`• ${it.title} × ${it.qty}`);
    });
    messageArr.push("");
    messageArr.push("Mohon segera dicek ya. Terima kasih 🙏");
    const message = encodeURIComponent(messageArr.join("\n"));
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  }

  // If not logged in, show auth form area (centered)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">Shoo — Toko Contoh</h1>
            <p className="text-sm text-gray-600 mb-6">Silakan {authMode === 'login' ? 'login / sign in' : 'daftar'} untuk melanjutkan ke toko.</p>
            <AuthForm mode={authMode} onSwitch={setAuthMode} onLogin={handleLogin} onRegister={handleRegister} />
            <div className="text-xs text-gray-500 mt-3">Data tersimpan di localStorage untuk demo. Untuk produksi, hubungkan backend & database.</div>
          </div>
          <div className="hidden lg:block bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold mb-2">Kenapa daftar?</h3>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
              <li>Simpan keranjang</li>
              <li>Riwayat pesanan (butuh backend)</li>
              <li>Fitur checkout cepat</li>
            </ul>
            <div className="mt-6">
              <h4 className="font-semibold">Akun demo</h4>
              <p className="text-sm text-gray-500 mt-2">Tidak ada akun demo saat ini. Silakan daftar untuk membuat akun.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Main shop UI for logged-in users ---
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ProfileModal open={isProfileOpen} onClose={() => setIsProfileOpen(false)} profile={user} onSave={saveProfile} />
      <PaymentModal open={isPaymentOpen} onClose={() => setIsPaymentOpen(false)} onConfirm={handleConfirmPayment} danaNumber={DANA_NUMBER} gopayNumber={GOPAY_NUMBER} />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Shoo — Toko Contoh</h1>
              <div className="text-sm text-gray-500">Selamat datang, {user.username}!</div>
            </div>

            <div className="flex items-center gap-4">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari produk..." className="px-3 py-2 rounded-xl border" />

              <button onClick={() => { /* optional: scroll to cart */ }} className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 6m5-6v6m4-6v6m1-10h.01" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">{cartCount}</span>
                )}
              </button>

      <div className="flex items-center gap-3">
        <img src={user.avatar || "https://i.pravatar.cc/40"} alt="avatar" className="w-9 h-9 rounded-full object-cover" />
        <div className="text-sm">Hi, <span className="font-semibold">{user.username}</span></div>
        <button onClick={() => setIsProfileOpen(true)} className="px-3 py-1 rounded-xl border">Edit</button>
        <button onClick={handleLogout} className="px-3 py-1 rounded-xl border">Logout</button>
      </div>

            </div>
          </header>

          <div className="mb-4 flex items-center gap-3">
            {categories.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1 rounded-full ${cat === category ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>
                {cat}
              </button>
            ))}
          </div>

          <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(p => (
                <ProductCard key={p.id} p={p} onAdd={handleAdd} />
              ))}
            </div>
          </main>
        </div>

        <aside>
          <Cart items={cart} onRemove={handleRemove} onChangeQty={handleChangeQty} onClear={handleClear} />
          <div className="mt-4">
            <button onClick={handleOpenPayment} className="w-full py-2 rounded-xl bg-indigo-600 text-white">Checkout</button>
          </div>
        </aside>
      </div>

      <footer className="max-w-7xl mx-auto mt-8 text-center text-sm text-gray-500">
        <div>Contoh website toko - tidak terhubung ke pembayaran nyata. Untuk integrasi nyata, sambungkan API pembayaran dan backend order.</div>
      </footer>
    </div>
  );
}
