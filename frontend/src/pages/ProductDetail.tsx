import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../store/useStore";
import api from "../services/api";
import type { Product, Review } from "../types";

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, isLoggedIn } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);

        const reviewsResponse = await api.get(`/reviews/${id}`);
        setReviews(reviewsResponse.data.data);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      alert("Please login first");
      return;
    }

    try {
      await addToCart(id!, quantity);
      alert("Added to cart!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <img
            src={product.images[0] || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full rounded shadow"
          />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} ${i}`}
                className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price}
            </span>
            <div className="flex items-center gap-1 text-yellow-500">
              ⭐ {product.rating.toFixed(1)} ({product.reviewCount} reviews)
            </div>
          </div>

          <p className="text-gray-700 mb-4">{product.description}</p>

          <p className="mb-4">
            Stock:{" "}
            <span
              className={
                product.stock > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"
              }
            >
              {product.stock > 0 ? product.stock : "Out of stock"}
            </span>
          </p>

          <div className="flex gap-4 mb-6">
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-16 border rounded px-3 py-2"
            />
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-4">Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-yellow-500">
                          {"⭐".repeat(review.rating)}
                        </p>
                        <p className="text-sm text-gray-600">
                          by {typeof review.userId === 'object' ? review.userId.name : 'Anonymous'}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
