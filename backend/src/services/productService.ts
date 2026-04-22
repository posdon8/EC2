import { Product } from "../models/Product";
import { ApiError } from "../middleware/errorHandler";

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
}

export class ProductService {
  static async getProducts(
    page: number = 1,
    limit: number = 10,
    category?: string,
    search?: string
  ) {
    const skip = (page - 1) * limit;
    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query).skip(skip).limit(limit);
    const total = await Product.countDocuments(query);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  static async getProductById(id: string) {
    const product = await Product.findById(id);
    if (!product) {
      const error: ApiError = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    return product;
  }

  static async createProduct(data: CreateProductData) {
    const product = await Product.create(data);
    return product;
  }

  static async updateProduct(id: string, data: Partial<CreateProductData>) {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!product) {
      const error: ApiError = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    return product;
  }

  static async deleteProduct(id: string) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      const error: ApiError = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    return product;
  }
}
