import RewardCard from './RewardCard.jsx';
import styles from '../../pages/DailyStreak/DailyStreak.module.css';

export default function RewardGrid({ rewards, currentDay, onClaim, claiming, nextClaimAt, serverTime, isClaimable }) {
  return (
    <div className={styles.rewardGrid}>
      {rewards.map((r) => (
        <RewardCard
          key={r.day}
          reward={r}
          isToday={r.day === currentDay}
          onClaim={onClaim}
          claiming={claiming}
          nextClaimAt={r.day === currentDay ? nextClaimAt : null}
          serverTime={serverTime}
          isClaimable={isClaimable}
        />
      ))}
    </div>
  );
}
