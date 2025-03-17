
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <motion.div 
        className="glass-panel rounded-xl p-8 text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          <AlertTriangle className="w-16 h-16 text-board-yellow mx-auto mb-4" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-xl text-gray-300 mb-6">Route Not Found</p>
        <p className="text-gray-400 mb-8">
          The bus route you're looking for doesn't exist or has been rerouted.
        </p>
        <Link to="/" className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 transition-colors">
          <Home className="w-5 h-5 mr-2" />
          Return to Departure Board
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
