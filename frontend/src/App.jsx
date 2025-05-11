/**
 * App Component
 * 
 * This is the root component of the waste management system application.
 * It handles the main routing logic and layout structure for the entire application.
 * The component uses React Router for navigation between different sections of the app.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import WasteCollectionHome from './components/WasteCollectionHome.jsx';
import RecyclingCenterHome from './components/RecyclingCenterHome.jsx';
import ShopTransactionHistory from './components/ShopTransactionHistory.jsx';

/**
 * Main App Component
 * 
 * @returns {JSX.Element} The rendered application with routing configuration
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main Application Routes */}
        <Route path="/waste-collection" element={<WasteCollectionHome />} />
        <Route path="/recycling-center" element={<RecyclingCenterHome />} />
        <Route path="/shop-transactions" element={<ShopTransactionHistory />} />
      </Routes>
    </Router>
  );
}

export default App; 