import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface ReviewScore {
  dimension: string;
  score: number;
  maxScore: number;
  comment: string;
}

interface Review {
  id: string;
  reviewerName: string;
  reviewerTitle: string;
  overallScore: number;
  scores: ReviewScore[];
  comment: string;
  createdAt: string;
}

const ReviewPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('score');

  const reviews: Review[] = [
    {
      id: '1',
      reviewerName: '张教授',
      reviewerTitle: '科技创新领域专家',
      overallScore: 92,
      scores: [
        { dimension: '创新性', score: 24, maxScore: 25, comment: '项目具有独特的技术创新点' },
        { dimension: '可行性', score: 22, maxScore: 25, comment: '商业模式清晰，落地性强' },
        { dimension: '市场前景', score: 21, maxScore: 25, comment: '市场需求明确，有较大发展空间' },
        { dimension: '团队能力', score: 25, maxScore: 25, comment: '团队配置合理，执行力强' }
      ],
      comment: '项目整体质量很高，建议在技术实现细节上进一步完善，期待在决赛中有更好的表现。',
      createdAt: '2024-03-22'
    },
    {
      id: '2',
      reviewerName: '李总监',
      reviewerTitle: '知名投资人',
      overallScore: 88,
      scores: [
        { dimension: '创新性', score: 22, maxScore: 25, comment: '创新点明确' },
        { dimension: '可行性', score: 23, maxScore: 25, comment: '项目可落地性较高' },
        { dimension: '市场前景', score: 20, maxScore: 25, comment: '市场规模适中' },
        { dimension: '团队能力', score: 23, maxScore: 25, comment: '团队配置合理' }
      ],
      comment: '项目方向不错，建议加强市场推广策略的规划。',
      createdAt: '2024-03-23'
    }
  ];

  const defenseSlots = [
    { id: '1', time: '2024-04-10 09:00-09:15', available: false },
    { id: '2', time: '2024-04-10 09:15-09:30', available: false },
    { id: '3', time: '2024-04-10 09:30-09:45', available: true },
    { id: '4', time: '2024-04-10 09:45-10:00', available: true },
    { id: '5', time: '2024-04-10 10:00-10:15', available: false },
    { id: '6', time: '2024-04-10 14:00-14:15', available: true },
    { id: '7', time: '2024-04-10 14:15-14:30', available: true },
    { id: '8', time: '2024-04-10 14:30-14:45', available: false }
  ];

  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const tabs = [
    { key: 'score', label: '评分详情' },
    { key: 'comment', label: '评委评语' },
    { key: 'defense', label: '答辩预约' }
  ];

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return styles.scoreExcellent;
    if (percentage >= 75) return styles.scoreGood;
    if (percentage >= 60) return styles.scoreFair;
    return styles.scorePoor;
  };

  const handleSelectSlot = (slotId: string) => {
    setSelectedSlot(slotId);
  };

  const handleConfirmDefense = () => {
    if (!selectedSlot) {
      Taro.showToast({
        title: '请选择答辩时间',
        icon: 'none'
      });
      return;
    }

    const slot = defenseSlots.find(s => s.id === selectedSlot);
    Taro.showModal({
      title: '确认答辩时间',
      content: `确定预约 ${slot?.time} 进行项目答辩吗？`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({
            title: '预约成功',
            icon: 'success'
          });
        }
      }
    });
  };

  const renderScoreTab = () => {
    const currentReview = reviews[currentReviewIndex];

    return (
      <View className={styles.tabContent}>
        {/* Overall Score Card */}
        <View className={styles.overallCard}>
          <View className={styles.overallScore}>
            <Text className={styles.scoreNumber}>{currentReview.overallScore}</Text>
            <Text className={styles.scoreMax}>/100</Text>
          </View>
          <Text className={styles.overallLabel}>综合得分</Text>
          <View className={styles.reviewerInfo}>
            <Text className={styles.reviewerName}>{currentReview.reviewerName}</Text>
            <Text className={styles.reviewerTitle}>{currentReview.reviewerTitle}</Text>
          </View>
        </View>

        {/* Score Breakdown */}
        <View className={styles.scoreList}>
          <Text className={styles.sectionTitle}>分项评分</Text>
          {currentReview.scores.map((score, index) => (
            <View key={index} className={styles.scoreItem}>
              <View className={styles.scoreHeader}>
                <Text className={styles.dimensionName}>{score.dimension}</Text>
                <View className={`${styles.scoreBadge} ${getScoreColor(score.score, score.maxScore)}`}>
                  <Text className={styles.scoreValue}>{score.score}</Text>
                  <Text className={styles.scoreDivider}>/</Text>
                  <Text className={styles.scoreMaxValue}>{score.maxScore}</Text>
                </View>
              </View>
              <View className={styles.scoreBar}>
                <View
                  className={`${styles.scoreBarFill} ${getScoreColor(score.score, score.maxScore)}`}
                  style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                />
              </View>
              <Text className={styles.scoreComment}>{score.comment}</Text>
            </View>
          ))}
        </View>

        {/* Review Switcher */}
        {reviews.length > 1 && (
          <View className={styles.reviewSwitcher}>
            <Text className={styles.reviewSwitchLabel}>
              评委 {currentReviewIndex + 1} / {reviews.length}
            </Text>
            <View className={styles.switchButtons}>
              <Button
                className={styles.switchBtn}
                disabled={currentReviewIndex === 0}
                onClick={() => setCurrentReviewIndex(currentReviewIndex - 1)}
              >
                上一位
              </Button>
              <Button
                className={styles.switchBtn}
                disabled={currentReviewIndex === reviews.length - 1}
                onClick={() => setCurrentReviewIndex(currentReviewIndex + 1)}
              >
                下一位
              </Button>
            </View>
          </View>
        )}
      </View>
    );
  };

  const renderCommentTab = () => (
    <View className={styles.tabContent}>
      {reviews.map(review => (
        <View key={review.id} className={styles.commentCard}>
          <View className={styles.commentHeader}>
            <View className={styles.reviewerAvatar}>
              <Text>{review.reviewerName[0]}</Text>
            </View>
            <View className={styles.reviewerDetail}>
              <Text className={styles.reviewerName}>{review.reviewerName}</Text>
              <Text className={styles.reviewerTitle}>{review.reviewerTitle}</Text>
            </View>
            <View className={styles.reviewDate}>
              <Text>{review.createdAt}</Text>
            </View>
          </View>
          <View className={styles.commentContent}>
            <Text className={styles.commentText}>{review.comment}</Text>
          </View>
          <View className={styles.commentFooter}>
            <Text className={styles.footerLabel}>综合评分：</Text>
            <Text className={styles.footerScore}>{review.overallScore}分</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderDefenseTab = () => (
    <View className={styles.tabContent}>
      <View className={styles.defenseInfo}>
        <Text className={styles.defenseTitle}>答辩时间预约</Text>
        <Text className={styles.defenseDesc}>请选择您偏好的答辩时间段，每个时间段15分钟</Text>
      </View>

      <View className={styles.slotGrid}>
        {defenseSlots.map(slot => (
          <View
            key={slot.id}
            className={`${styles.slotItem} ${
              selectedSlot === slot.id ? styles.slotItemSelected :
              slot.available ? styles.slotItemAvailable : styles.slotItemDisabled
            }`}
            onClick={() => slot.available && handleSelectSlot(slot.id)}
          >
            <Text className={styles.slotTime}>{slot.time.split(' ')[1]}</Text>
            <Text className={styles.slotStatus}>
              {selectedSlot === slot.id ? '已选择' : slot.available ? '可选' : '已满'}
            </Text>
          </View>
        ))}
      </View>

      <View className={styles.defenseNote}>
        <Text className={styles.noteIcon}>💡</Text>
        <Text className={styles.noteText}>
          请提前30分钟到达答辩现场，准备好项目展示材料
        </Text>
      </View>

      <Button className={styles.confirmBtn} onClick={handleConfirmDefense}>
        确认预约
      </Button>
    </View>
  );

  return (
    <View className={styles.container}>
      {/* Tab Header */}
      <View className={styles.tabHeader}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={`${styles.tabItem} ${selectedTab === tab.key ? styles.tabItemActive : ''}`}
            onClick={() => setSelectedTab(tab.key)}
          >
            <Text className={styles.tabText}>{tab.label}</Text>
          </View>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView className={styles.scrollContent} scrollY>
        {selectedTab === 'score' && renderScoreTab()}
        {selectedTab === 'comment' && renderCommentTab()}
        {selectedTab === 'defense' && renderDefenseTab()}
      </ScrollView>
    </View>
  );
};

export default ReviewPage;
