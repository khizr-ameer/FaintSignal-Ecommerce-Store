import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <>
      <Navbar />
      <div className="p-10 text-center">
        <h1 className="text-3xl font-serif mb-4">Product Details</h1>
        <p className="text-gray-600">Showing details for product ID: {id}</p>
      </div>
      <Footer />
    </>
  );
}
