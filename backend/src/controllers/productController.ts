import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ProductService } from "../services/productService";
import { asyncHandler } from "../middleware/errorHandler";
interface IdParams {
  id: string;
}
export const productController = {
  getProducts: asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const search = req.query.search as string;

    const result = await ProductService.getProducts(
      page,
      limit,
      category,
      search
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  }),

  getProductById: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const { id } = req.params;
    const product = await ProductService.getProductById(id);

    res.status(200).json({
      success: true,
      data: product,
    });
  }),

  createProduct: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, description, price, category, images, stock } = req.body;

    const product = await ProductService.createProduct({
      name,
      description,
      price,
      category,
      images,
      stock,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  }),

  updateProduct: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const { id } = req.params;
    const { name, description, price, category, images, stock } = req.body;

    const product = await ProductService.updateProduct(id, {
      name,
      description,
      price,
      category,
      images,
      stock,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  }),

  deleteProduct: asyncHandler(async (req: AuthRequest<IdParams>, res: Response) => {
    const { id } = req.params;

    const product = await ProductService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  }),
};
