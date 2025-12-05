import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import About from "./pages/About";
import CollectionProducts from "./pages/CollectionProducts";
import Product from "./pages/Product";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/men/:category" element={<CollectionProducts />} />
        <Route path="/women/:category" element={<CollectionProducts />} />
        <Route path="/product/:handle" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
