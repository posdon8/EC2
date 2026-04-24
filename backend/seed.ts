import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "./src/config";
import { Product } from "./src/models/Product";
import { User } from "./src/models/User";

const seedProducts = [
  {
    name: "Classic White T-Shirt",
    description: "Comfortable everyday white t-shirt made from 100% cotton. Perfect for any occasion.",
    price: 19.99,
    originalPrice: 24.99,
    saleOff: 20,
    category: "shirt",
    gender: "unisex",
    isFeatured: true,
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
    originalPrice: 79.99,
    saleOff: 25,
    category: "pants",
    gender: "male",
    isFeatured: true,
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
    originalPrice: 69.99,
    saleOff: 30,
    category: "dress",
    gender: "female",
    isFeatured: true,
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
    originalPrice: 179.99,
    saleOff: 28,
    category: "jacket",
    gender: "unisex",
    isFeatured: true,
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
    originalPrice: 44.99,
    saleOff: 22,
    category: "shirt",
    gender: "male",
    isFeatured: false,
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
    originalPrice: 59.99,
    saleOff: 25,
    category: "shirt",
    gender: "unisex",
    isFeatured: false,
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
    originalPrice: 69.99,
    saleOff: 21,
    category: "pants",
    gender: "male",
    isFeatured: false,
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
    originalPrice: 49.99,
    saleOff: 20,
    category: "shirt",
    gender: "male",
    isFeatured: false,
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
    originalPrice: 44.99,
    saleOff: 22,
    category: "pants",
    gender: "unisex",
    isFeatured: false,
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
    originalPrice: 99.99,
    saleOff: 20,
    category: "shoes",
    gender: "unisex",
    isFeatured: true,
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
    originalPrice: 59.99,
    saleOff: 25,
    category: "shirt",
    gender: "unisex",
    isFeatured: false,
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
    originalPrice: 74.99,
    saleOff: 27,
    category: "shirt",
    gender: "female",
    isFeatured: false,
    images: [
      "https://via.placeholder.com/500?text=Pink+Cardigan",
      "https://via.placeholder.com/500?text=Pink+Cardigan+2",
    ],
    stock: 18,
    rating: 4.5,
    reviewCount: 13,
  },
  {
    name: "Women's Running Shoes",
    description: "Lightweight running shoes designed for comfort and performance. Perfect for fitness enthusiasts.",
    price: 89.99,
    originalPrice: 119.99,
    saleOff: 25,
    category: "shoes",
    gender: "female",
    isFeatured: true,
    images: [
      "https://via.placeholder.com/500?text=Running+Shoes",
      "https://via.placeholder.com/500?text=Running+Shoes+2",
    ],
    stock: 22,
    rating: 4.7,
    reviewCount: 31,
  },
  {
    name: "Men's Winter Coat",
    description: "Warm and stylish winter coat. Water-resistant exterior keeps you dry in any weather.",
    price: 149.99,
    originalPrice: 199.99,
    saleOff: 25,
    category: "jacket",
    gender: "male",
    isFeatured: true,
    images: [
      "https://via.placeholder.com/500?text=Winter+Coat",
      "https://via.placeholder.com/500?text=Winter+Coat+2",
    ],
    stock: 12,
    rating: 4.8,
    reviewCount: 38,
  },
  {
    name: "Casual Shorts",
    description: "Comfortable and breathable shorts for summer. Perfect for beach or casual outings.",
    price: 29.99,
    originalPrice: 39.99,
    saleOff: 25,
    category: "pants",
    gender: "unisex",
    isFeatured: false,
    images: [
      "https://via.placeholder.com/500?text=Shorts",
      "https://via.placeholder.com/500?text=Shorts+2",
    ],
    stock: 50,
    rating: 4.4,
    reviewCount: 20,
  },
  {
    name: "Floral Blouse",
    description: "Beautiful floral blouse perfect for spring and summer. Lightweight and airy fabric.",
    price: 44.99,
    originalPrice: 64.99,
    saleOff: 31,
    category: "shirt",
    gender: "female",
    isFeatured: true,
    images: [
      "https://via.placeholder.com/500?text=Floral+Blouse",
      "https://via.placeholder.com/500?text=Floral+Blouse+2",
    ],
    stock: 26,
    rating: 4.6,
    reviewCount: 24,
  },
];


async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log("✅ Connected to MongoDB");

    // Check if admin user exists


    // Insert seed products (without clearing existing ones)
    const insertedProducts = await Product.insertMany(seedProducts, { ordered: false }).catch(err => {
      // If some products fail due to duplicates, continue with others
      console.log(`⚠️  Some products may already exist, continuing...`);
      return [];
    });
    
    if (insertedProducts.length > 0) {
      console.log(`✅ Inserted ${insertedProducts.length} new products`);

      // Display inserted products
      console.log("\n📦 Seeded Products:");
      insertedProducts.forEach((product, index) => {
        console.log(
          `${index + 1}. ${product.name} - $${product.price} (Stock: ${product.stock})`
        );
      });
    } else {
      console.log(`ℹ️  No new products were inserted`);
    }

    console.log("\n✨ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
