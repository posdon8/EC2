import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types";
import api from "../services/api";

export const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [maleProducts, setMaleProducts] = useState<Product[]>([]);
  const [femaleProducts, setFemaleProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: Product[] }>({});

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products?featured=true&limit=4");
        setFeaturedProducts(response.data.data.products);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };

    const fetchSaleProducts = async () => {
      try {
        const response = await api.get("/products?onSale=true&limit=4");
        setSaleProducts(response.data.data.products);
      } catch (error) {
        console.error("Failed to fetch sale products:", error);
      }
    };

    const fetchMaleProducts = async () => {
      try {
        const response = await api.get("/products?gender=male&limit=4");
        setMaleProducts(response.data.data.products);
      } catch (error) {
        console.error("Failed to fetch male products:", error);
      }
    };

    const fetchFemaleProducts = async () => {
      try {
        const response = await api.get("/products?gender=female&limit=4");
        setFemaleProducts(response.data.data.products);
      } catch (error) {
        console.error("Failed to fetch female products:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoryList = ["shirt", "pants", "dress", "jacket", "shoes", "accessories"];
        const catProducts: { [key: string]: Product[] } = {};

        for (const cat of categoryList) {
          const response = await api.get(`/products?category=${cat}&limit=4`);
          catProducts[cat] = response.data.data.products;
        }

        setCategories(catProducts);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    Promise.all([
      fetchFeaturedProducts(),
      fetchSaleProducts(),
      fetchMaleProducts(),
      fetchFemaleProducts(),
      fetchCategories(),
    ]).finally(() => setLoading(false));
  }, []);

  const ProductSection = ({
    title,
    products,
    onViewMore,
  }: {
    title: string;
    products: Product[];
    onViewMore: () => void;
  }) => (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{title}</h2>
        <button
          onClick={onViewMore}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          View More →
        </button>
      </div>
      {products.length === 0 ? (
        <div className="text-gray-500 text-center py-8">No products available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8">
        <h1 className="text-4xl font-bold mb-4">Discover Our Collections</h1>
        <p className="text-lg mb-6">
          Explore thousands of stylish products handpicked just for you
        </p>
        <button
          onClick={() => navigate("/explore")}
          className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100"
        >
          Shop All Products
        </button>
      </div>

      {/* Featured Products */}
      <ProductSection
        title="⭐ Featured Products"
        products={featuredProducts}
        onViewMore={() => navigate("/explore?featured=true")}
      />

      {/* Sale Products */}
      <ProductSection
        title="🔥 Hot Sale"
        products={saleProducts}
        onViewMore={() => navigate("/explore?sale=true")}
      />

      {/* Gender-based Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <ProductSection
          title="👨 For Men"
          products={maleProducts}
          onViewMore={() => navigate("/explore?gender=male")}
        />
        <ProductSection
          title="👩 For Women"
          products={femaleProducts}
          onViewMore={() => navigate("/explore?gender=female")}
        />
      </div>

      {/* Category Products */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="space-y-12">
          {Object.entries(categories).map(([category, products]) => (
            <ProductSection
              key={category}
              title={category.charAt(0).toUpperCase() + category.slice(1)}
              products={products}
              onViewMore={() => navigate(`/explore?category=${category}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

