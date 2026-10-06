import styles from '../../pages/DailyStreak/DailyStreak.module.css';

export default function StreakSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.skeletonHeader} />
      <div className={styles.container}>
        <div className={styles.skeletonBlock} style={{ height: 120 }} />
        <div className={styles.statsRow}>
          <div className={styles.skeletonBlock} style={{ height: 80 }} />
          <div className={styles.skeletonBlock} style={{ height: 80 }} />
          <div className={styles.skeletonBlock} style={{ height: 80 }} />
        </div>
        <div className={styles.skeletonBlock} style={{ height: 160 }} />
        <div className={styles.rewardGrid}>
          {[...Array(7)].map((_, i) => (
            <div key={i} className={styles.skeletonBlock} style={{ height: 220 }} />
          ))}
        </div>
      </div>
    </div>
  );
}
