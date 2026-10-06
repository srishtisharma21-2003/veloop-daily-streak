import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import DailyStreakPage from './pages/DailyStreak/DailyStreakPage.jsx';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/daily-streak" element={<PrivateRoute><DailyStreakPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/daily-streak" replace />} />
    </Routes>
  );
}
