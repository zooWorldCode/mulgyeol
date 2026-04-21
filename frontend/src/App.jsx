import { Routes, Route } from 'react-router-dom';
import TopNoticeBar from './components/TopNoticeBar.jsx';
import Layout from './components/Layout.jsx';
import AuthShell from './components/auth/AuthShell.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Category from './pages/Category.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import MyPage from './pages/MyPage.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Event from './pages/Event.jsx';
import EventDetail from './pages/EventDetail.jsx';
import Brand from './pages/Brand.jsx';
import Community from './pages/Community.jsx';
import BlogPage from './pages/BlogPage.jsx';
import BlogPostDetail from './pages/BlogPostDetail.jsx';
import Search from './pages/Search.jsx';
import Order from './pages/Order.jsx';

export default function App() {
  return (
    <>
      <TopNoticeBar />
      <Routes>
      <Route element={<AuthShell />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="category" element={<Category />} />
        <Route path="event" element={<Event />} />
        <Route path="event/:id" element={<EventDetail />} />
        <Route path="brand" element={<Brand />} />
        <Route path="community" element={<Community />} />
        <Route path="community/:id" element={<BlogPostDetail />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogPostDetail />} />
        <Route path="search" element={<Search />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="order" element={<Order />} />
        <Route
          path="mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
    </>
  );
}
