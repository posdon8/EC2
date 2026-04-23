import { useState, useEffect } from "react";
import api from "../../services/api";
import type { Order } from "../../types";

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, [page, filterStatus]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/admin/all-orders?page=${page}&limit=10`);
      let filteredOrders = response.data.data;
      
      if (filterStatus !== "all") {
        filteredOrders = filteredOrders.filter((order: Order) => order.status === filterStatus);
      }
      
      setOrders(filteredOrders);
      // Calculate total pages based on filtered data
      setTotalPages(Math.ceil(filteredOrders.length / 10));
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? response.data.data : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(response.data.data);
      }
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const statusOptions = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

  if (loading && orders.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700 mr-4">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Orders</option>
          {statusOptions.map(status => (
            <option key={status} value={status} className="capitalize">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Orders ({orders.length})</h2>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No orders found</div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="border rounded-lg p-4 hover:shadow-lg cursor-pointer transition bg-white"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-sm">Order #{order._id.slice(-8)}</p>
                      <p className="text-xs text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length > 1 ? "s" : ""}
                    </p>
                    <p className="font-bold text-blue-600">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div className="bg-gray-50 p-6 rounded-lg max-h-fit sticky top-20">
            <h3 className="text-lg font-bold mb-4">Order Details</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-600">Order ID</label>
                <p className="font-mono text-sm">{selectedOrder._id}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder._id, e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Date</label>
                <p className="text-sm">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()} at{" "}
                  {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">Items</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded">
                      <span className="truncate">
                        {typeof item.productId === "object"
                          ? item.productId.name
                          : `Product ${item.productId}`}
                      </span>
                      <span className="text-gray-600">x{item.quantity}</span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="text-xs font-medium text-gray-600">Shipping Address</label>
                <p className="text-sm mt-2">
                  <strong>{selectedOrder.shippingAddress.fullName}</strong>
                  <br />
                  {selectedOrder.shippingAddress.street}
                  <br />
                  {selectedOrder.shippingAddress.ward}, {selectedOrder.shippingAddress.district}
                  <br />
                  {selectedOrder.shippingAddress.city}
                  <br />
                  {selectedOrder.shippingAddress.phone}
                </p>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-medium">
                    ${selectedOrder.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <strong>Total</strong>
                  <strong className="text-blue-600">
                    ${selectedOrder.totalPrice.toFixed(2)}
                  </strong>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Payment Method</label>
                <p className="text-sm capitalize">{selectedOrder.paymentMethod}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
