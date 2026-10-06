import { useEffect, useState, useCallback } from 'react';
import { getStreak, claimStreak } from '../../services/streakApi.js';
import StreakHeader from '../../components/DailyStreak/StreakHeader.jsx';
import HeroBanner from '../../components/DailyStreak/HeroBanner.jsx';
import StreakStats from '../../components/DailyStreak/StreakStats.jsx';
import UltimateReward from '../../components/DailyStreak/UltimateReward.jsx';
import RewardGrid from '../../components/DailyStreak/RewardGrid.jsx';
import CpaDemo from '../../components/DailyStreak/CpaDemo.jsx';
import StreakSkeleton from '../../components/DailyStreak/StreakSkeleton.jsx';
import WhyStreak from '../../components/DailyStreak/WhyStreak.jsx';
import TrustFooter from '../../components/DailyStreak/TrustFooter.jsx';
import styles from './DailyStreak.module.css';

export default function DailyStreakPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showCpa, setShowCpa] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await getStreak();
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load streak.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleClaim = async () => {
    setClaiming(true);
    setShowCpa(true);
    setError(null);

    setTimeout(async () => {
      try {
        const res = await claimStreak();
        setShowCpa(false);
        setSuccessMsg(`+${res.data.reward.amount} ${res.data.reward.currency} claimed!`);
        await fetchData();
        setTimeout(() => setSuccessMsg(null), 4000);
      } catch (err) {
        setShowCpa(false);
        setError(err.response?.data?.message || 'Unable to claim reward.');
      } finally {
        setClaiming(false);
      }
    }, 2500);
  };

  if (loading) return <StreakSkeleton />;

  if (error && !data) {
    return (
      <div className={styles.errorPage}>
        <p>{error}</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <StreakHeader streak={data?.currentStreak || 0} />

      {successMsg && <div className={styles.successToast}>{successMsg}</div>}
      {error && <div className={styles.errorToast}>{error}</div>}

      <div className={styles.container}>
        <HeroBanner />
        <StreakStats
          totalRewards={data.totalRewards}
          checkedIn={data.checkedIn}
          nextReward={data.rewards.find(r => r.day === data.currentDay)?.reward}
        />
        <UltimateReward />

        <div className={styles.comeBack}>✦ Come back tomorrow for more rewards! ✦</div>

        <RewardGrid
          rewards={data.rewards}
          currentDay={data.currentDay}
          onClaim={handleClaim}
          claiming={claiming}
          nextClaimAt={data.nextClaimAt}
          serverTime={data.serverTime}
          isClaimable={data.isClaimable}
        />

        {showCpa && <CpaDemo />}
        <WhyStreak />
      </div>

      <TrustFooter />
    </div>
  );
}
