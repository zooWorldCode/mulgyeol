import { Outlet } from 'react-router-dom';

export default function AuthShell() {
  return (
    <div
      className="auth-shell"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        boxSizing: 'border-box',
        backgroundColor: 'var(--color-point)',
        backgroundImage:
          "linear-gradient(rgba(237, 144, 110, 0.78), rgba(237, 144, 110, 0.78)), url('/images/social_log/back.png')",
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Outlet />
    </div>
  );
}
