import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Competition } from '@/types/competition';
import styles from './index.module.scss';

interface Props {
  competition: Competition;
  onClick?: () => void;
}

const CompetitionCard: React.FC<Props> = ({ competition, onClick }) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing':
        return '报名中';
      case 'upcoming':
        return '即将开始';
      case 'ended':
        return '已结束';
      default:
        return '未知';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'ongoing':
        return styles.statusOngoing;
      case 'upcoming':
        return styles.statusUpcoming;
      case 'ended':
        return styles.statusEnded;
      default:
        return '';
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Taro.navigateTo({
        url: `/pages/home/index?competitionId=${competition.id}`
      });
    }
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <Image
        className={styles.coverImage}
        src={competition.coverImage}
        mode='aspectFill'
      />
      <View className={styles.content}>
        <View className={styles.header}>
          <Text className={styles.title}>{competition.title}</Text>
          <View className={`${styles.statusTag} ${getStatusClass(competition.status)}`}>
            <Text className={styles.statusText}>{getStatusText(competition.status)}</Text>
          </View>
        </View>
        <Text className={styles.subtitle}>{competition.subtitle}</Text>
        <View className={styles.info}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>报名截止</Text>
            <Text className={styles.infoValue}>{competition.registrationDeadline}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>奖金池</Text>
            <Text className={styles.infoValueHighlight}>{competition.prizePool}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>已报名</Text>
            <Text className={styles.infoValue}>{competition.participantCount}个团队</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CompetitionCard;
