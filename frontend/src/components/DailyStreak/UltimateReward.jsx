import { Crown } from 'lucide-react';
import styles from '../../pages/DailyStreak/DailyStreak.module.css';

export default function UltimateReward() {
  return (
    <div className={styles.ultimate}>
      <div className={styles.ultimateIcon}>
        <Crown size={72} color="#fbbf24" />
      </div>
      <div className={styles.ultimateContent}>
        <div className={styles.ultimateLabel}>Ultimate Reward</div>
        <div className={styles.ultimateAmount}>???5</div>
        <div className={styles.ultimateDesc}>Amazon Gift Card</div>
        <div className={styles.ultimateUnlock}>Unlock on Day 7</div>
      </div>
    </div>
  );
}
