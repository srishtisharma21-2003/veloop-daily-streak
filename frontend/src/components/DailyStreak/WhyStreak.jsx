import { Flame, TrendingUp, Gift, ShieldCheck } from 'lucide-react';
import styles from '../../pages/DailyStreak/DailyStreak.module.css';

const features = [
  { icon: Flame, title: 'Stay Active', desc: 'Keep your streak alive & earn more!' },
  { icon: TrendingUp, title: 'Bigger Streak', desc: 'More consecutive logins, bigger rewards!' },
  { icon: Gift, title: 'Exclusive Rewards', desc: 'Get coins, gift cards & special bonuses!' },
  { icon: ShieldCheck, title: "Don't Miss Out", desc: 'Come back every day & unlock all rewards!' }
];

export default function WhyStreak() {
  return (
    <div className={styles.whyStreak}>
      <h3 className={styles.whyTitle}>??? Why Maintain Your Streak? ???</h3>
      <div className={styles.whyGrid}>
        {features.map((f, i) => (
          <div key={i} className={styles.whyCard}>
            <f.icon size={32} color="#a855f7" />
            <div className={styles.whyCardTitle}>{f.title}</div>
            <div className={styles.whyCardDesc}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
