import { Lock, CheckCircle, Gift, Crown, Coins } from 'lucide-react';
import { useServerTime } from '../../hooks/useServerTime.js';
import styles from '../../pages/DailyStreak/DailyStreak.module.css';

export default function RewardCard({ reward, isToday, onClaim, claiming, nextClaimAt, serverTime, isClaimable }) {
  const { formatted, remaining } = useServerTime(serverTime, nextClaimAt);
  const r = reward.reward;

  const renderIcon = () => {
    switch (r.assetType) {
      case 'crown': return <Crown size={44} color="#fbbf24" />;
      case 'gift': return <Gift size={44} color="#a855f7" />;
      case 'gift-card': return <Gift size={44} color="#c084fc" />;
      default: return <Coins size={44} color="#fbbf24" />;
    }
  };

  const renderBadge = () => {
    switch (reward.status) {
      case 'CLAIMED': return <span className={styles.badgeClaimed}><CheckCircle size={12} /> Claimed</span>;
      case 'AVAILABLE': return <span className={styles.badgeToday}>Today</span>;
      case 'MISSED': return <span className={styles.badgeMissed}>Missed</span>;
      default: return <span className={styles.badgeLocked}><Lock size={10} /> Locked</span>;
    }
  };

  const cardClass = [
    styles.card,
    isToday ? styles.todayCard : '',
    reward.status === 'CLAIMED' ? styles.claimedCard : '',
    reward.status === 'MISSED' ? styles.missedCard : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClass}>
      <div className={styles.cardHeader}>
        <span className={styles.dayLabel}>Day {reward.day}</span>
        {renderBadge()}
      </div>

      <div className={styles.cardIcon}>{renderIcon()}</div>
      <div className={styles.cardTitle}>{r.title}</div>
      <div className={styles.cardValue}>{r.type === 'VES' ? `+${r.amount}` : `???${r.amount}`}</div>
      <div className={styles.cardSubtitle}>{r.subtitle}</div>

      {reward.status === 'AVAILABLE' && isClaimable && (
        <button className={styles.claimBtn} onClick={onClaim} disabled={claiming}>
          {claiming ? 'Claiming...' : 'Claim Now'}
        </button>
      )}

      {reward.status === 'AVAILABLE' && !isClaimable && nextClaimAt && remaining > 0 && (
        <div className={styles.timer}>{formatted}</div>
      )}

      {reward.status === 'LOCKED' && (
        <div className={styles.lockedText}><Lock size={12} /> Locked</div>
      )}

      {reward.status === 'CLAIMED' && (
        <div className={styles.claimedText}><CheckCircle size={14} /> Claimed</div>
      )}
    </div>
  );
}
