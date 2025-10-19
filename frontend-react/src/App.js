import React, { useState, useEffect } from "react";
import "./App.css";
import {
  FaShoppingCart,
  FaHeart,
  FaSun,
  FaMoon,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || []
  );
  const [favorites, setFavorites] = useState(
    () => JSON.parse(localStorage.getItem("favorites")) || []
  );
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState("");

  // Carregar produtos do backend
  useEffect(() => {
    fetch("http://127.0.0.1:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Erro ao buscar produtos:", err));
  }, []);

  // Atualizar localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [cart, favorites]);

  // Alternar tema
  const toggleTheme = () => setDarkMode(!darkMode);

  // Adicionar ao carrinho
  const addToCart = (product) => {
    const item = cart.find((i) => i.id === product.id);
    if (item) {
      setCart(
        cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  // Remover do carrinho
  const removeFromCart = (id) => setCart(cart.filter((i) => i.id !== id));

  // Favoritar
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Buscar endereço pelo CEP
  const fetchAddress = async () => {
    if (cep.length !== 8) {
      setAddress("CEP inválido");
      return;
    }
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) {
        setAddress("CEP não encontrado");
      } else {
        setAddress(
          `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`
        );
      }
    } catch (error) {
      setAddress("Erro ao buscar endereço");
    }
  };

  // Filtrar produtos pela pesquisa
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`App ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* 🧭 Cabeçalho */}
      <header className="header">
        <h1>🛍️ TechZone Store</h1>

        <div className="header-actions">
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <div className="cart-icon">
            <FaShoppingCart />
            {cart.length > 0 && (
              <span className="cart-count">{cart.length}</span>
            )}
          </div>
        </div>
      </header>

      {/* 🛒 Produtos */}
      <div className="products-grid">
        {filteredProducts.map((p) => (
          <div key={p.id} className="product-card">
            <img src={p.image_url} alt={p.name} className="product-image" />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <strong>R$ {p.price.toFixed(2)}</strong>
            <div className="product-buttons">
              <button className="btn-add" onClick={() => addToCart(p)}>
                Adicionar ao carrinho
              </button>
              <button
                className={`btn-favorite ${
                  favorites.includes(p.id) ? "favorited" : ""
                }`}
                onClick={() => toggleFavorite(p.id)}
              >
                <FaHeart color={favorites.includes(p.id) ? "red" : "inherit"} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🧾 Carrinho */}
      {cart.length > 0 && (
        <div className="cart-section">
          <h2>🛒 Carrinho</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} (x{item.qty}) — R${" "}
                {(item.price * item.qty).toFixed(2)}
                <button
                  className="btn-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 📍 Endereço */}
      <div className="address-section">
        <h2>📦 Endereço de Entrega</h2>
        <input
          type="text"
          placeholder="Digite seu CEP (somente números)"
          maxLength="8"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
        />
        <button onClick={fetchAddress}>Buscar Endereço</button>
        {address && <p className="address-result">{address}</p>}
      </div>

      <footer>© 2025 TechZone Store — Todos os direitos reservados</footer>
    </div>
  );
}

export default App;
