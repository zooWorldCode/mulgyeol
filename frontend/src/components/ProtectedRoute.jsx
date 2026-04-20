import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../auth/session.js';

export default function ProtectedRoute({ children }) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
