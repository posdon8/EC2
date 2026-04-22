import { useEffect, useState } from "react";
import { useStore } from "../store/useStore";
import { ProductCard } from "../components/ProductCard";

export const Home = () => {
  const { products, getProducts, loading } = useStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    getProducts(1, category, search);
  }, []);

  const handleSearch = () => {
    getProducts(1, category, search);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to E-Clothes</h1>

        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 border rounded px-4 py-2"
          />
          <input
            type="text"
            placeholder="Category..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-4 py-2"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No products found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
