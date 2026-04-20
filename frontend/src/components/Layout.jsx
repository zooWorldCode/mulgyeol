import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import '../styles/layout.css';

export default function Layout() {
  return (
    <div
      className="site-root"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <main className="site-main" style={{ flex: 1 }}>
        <div className="container" style={{ padding: 16 }}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
