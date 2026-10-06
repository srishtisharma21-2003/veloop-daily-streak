import { Flame } from 'lucide-react';
import styles from '../../pages/DailyStreak/DailyStreak.module.css';

export default function HeroBanner() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroLeft}>
        <h2 className={styles.heroTitle}>Daily Check-In Rewards</h2>
        <p className={styles.heroSubtitle}>Check in every day and earn exciting rewards!</p>
      </div>
      <div className={styles.heroRight}>
        <div className={styles.heroIconWrapper}>
          <Flame size={64} color="#fbbf24" />
        </div>
      </div>
    </div>
  );
}
