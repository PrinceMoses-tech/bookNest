import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BrowseBooks from './pages/BrowseBooks';
import BookDetails from './pages/BookDetails';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import OrderConfirmation from './pages/OrderConfirmation';

function App() {
  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/browse" element={<BrowseBooks />} />
            <Route path="/book/:id" element={<BookDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/confirmation" element={<OrderConfirmation />} />
          </Routes>
        </Layout>
      </CartProvider>
    </Router>
  );
}

export default App;
