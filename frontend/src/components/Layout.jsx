import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import TopMarqueeBar from './TopMarqueeBar.jsx';
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
        <div className="container">
          <Outlet />
        </div>
      </main>
      <TopMarqueeBar />
      <Footer />
    </div>
  );
}
