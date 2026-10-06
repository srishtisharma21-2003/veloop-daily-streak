import { Loader } from 'lucide-react';
import styles from '../../pages/DailyStreak/DailyStreak.module.css';

export default function CpaDemo() {
  return (
    <div className={styles.cpaOverlay}>
      <div className={styles.cpaCard}>
        <Loader className={styles.spinner} size={48} color="#a855f7" />
        <h3>Preparing your reward...</h3>
        <p>Advertisement / Reward Verification</p>
        <p className={styles.cpaWait}>Please wait...</p>
      </div>
    </div>
  );
}
