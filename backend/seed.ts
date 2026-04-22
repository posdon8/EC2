import mongoose from "mongoose";
import { config } from "./src/config";
import { Product } from "./src/models/Product";

const seedProducts = [
  {
    name: "Classic White T-Shirt",
    description: "Comfortable everyday white t-shirt made from 100% cotton. Perfect for any occasion.",
    price: 19.99,
    category: "T-Shirt",
    images: [
      "https://via.placeholder.com/500?text=White+T-Shirt",
      "https://via.placeholder.com/500?text=White+T-Shirt+2",
    ],
    stock: 50,
    rating: 4.5,
    reviewCount: 12,
  },
  {
    name: "Navy Blue Jeans",
    description: "Stylish and durable navy blue jeans. Fits perfectly and lasts for years. Slim fit design.",
    price: 59.99,
    category: "Jeans",
    images: [
      "https://via.placeholder.com/500?text=Navy+Jeans",
      "https://via.placeholder.com/500?text=Navy+Jeans+2",
    ],
    stock: 35,
    rating: 4.8,
    reviewCount: 28,
  },
  {
    name: "Summer Floral Dress",
    description: "Beautiful floral print summer dress. Light and breathable fabric, perfect for warm days.",
    price: 49.99,
    category: "Dress",
    images: [
      "https://via.placeholder.com/500?text=Floral+Dress",
      "https://via.placeholder.com/500?text=Floral+Dress+2",
    ],
    stock: 25,
    rating: 4.7,
    reviewCount: 18,
  },
  {
    name: "Black Leather Jacket",
    description: "Premium black leather jacket. Classic style that goes with everything. Warm and stylish.",
    price: 129.99,
    category: "Jacket",
    images: [
      "https://via.placeholder.com/500?text=Leather+Jacket",
      "https://via.placeholder.com/500?text=Leather+Jacket+2",
    ],
    stock: 15,
    rating: 4.9,
    reviewCount: 42,
  },
  {
    name: "Red Polo Shirt",
    description: "Professional red polo shirt. Great for casual or semi-formal settings. 60% cotton, 40% polyester.",
    price: 34.99,
    category: "Polo",
    images: [
      "https://via.placeholder.com/500?text=Red+Polo",
      "https://via.placeholder.com/500?text=Red+Polo+2",
    ],
    stock: 40,
    rating: 4.4,
    reviewCount: 15,
  },
  {
    name: "Gray Hoodie",
    description: "Cozy gray hoodie perfect for cold weather. Soft fleece lining keeps you warm and comfortable.",
    price: 44.99,
    category: "Hoodie",
    images: [
      "https://via.placeholder.com/500?text=Gray+Hoodie",
      "https://via.placeholder.com/500?text=Gray+Hoodie+2",
    ],
    stock: 30,
    rating: 4.6,
    reviewCount: 22,
  },
  {
    name: "Khaki Chinos",
    description: "Versatile khaki chinos for work or casual wear. Comfortable fit with a modern cut.",
    price: 54.99,
    category: "Chinos",
    images: [
      "https://via.placeholder.com/500?text=Khaki+Chinos",
      "https://via.placeholder.com/500?text=Khaki+Chinos+2",
    ],
    stock: 28,
    rating: 4.5,
    reviewCount: 19,
  },
  {
    name: "Striped Button-Up Shirt",
    description: "Classic striped button-up shirt. Perfect for business casual. Available in multiple sizes.",
    price: 39.99,
    category: "Shirt",
    images: [
      "https://via.placeholder.com/500?text=Striped+Shirt",
      "https://via.placeholder.com/500?text=Striped+Shirt+2",
    ],
    stock: 32,
    rating: 4.3,
    reviewCount: 11,
  },
  {
    name: "Black Sweatpants",
    description: "Comfortable black sweatpants for lounging. Elastic waist and cuffs for perfect fit.",
    price: 34.99,
    category: "Pants",
    images: [
      "https://via.placeholder.com/500?text=Sweatpants",
      "https://via.placeholder.com/500?text=Sweatpants+2",
    ],
    stock: 45,
    rating: 4.7,
    reviewCount: 25,
  },
  {
    name: "White Sneakers",
    description: "Stylish white sneakers for everyday wear. Lightweight and comfortable for all-day use.",
    price: 79.99,
    category: "Shoes",
    images: [
      "https://via.placeholder.com/500?text=White+Sneakers",
      "https://via.placeholder.com/500?text=White+Sneakers+2",
    ],
    stock: 20,
    rating: 4.8,
    reviewCount: 35,
  },
  {
    name: "Denim Shirt",
    description: "Classic denim shirt in light blue. Versatile piece that can be dressed up or down.",
    price: 44.99,
    category: "Shirt",
    images: [
      "https://via.placeholder.com/500?text=Denim+Shirt",
      "https://via.placeholder.com/500?text=Denim+Shirt+2",
    ],
    stock: 24,
    rating: 4.6,
    reviewCount: 17,
  },
  {
    name: "Pink Cardigan",
    description: "Elegant pink cardigan. Soft and warm for layering. Button-up closure for easy wear.",
    price: 54.99,
    category: "Cardigan",
    images: [
      "https://via.placeholder.com/500?text=Pink+Cardigan",
      "https://via.placeholder.com/500?text=Pink+Cardigan+2",
    ],
    stock: 18,
    rating: 4.5,
    reviewCount: 13,
  },
];

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log("✅ Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    // Insert seed products
    const insertedProducts = await Product.insertMany(seedProducts);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    // Display inserted products
    console.log("\n📦 Seeded Products:");
    insertedProducts.forEach((product, index) => {
      console.log(
        `${index + 1}. ${product.name} - $${product.price} (Stock: ${product.stock})`
      );
    });

    console.log("\n✨ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
