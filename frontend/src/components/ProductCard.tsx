import { Link } from "react-router-dom";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Link to={`/product/${product._id}`}>
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition relative">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
          {product.isFeatured && (
            <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
              ⭐ Featured
            </div>
          )}
          {product.saleOff && product.saleOff > 0 && (
            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              {product.saleOff}% OFF
            </div>
          )}
        </div>

        <div className="bg-gray-200 h-48 overflow-hidden">
          <img
            src={product.images[0] || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg truncate">{product.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-blue-600">${product.price}</span>
              {product.originalPrice && product.saleOff && product.saleOff > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-yellow-500">
              ⭐ {product.rating.toFixed(1)} ({product.reviewCount})
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Stock: {product.stock > 0 ? product.stock : "Out of stock"}
          </p>
          {product.gender && (
            <p className="text-xs text-gray-400 mt-1">
              {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
