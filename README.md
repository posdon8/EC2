# E-Commerce Website - Bán Quần Áo

Hệ thống e-commerce hoàn chỉnh xây dựng bằng **TypeScript, Node.js, Express, React, MongoDB**

## 📁 Cấu Trúc Dự Án

```
ecommerce-app/
├── backend/          → Express API (Node.js)
├── frontend/         → React App (Vite)
└── README.md
```

## 🚀 Hướng Dẫn Chạy

### 1️⃣ Backend Setup

```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo file .env (copy từ .env.example)
cp .env.example .env

# Chạy development server
npm run dev

# Server chạy tại http://localhost:5000
```

**Yêu cầu**: MongoDB lắng nghe tại `mongodb://localhost:27017/ecommerce`

Nếu chưa có MongoDB, cài đặt hoặc sử dụng MongoDB Atlas (cloud):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

### 2️⃣ Frontend Setup

```bash
cd frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Frontend chạy tại http://localhost:5173
```

## 📋 API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/google` - Đăng nhập Google
- `POST /api/auth/logout` - Đăng xuất

### Products
- `GET /api/products` - Danh sách sản phẩm (filter, search, pagination)
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products` - [ADMIN] Thêm sản phẩm
- `PUT /api/products/:id` - [ADMIN] Cập nhật sản phẩm
- `DELETE /api/products/:id` - [ADMIN] Xóa sản phẩm

### Cart
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart` - Thêm vào giỏ
- `PUT /api/cart/:productId` - Cập nhật số lượng
- `DELETE /api/cart/:productId` - Xóa khỏi giỏ
- `DELETE /api/cart` - Xóa toàn bộ giỏ

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Danh sách đơn của người dùng
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `PUT /api/orders/:id/status` - [ADMIN] Cập nhật trạng thái
- `GET /api/orders/admin/all-orders` - [ADMIN] Tất cả đơn hàng

### Reviews
- `POST /api/reviews` - Thêm đánh giá
- `GET /api/reviews/:productId` - Danh sách đánh giá sản phẩm
- `DELETE /api/reviews/:id` - Xóa đánh giá của mình

## 🎯 Tính Năng Chính

✅ **Users**
- Đăng ký / Đăng nhập (Email + Password)
- Google OAuth (cần setup)
- Phân quyền (Customer/Admin)

✅ **Products**
- Xem danh sách sản phẩm
- Lọc theo danh mục, tìm kiếm
- Xem chi tiết sản phẩm
- Quản lý sản phẩm (Admin)

✅ **Cart**
- Thêm vào giỏ
- Cập nhật số lượng
- Xóa sản phẩm
- Tính tổng giá

✅ **Orders**
- Tạo đơn hàng từ giỏ
- Nhập địa chỉ giao hàng
- Xem lịch sử đơn hàng
- Tracking trạng thái

✅ **Reviews**
- Đánh giá sản phẩm (1-5 sao)
- Bình luận chi tiết
- Tính trung bình đánh giá

## 🛠 Tech Stack

### Backend
- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router v6** - Routing
- **Zustand** - State management
- **Axios** - HTTP client
- **TailwindCSS** - Styling

### Database
- **MongoDB** - NoSQL database

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
GOOGLE_CLIENT_ID=your-google-client-id (optional)
GOOGLE_CLIENT_SECRET=your-google-secret (optional)
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🔒 Authentication

JWT tokens được lưu trong localStorage:
```javascript
localStorage.getItem('token')    // Lấy token
localStorage.getItem('user')     // Lấy thông tin user
```

Tất cả protected routes yêu cầu token trong header:
```
Authorization: Bearer <token>
```

## 🎨 Styling

Sử dụng **TailwindCSS** cho styling:
- Responsive design (mobile, tablet, desktop)
- Dark mode ready
- Custom components

## 🚀 Build & Deploy

### Build Backend
```bash
cd backend
npm run build
npm start
```

### Build Frontend
```bash
cd frontend
npm run build
```

Các file static sẽ được tạo tại `dist/`

## 📌 Next Steps

1. **Setup MongoDB** - Cài hoặc kết nối Atlas
2. **Thêm sản phẩm** - Dùng API hoặc Admin dashboard
3. **Google OAuth** - Setup client ID nếu muốn (optional)
4. **Payment Gateway** - Thêm Stripe/VNPay sau (để sau)
5. **Deployment** - Deploy lên Heroku/Vercel/Railway

## 📞 Support

Nếu gặp lỗi:
1. Kiểm tra MongoDB kết nối
2. Kiểm tra environment variables
3. Xem console backend/frontend để debug

---

**Happy Coding! 🚀**
