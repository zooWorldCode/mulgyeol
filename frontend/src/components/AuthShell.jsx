import { Outlet } from 'react-router-dom';

export default function AuthShell() {
  return (
    <div
      className="auth-shell"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 16px 0',
        boxSizing: 'border-box',
        background: 'var(--color-point)',
      }}
    >
      <Outlet />
    </div>
  );
}
