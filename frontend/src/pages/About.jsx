import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-160px)] bg-gray-50 px-6 py-20 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-serif tracking-widest text-gray-900 mb-8">
            About Us
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            At <span className="font-semibold">FAINT STORE</span>, we believe fashion is more than clothing it's an expression of identity.
            Founded in 2025, our mission is to combine minimal design with premium quality.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mt-10">
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3">Our Vision</h3>
              <p className="text-gray-600">To create effortless, wearable luxury that feels personal and timeless.</p>
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold mb-3">Sustainability</h3>
              <p className="text-gray-600">We prioritise mindful sourcing and long-lasting design to reduce waste.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
