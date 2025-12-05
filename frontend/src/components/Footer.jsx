export default function Footer() {
  return (
    <footer className="bg-black text-white py-10 px-4 text-center">
      <h3 className="text-2xl sm:text-3xl mb-3">FAINT SIGNAL</h3>
      <p className="text-gray-400 text-sm sm:text-base mb-2">
        Luxury. Elegance. Confidence.
      </p>
      <p className="text-gray-500 text-xs sm:text-sm">
        © {new Date().getFullYear()} Faint Store. All rights reserved.
      </p>
    </footer>
  );
}
