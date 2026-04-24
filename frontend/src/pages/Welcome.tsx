import { useNavigate } from "react-router-dom";

export const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-6">Welcome to E-Clothes</h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Discover the latest fashion trends and shop from our exclusive collection of clothing and accessories.
        </p>
        <button
          onClick={() => navigate("/home")}
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors duration-200 shadow-lg"
        >
          Explore Now
        </button>
      </div>
    </div>
  );
};
