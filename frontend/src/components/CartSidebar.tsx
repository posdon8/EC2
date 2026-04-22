import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import type { Product } from "../types";

export const CartSidebar = () => {
  const { cartOpen, setCartOpen, cart, removeFromCart, updateCartItem } =
    useStore();

  if (!cartOpen || !cart) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setCartOpen(false)}
      />

      <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            onClick={() => setCartOpen(false)}
            className="text-2xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {cart.items.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="p-4 space-y-4">
              {cart.items.map((item) => {
                const product = typeof item.productId === 'object' ? item.productId : null;
                const productId = typeof item.productId === 'string' ? item.productId : item.productId._id;

                return (
                  <div key={productId} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold">{product?.name || 'Product'}</p>
                        <p className="text-sm text-gray-600">
                          ${item.price} x {item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(productId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartItem(productId, parseInt(e.target.value))
                        }
                        className="w-12 border rounded px-2 py-1"
                      />
                      <span className="flex-1 text-right font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <Link
                to="/checkout"
                onClick={() => setCartOpen(false)}
                className="block w-full bg-blue-600 text-white py-2 rounded text-center hover:bg-blue-700"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
