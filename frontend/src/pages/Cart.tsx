import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";

export const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateCartItem, clearCart, isLoggedIn } =
    useStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!cart) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded overflow-hidden">
              {cart.items.map((item) => {
                const productId = typeof item.productId === 'string'
                  ? item.productId
                  : item.productId._id;
                const product = typeof item.productId === 'object'
                  ? item.productId
                  : null;

                return (
                  <div key={productId} className="border-b p-4 flex gap-4">
                    <img
                      src={product?.images[0] || "https://via.placeholder.com/100"}
                      alt={product?.name || 'Product'}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{product?.name || 'Product'}</h3>
                      <p className="text-gray-600">${item.price}</p>
                      <div className="flex gap-2 mt-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateCartItem(productId, parseInt(e.target.value))
                          }
                          className="w-16 border rounded px-2 py-1"
                        />
                        <button
                          onClick={() => removeFromCart(productId)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => clearCart()}
              className="mt-4 text-red-600 hover:text-red-800 underline"
            >
              Clear Cart
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 border-b pb-4 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-bold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
