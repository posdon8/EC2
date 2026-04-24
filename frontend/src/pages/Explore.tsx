import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import api from "../services/api";
import type { Product } from "../types";

export const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [onSaleOnly, setOnSaleOnly] = useState(searchParams.get("sale") === "true");
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get("featured") === "true");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Update URL params
    const newSearchParams = new URLSearchParams();
    if (search) newSearchParams.set("search", search);
    if (category) newSearchParams.set("category", category);
    if (gender) newSearchParams.set("gender", gender);
    if (onSaleOnly) newSearchParams.set("sale", "true");
    if (featuredOnly) newSearchParams.set("featured", "true");
    setSearchParams(newSearchParams);

    // Fetch products
    fetchProducts();
  }, [page, category, gender, onSaleOnly, featuredOnly, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", "12");
      
      if (category) params.append("category", category);
      if (gender) params.append("gender", gender);
      if (search) params.append("search", search);
      if (onSaleOnly) params.append("onSale", "true");
      if (featuredOnly) params.append("featured", "true");

      const response = await api.get(`/products?${params.toString()}`);
      setProducts(response.data.data.products);
      setTotalPages(response.data.data.pagination?.pages || 1);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setGender("");
    setOnSaleOnly(false);
    setFeaturedOnly(false);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Explore Products</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Categories</option>
              <option value="shirt">Shirt</option>
              <option value="pants">Pants</option>
              <option value="dress">Dress</option>
              <option value="jacket">Jacket</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setPage(1);
              }}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={onSaleOnly}
              onChange={(e) => {
                setOnSaleOnly(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4"
            />
            <span>On Sale Only</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => {
                setFeaturedOnly(e.target.checked);
                setPage(1);
              }}
              className="w-4 h-4"
            />
            <span>Featured Only</span>
          </label>
        </div>
      </div>

      {/* Products */}
      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No products found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
