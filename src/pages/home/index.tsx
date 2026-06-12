import React, { useState } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import CompetitionCard from '@/components/CompetitionCard';
import { mockCompetitions } from '@/data/competitions';
import styles from './index.module.scss';

const HomePage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: '全部' },
    { key: 'ongoing', label: '报名中' },
    { key: 'upcoming', label: '即将开始' },
    { key: 'ended', label: '往届回顾' }
  ];

  const filteredCompetitions = mockCompetitions.filter(competition => {
    const matchesSearch = competition.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                         competition.subtitle.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesFilter = activeFilter === 'all' || competition.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSearch = (e: any) => {
    setSearchKeyword(e.detail.value);
  };

  const handleFilterChange = (filterKey: string) => {
    setActiveFilter(filterKey);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'my-competition':
        Taro.switchTab({
          url: '/pages/workspace/index'
        });
        break;
      case 'guide':
        Taro.showToast({
          title: '参赛指南',
          icon: 'none'
        });
        break;
      case 'resources':
        Taro.switchTab({
          url: '/pages/notify/index'
        });
        break;
    }
  };

  return (
    <View className={styles.container}>
      {/* Header */}
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <View>
            <Text className={styles.greeting}>你好，创业者 👋</Text>
            <Text className={styles.welcomeText}>发现下一个改变世界的创意</Text>
          </View>
        </View>

        {/* Search Box */}
        <View className={styles.searchBox}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.searchInput}
            placeholder='搜索赛事...'
            placeholderClass={styles.searchInput}
            onInput={handleSearch}
            value={searchKeyword}
          />
        </View>

        {/* Quick Actions */}
        <View className={styles.quickActions}>
          <View className={styles.quickAction} onClick={() => handleQuickAction('my-competition')}>
            <Text style={{ fontSize: '48rpx' }}>📋</Text>
            <Text className={styles.quickActionText}>我的项目</Text>
          </View>
          <View className={styles.quickAction} onClick={() => handleQuickAction('guide')}>
            <Text style={{ fontSize: '48rpx' }}>📖</Text>
            <Text className={styles.quickActionText}>参赛指南</Text>
          </View>
          <View className={styles.quickAction} onClick={() => handleQuickAction('resources')}>
            <Text style={{ fontSize: '48rpx' }}>🎁</Text>
            <Text className={styles.quickActionText}>资源对接</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View className={styles.content}>
        <View className={styles.sectionTitle}>
          <Text>热门赛事</Text>
          <Text className={styles.sectionSubtitle}>共 {filteredCompetitions.length} 个赛事</Text>
        </View>

        {/* Filter Bar */}
        <ScrollView className={styles.filterBar} scrollX enableFlex>
          {filters.map(filter => (
            <View
              key={filter.key}
              className={`${styles.filterItem} ${activeFilter === filter.key ? styles.filterItemActive : ''}`}
              onClick={() => handleFilterChange(filter.key)}
            >
              <Text>{filter.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Competition List */}
        <View className={styles.competitionList}>
          {filteredCompetitions.length > 0 ? (
            filteredCompetitions.map(competition => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
              />
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>🔍</Text>
              <Text className={styles.emptyTitle}>暂无相关赛事</Text>
              <Text className={styles.emptyDesc}>换个关键词试试吧</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default HomePage;
