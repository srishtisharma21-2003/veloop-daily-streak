import { ArrowLeft, Flame, Gem } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import styles from '../../pages/DailyStreak/DailyStreak.module.css';

export default function StreakHeader({ streak }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>
      <h1 className={styles.headerTitle}>Daily Streak</h1>
      <div className={styles.headerRight}>
        <span className={styles.streakBadge}>
          <Flame size={16} /> {streak}
        </span>
        <button className={styles.logoutBtn} onClick={logout}>
          <Gem size={16} /> {user?.name?.split(' ')[0] || 'Logout'}
        </button>
      </div>
    </header>
  );
}
