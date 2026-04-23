import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import api from "../services/api";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import type { Order } from "../types";

export const Orders = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders");
        setOrders(response.data.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
        >
          🔒 Change Password
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No orders yet</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded p-6 hover:shadow-lg transition cursor-pointer"
              onClick={() =>
                setSelectedOrder(selectedOrder?._id === order._id ? null : order)
              }
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">Order #{order._id.slice(-8)}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${order.totalPrice.toFixed(2)}</p>
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {selectedOrder?._id === order._id && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="font-bold mb-4">Order Details</h4>

                  <div className="mb-6">
                    <h5 className="font-medium text-sm mb-2">Items</h5>
                    {order.items.map((item, i) => {
                      const product =
                        typeof item.productId === "object"
                          ? item.productId
                          : null;
                      return (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span>{product?.name || "Product"} x{item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-gray-50 p-4 rounded">
                    <h5 className="font-medium text-sm mb-2">
                      Shipping Address
                    </h5>
                    <p className="text-sm">
                      {order.shippingAddress.fullName}
                      <br />
                      {order.shippingAddress.street}
                      <br />
                      {order.shippingAddress.ward}, {order.shippingAddress.district},{" "}
                      {order.shippingAddress.city}
                      <br />
                      {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};
