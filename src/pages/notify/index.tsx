import React, { useState } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface Notification {
  id: string;
  type: 'award' | 'resource' | 'system' | 'update';
  title: string;
  content: string;
  time: string;
  read: boolean;
  image?: string;
  badge?: string;
}

const NotifyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const notifications: Notification[] = [
    {
      id: '1',
      type: 'award',
      title: '🏆 恭喜获得一等奖！',
      content: '您的项目"智能校园服务平台"在2024校园创新创业大赛中荣获一等奖！',
      time: '2024-05-30 18:00',
      read: false,
      badge: '一等奖'
    },
    {
      id: '2',
      type: 'resource',
      title: '🎁 孵化资源已到账',
      content: '您的一等奖孵化资源（10万元）已成功到账，请查收！',
      time: '2024-05-31 10:00',
      read: false
    },
    {
      id: '3',
      type: 'system',
      title: '📋 决赛答辩时间确认',
      content: '您的决赛答辩时间已确认为5月15日 09:30，请提前30分钟到达现场。',
      time: '2024-04-28 14:00',
      read: true
    },
    {
      id: '4',
      type: 'resource',
      title: '🤝 投资机构对接邀请',
      content: '知名投资机构对您的项目感兴趣，邀请您参加线上对接会。',
      time: '2024-04-25 09:00',
      read: true
    },
    {
      id: '5',
      type: 'update',
      title: '📝 材料审核通过',
      content: '恭喜！您的商业计划书已通过初审，进入下一阶段。',
      time: '2024-03-22 16:00',
      read: true
    },
    {
      id: '6',
      type: 'system',
      title: '📧 团队成员确认提醒',
      content: '您有1名团队成员尚未确认加入，请及时通知成员确认。',
      time: '2024-03-18 11:00',
      read: true
    }
  ];

  const tabs = [
    { key: 'all', label: '全部' },
    { key: 'award', label: '获奖公示' },
    { key: 'resource', label: '资源对接' },
    { key: 'system', label: '系统通知' }
  ];

  const filteredNotifications = activeTab === 'all'
    ? notifications
    : notifications.filter(n => n.type === activeTab);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'award':
        return '🏆';
      case 'resource':
        return '🎁';
      case 'system':
        return '🔔';
      case 'update':
        return '📝';
      default:
        return '📋';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'award':
        return styles.typeAward;
      case 'resource':
        return styles.typeResource;
      case 'system':
        return styles.typeSystem;
      case 'update':
        return styles.typeUpdate;
      default:
        return '';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      Taro.showToast({
        title: '标记已读',
        icon: 'success'
      });
    }
  };

  const renderNotificationCard = (notification: Notification) => (
    <View
      key={notification.id}
      className={`${styles.notificationCard} ${!notification.read ? styles.unread : ''}`}
      onClick={() => handleNotificationClick(notification)}
    >
      {!notification.read && <View className={styles.unreadDot} />}
      
      <View className={styles.notificationHeader}>
        <View className={styles.iconContainer}>
          <Text className={styles.typeIcon}>{getTypeIcon(notification.type)}</Text>
        </View>
        <View className={styles.notificationInfo}>
          <Text className={styles.notificationTitle}>{notification.title}</Text>
          <Text className={styles.notificationTime}>{notification.time}</Text>
        </View>
        {notification.badge && (
          <View className={`${styles.badge} ${getTypeColor(notification.type)}`}>
            <Text className={styles.badgeText}>{notification.badge}</Text>
          </View>
        )}
      </View>

      <Text className={styles.notificationContent}>{notification.content}</Text>
    </View>
  );

  const renderAwardSection = () => {
    const awardNotifications = notifications.filter(n => n.type === 'award');
    if (awardNotifications.length === 0) return null;

    return (
      <View className={styles.awardSection}>
        <Text className={styles.awardTitle}>🏆 获奖公示</Text>
        <View className={styles.awardCard}>
          <Image
            className={styles.awardImage}
            src='https://picsum.photos/id/1/750/400'
            mode='aspectFill'
          />
          <View className={styles.awardInfo}>
            <Text className={styles.awardProject}>智能校园服务平台</Text>
            <View className={styles.awardBadge}>
              <Text className={styles.awardBadgeText}>一等奖</Text>
            </View>
          </View>
          <View className={styles.awardDetails}>
            <View className={styles.awardItem}>
              <Text className={styles.awardLabel}>奖金</Text>
              <Text className={styles.awardValue}>10万元</Text>
            </View>
            <View className={styles.awardItem}>
              <Text className={styles.awardLabel}>孵化资源</Text>
              <Text className={styles.awardValue}>10万元</Text>
            </View>
            <View className={styles.awardItem}>
              <Text className={styles.awardLabel}>名次</Text>
              <Text className={styles.awardValue}>第1名</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderResourceSection = () => {
    const resourceNotifications = notifications.filter(n => n.type === 'resource');
    if (resourceNotifications.length === 0) return null;

    return (
      <View className={styles.resourceSection}>
        <Text className={styles.resourceTitle}>🎁 资源对接</Text>
        <View className={styles.resourceList}>
          {[
            {
              icon: '💰',
              title: '创业孵化基金',
              desc: '提供场地、资金、导师等全方位支持',
              status: '可申请'
            },
            {
              icon: '🤝',
              title: '投资机构对接',
              desc: '与知名投资机构进行一对一交流',
              status: '待确认'
            },
            {
              icon: '📚',
              title: '创业导师辅导',
              desc: '行业大咖一对一创业指导',
              status: '可申请'
            }
          ].map((resource, index) => (
            <View key={index} className={styles.resourceCard}>
              <View className={styles.resourceIcon}>
                <Text style={{ fontSize: '48rpx' }}>{resource.icon}</Text>
              </View>
              <View className={styles.resourceContent}>
                <Text className={styles.resourceName}>{resource.title}</Text>
                <Text className={styles.resourceDesc}>{resource.desc}</Text>
              </View>
              <View className={`${styles.resourceStatus} ${
                resource.status === '可申请' ? styles.statusAvailable : styles.statusPending
              }`}>
                <Text className={styles.resourceStatusText}>{resource.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View className={styles.container}>
      {/* Header */}
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <Text className={styles.headerTitle}>通知中心</Text>
          {unreadCount > 0 && (
            <View className={styles.unreadBadge}>
              <Text className={styles.unreadBadgeText}>{unreadCount}条未读</Text>
            </View>
          )}
        </View>
      </View>

      {/* Tab Header */}
      <View className={styles.tabHeader}>
        <ScrollView className={styles.tabScroll} scrollX enableFlex>
          {tabs.map(tab => (
            <View
              key={tab.key}
              className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabItemActive : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text className={styles.tabText}>{tab.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView className={styles.scrollContent} scrollY>
        {renderAwardSection()}
        {renderResourceSection()}

        <View className={styles.notificationSection}>
          <Text className={styles.sectionTitle}>消息列表</Text>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(renderNotificationCard)
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📭</Text>
              <Text className={styles.emptyText}>暂无消息</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default NotifyPage;
