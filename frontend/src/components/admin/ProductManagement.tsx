import { useState, useEffect } from "react";
import api from "../../services/api";
import { useStore } from "../../store/useStore";
import type { Product } from "../../types";

export function ProductManagement() {
  const { getProducts } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    saleOff: "",
    category: "",
    gender: "unisex",
    isFeatured: false,
    stock: "",
    images: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products?page=${page}&limit=10`);
      setProducts(response.data.data.products);
      setTotalPages(response.data.data.pagination?.pages || 1);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch products");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setShowForm(true);
    setSelectedProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      saleOff: "",
      category: "",
      gender: "unisex",
      isFeatured: false,
      stock: "",
      images: "",
    });
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowForm(true);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      saleOff: product.saleOff?.toString() || "",
      category: product.category,
      gender: product.gender || "unisex",
      isFeatured: product.isFeatured || false,
      stock: product.stock.toString(),
      images: product.images.join("\n"),
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        gender: formData.gender,
        isFeatured: formData.isFeatured,
        stock: parseInt(formData.stock),
        images: formData.images.split("\n").filter(url => url.trim()),
      };

      if (formData.originalPrice) {
        payload.originalPrice = parseFloat(formData.originalPrice);
      }
      if (formData.saleOff) {
        payload.saleOff = parseInt(formData.saleOff);
      }

      if (selectedProduct) {
        // Update
        const response = await api.put(`/products/${selectedProduct._id}`, payload);
        setProducts(products.map(p => p._id === selectedProduct._id ? response.data.data : p));
        setSuccess(true);
        // Refresh products in store for home page (with page 1, no filters)
        await getProducts(1, "", "");
      } else {
        // Create
        const response = await api.post("/products", payload);
        setProducts([...products, response.data.data]);
        setSuccess(true);
        // Refresh products in store for home page (with page 1, no filters)
        await getProducts(1, "", "");
      }

      setShowForm(false);
      setSelectedProduct(null);
      setError(null);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleDeleteClick = (productId: string) => {
    setDeleteProductId(productId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteProductId) return;

    try {
      await api.delete(`/products/${deleteProductId}`);
      setProducts(products.filter(p => p._id !== deleteProductId));
      setShowDeleteConfirm(false);
      setDeleteProductId(null);
      setSelectedProduct(null);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading && products.length === 0) {
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

      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Products ({products.length})</h2>
        <button
          onClick={handleAddProduct}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Products Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product._id}
                className="border rounded-lg p-4 hover:shadow-lg cursor-pointer transition"
                onClick={() => handleEditProduct(product)}
              >
                {product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                )}
                <h3 className="font-bold text-sm mb-1 truncate">{product.name}</h3>
                <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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
        </div>

        {/* Form or Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          {showForm ? (
            <form onSubmit={handleSubmitForm} className="space-y-4">
              <h3 className="text-lg font-bold mb-4">
                {selectedProduct ? "Edit Product" : "Add Product"}
              </h3>

              <div>
                <label className="text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  required
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    step="0.01"
                    required
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    required
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Original Price</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleFormChange}
                    step="0.01"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Sale Off %</label>
                  <input
                    type="number"
                    name="saleOff"
                    value={formData.saleOff}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Category *</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-gray-700">Mark as Featured</span>
              </label>

              <div>
                <label className="text-sm font-medium text-gray-700">Images (URLs, one per line)</label>
                <textarea
                  name="images"
                  value={formData.images}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {selectedProduct ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>

              {selectedProduct && (
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteClick(selectedProduct._id);
                    setShowForm(false);
                  }}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </form>
          ) : selectedProduct ? (
            <div>
              <h3 className="text-lg font-bold mb-4">Product Details</h3>
              {selectedProduct.images[0] && (
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600">Name</p>
                  <p className="font-bold">{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Category</p>
                  <p className="font-bold">{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Gender</p>
                  <p className="font-bold capitalize">{selectedProduct.gender}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Price</p>
                  <p className="text-xl font-bold text-blue-600">
                    ${selectedProduct.price.toFixed(2)}
                  </p>
                </div>
                {selectedProduct.saleOff && selectedProduct.saleOff > 0 && (
                  <div>
                    <p className="text-xs text-gray-600">Sale Off</p>
                    <p className="font-bold text-red-600">{selectedProduct.saleOff}%</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-600">Stock</p>
                  <p className="font-bold">{selectedProduct.stock}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Rating</p>
                  <p className="font-bold">⭐ {selectedProduct.rating.toFixed(1)}</p>
                </div>
                {selectedProduct.isFeatured && (
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <p className="font-bold text-yellow-600">⭐ Featured</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleEditProduct(selectedProduct)}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this product?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
