import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-160px)] bg-gray-50 flex flex-col items-center justify-start px-6 pt-24 pb-16">
        <h1 className="text-4xl font-serif tracking-widest text-gray-900 mb-12">
          Contact Us
        </h1>

        <div className="grid md:grid-cols-2 gap-12 w-full max-w-5xl">
          {/* Contact Form */}
          <form className="bg-white shadow-md rounded-2xl p-8 space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Your email"
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Message</label>
              <textarea
                rows="5"
                placeholder="Your message..."
                className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col justify-center space-y-6 text-gray-700">
            <div className="flex items-start gap-3">
              <Mail className="text-gray-800 mt-1" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm">support@faintstore.com</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-gray-800 mt-1" />
              <div>
                <div className="font-medium">Phone</div>
                <div className="text-sm">+92 300 1234567</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-gray-800 mt-1" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-sm">Sialkot, Pakistan</div>
              </div>
            </div>

            <div className="mt-6 text-gray-600 text-sm">
              We typically reply within 24-48 hours. For urgent inquiries use the phone number above.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
