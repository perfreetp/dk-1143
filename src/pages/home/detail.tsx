import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useAppContext } from '@/store/AppContext';
import { mockCompetitions } from '@/data/competitions';
import styles from './detail.module.scss';

const CompetitionDetailPage: React.FC = () => {
  const router = useRouter();
  const { setSelectedCompetitionId, setApplication } = useAppContext();
  
  const competitionId = router.params.id;
  const competition = mockCompetitions.find(c => c.id === competitionId);

  if (!competition) {
    return (
      <View className={styles.container}>
        <View className={styles.content}>
          <Text>赛事不存在</Text>
        </View>
      </View>
    );
  }

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

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleApply = () => {
    if (competition.status !== 'ongoing') {
      Taro.showToast({
        title: '该赛事暂未开放报名',
        icon: 'none'
      });
      return;
    }

    setSelectedCompetitionId(competition.id);
    
    setApplication({
      competitionId: competition.id,
      competitionName: competition.title,
      teamName: '',
      teamSlogan: '',
      track: '',
      projectIntro: '',
      businessPlanFile: null,
      members: [
        {
          id: '1',
          name: Taro.getStorageSync('userName') || '我',
          role: '队长',
          phone: '',
          email: '',
          status: 'confirmed'
        }
      ],
      status: 'draft'
    });

    Taro.switchTab({
      url: '/pages/apply/index'
    });
  };

  return (
    <View className={styles.container}>
      {/* Header */}
      <View className={styles.header}>
        <Image
          className={styles.coverImage}
          src={competition.coverImage}
          mode='aspectFill'
        />
        <View className={styles.headerOverlay} />
        
        <View className={styles.backBtn} onClick={handleBack}>
          <Text className={styles.backIcon}>←</Text>
        </View>

        <View className={styles.headerContent}>
          <Text className={styles.title}>{competition.title}</Text>
          <Text className={styles.subtitle}>{competition.subtitle}</Text>
          <View className={`${styles.statusBadge} ${getStatusClass(competition.status)}`}>
            <Text>{getStatusText(competition.status)}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className={styles.content}>
        {/* Basic Info */}
        <View className={styles.infoCard}>
          <View className={styles.infoGrid}>
            <View className={styles.infoItem}>
              <Text className={styles.infoValue}>{competition.prizePool}</Text>
              <Text className={styles.infoLabel}>奖金池</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoValue}>{competition.participantCount}</Text>
              <Text className={styles.infoLabel}>已报名团队</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoValue}>{competition.registrationDeadline}</Text>
              <Text className={styles.infoLabel}>报名截止</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📋</Text>
            赛事简介
          </Text>
          <Text className={styles.description}>{competition.description}</Text>
        </View>

        {/* Requirements */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>✅</Text>
            参赛条件
          </Text>
          <View className={styles.requirementsList}>
            {competition.requirements.map((req, index) => (
              <View key={index} className={styles.requirementItem}>
                <View className={styles.requirementBullet}>
                  <Text className={styles.requirementBulletText}>{index + 1}</Text>
                </View>
                <Text className={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Process */}
        {competition.process.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📅</Text>
              赛程安排
            </Text>
            <View className={styles.processList}>
              {competition.process.map((step, index) => (
                <View key={step.step} className={styles.processItem}>
                  <View className={styles.processLeft}>
                    <View className={styles.processStep}>{step.step}</View>
                    {index < competition.process.length - 1 && (
                      <View className={`${styles.processLine} ${index < competition.process.length - 1 ? styles.processLineActive : ''}`} />
                    )}
                  </View>
                  <View className={styles.processContent}>
                    <Text className={styles.processTitle}>{step.title}</Text>
                    <Text className={styles.processTime}>{step.time}</Text>
                    <Text className={styles.processDesc}>{step.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Awards */}
        {competition.awards.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>🏆</Text>
              奖项设置
            </Text>
            <View className={styles.awardsList}>
              {competition.awards.map((award, index) => (
                <View key={index} className={styles.awardItem}>
                  <View className={styles.awardRank}>
                    <Text className={styles.awardRankText}>{award.rank}</Text>
                    <Text className={styles.awardNameText}>{award.name}</Text>
                  </View>
                  <View className={styles.awardInfo}>
                    <Text className={styles.awardPrize}>{award.prize}</Text>
                    <Text className={styles.awardCount}>共 {award.count} 个</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Bottom Action */}
      <View className={styles.bottomBar}>
        <Button
          className={`${styles.applyBtn} ${competition.status !== 'ongoing' ? styles.disabledBtn : ''}`}
          onClick={handleApply}
        >
          {competition.status === 'ongoing' ? '立即报名' : '暂未开放报名'}
        </Button>
      </View>
    </View>
  );
};

export default CompetitionDetailPage;
