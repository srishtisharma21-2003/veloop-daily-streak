import { Calendar, CheckCircle, Star } from 'lucide-react';
import styles from '../../pages/DailyStreak/DailyStreak.module.css';

export default function StreakStats({ totalRewards, checkedIn, nextReward }) {
  return (
    <div className={styles.statsRow}>
      <div className={styles.statCard}>
        <Calendar size={22} color="#a78bfa" />
        <div>
          <div className={styles.statLabel}>Total Rewards</div>
          <div className={styles.statValue}>{totalRewards}</div>
        </div>
      </div>
      <div className={styles.statCard}>
        <CheckCircle size={22} color="#4ade80" />
        <div>
          <div className={styles.statLabel}>Checked In</div>
          <div className={styles.statValue}>{checkedIn}</div>
        </div>
      </div>
      <div className={styles.statCard}>
        <Star size={22} color="#fbbf24" />
        <div>
          <div className={styles.statLabel}>Next Reward</div>
          <div className={styles.statValue}>{nextReward ? `+${nextReward.amount} ${nextReward.currency}` : '???'}</div>
        </div>
      </div>
    </div>
  );
}
