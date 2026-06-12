import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface Milestone {
  id: string;
  title: string;
  time: string;
  status: 'completed' | 'current' | 'pending';
  description: string;
}

interface TodoItem {
  id: string;
  title: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
}

const WorkspacePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('progress');

  const projectInfo = {
    name: '智能校园服务平台',
    teamName: '创梦团队',
    competition: '2024校园创新创业大赛',
    currentPhase: '初审阶段',
    phaseProgress: 65
  };

  const milestones: Milestone[] = [
    {
      id: '1',
      title: '报名提交',
      time: '2024-03-15',
      status: 'completed',
      description: '团队报名信息已提交'
    },
    {
      id: '2',
      title: '材料初审',
      time: '2024-03-20',
      status: 'current',
      description: '商业计划书正在审核中'
    },
    {
      id: '3',
      title: '项目路演',
      time: '2024-04-10',
      status: 'pending',
      description: '准备路演材料和PPT'
    },
    {
      id: '4',
      title: '决赛答辩',
      time: '2024-05-15',
      status: 'pending',
      description: '现场答辩和评委问答'
    },
    {
      id: '5',
      title: '颁奖典礼',
      time: '2024-05-30',
      status: 'pending',
      description: '公布获奖名单并颁奖'
    }
  ];

  const todoItems: TodoItem[] = [
    {
      id: '1',
      title: '补充技术方案说明',
      deadline: '2024-03-25',
      priority: 'high',
      status: 'pending'
    },
    {
      id: '2',
      title: '上传项目演示视频',
      deadline: '2024-03-28',
      priority: 'medium',
      status: 'pending'
    },
    {
      id: '3',
      title: '确认路演时间',
      deadline: '2024-04-05',
      priority: 'low',
      status: 'pending'
    }
  ];

  const tabs = [
    { key: 'progress', label: '报名进度' },
    { key: 'milestone', label: '里程碑' },
    { key: 'todo', label: '待办事项' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return '';
    }
  };

  const handleTodoAction = (todoId: string) => {
    Taro.showToast({
      title: '处理中...',
      icon: 'loading'
    });
  };

  const renderProgressTab = () => (
    <View className={styles.tabContent}>
      {/* Project Overview Card */}
      <View className={styles.overviewCard}>
        <View className={styles.projectHeader}>
          <Text className={styles.projectName}>{projectInfo.name}</Text>
          <View className={styles.projectBadge}>
            <Text className={styles.projectBadgeText}>{projectInfo.currentPhase}</Text>
          </View>
        </View>
        <Text className={styles.projectTeam}>{projectInfo.teamName}</Text>
        <Text className={styles.projectCompetition}>{projectInfo.competition}</Text>
        
        <View className={styles.progressSection}>
          <View className={styles.progressHeader}>
            <Text className={styles.progressLabel}>整体进度</Text>
            <Text className={styles.progressPercent}>{projectInfo.phaseProgress}%</Text>
          </View>
          <View className={styles.progressBar}>
            <View className={styles.progressFill} style={{ width: `${projectInfo.phaseProgress}%` }} />
          </View>
        </View>
      </View>

      {/* Phase List */}
      <View className={styles.phaseList}>
        <Text className={styles.sectionTitle}>报名流程</Text>
        
        <View className={styles.phaseItem}>
          <View className={styles.phaseIcon}>
            <Text>✓</Text>
          </View>
          <View className={styles.phaseContent}>
            <Text className={styles.phaseTitle}>团队报名</Text>
            <Text className={styles.phaseTime}>2024-03-15 已完成</Text>
          </View>
          <View className={styles.phaseStatus}>
            <Text className={styles.statusCompleted}>已完成</Text>
          </View>
        </View>

        <View className={styles.phaseItem}>
          <View className={`${styles.phaseIcon} ${styles.phaseIconActive}`}>
            <Text>2</Text>
          </View>
          <View className={styles.phaseContent}>
            <Text className={styles.phaseTitle}>材料初审</Text>
            <Text className={styles.phaseTime}>2024-03-20 进行中</Text>
          </View>
          <View className={styles.phaseStatus}>
            <Text className={styles.statusOngoing}>审核中</Text>
          </View>
        </View>

        <View className={styles.phaseItem}>
          <View className={`${styles.phaseIcon} ${styles.phaseIconPending}`}>
            <Text>3</Text>
          </View>
          <View className={styles.phaseContent}>
            <Text className={styles.phaseTitle}>项目路演</Text>
            <Text className={styles.phaseTime}>2024-04-10 待进行</Text>
          </View>
          <View className={styles.phaseStatus}>
            <Text className={styles.statusPending}>待开始</Text>
          </View>
        </View>

        <View className={styles.phaseItem}>
          <View className={`${styles.phaseIcon} ${styles.phaseIconPending}`}>
            <Text>4</Text>
          </View>
          <View className={styles.phaseContent}>
            <Text className={styles.phaseTitle}>决赛答辩</Text>
            <Text className={styles.phaseTime}>2024-05-15 待进行</Text>
          </View>
          <View className={styles.phaseStatus}>
            <Text className={styles.statusPending}>待开始</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderMilestoneTab = () => (
    <View className={styles.tabContent}>
      <View className={styles.timeline}>
        {milestones.map((milestone, index) => (
          <View key={milestone.id} className={styles.timelineItem}>
            <View className={styles.timelineLeft}>
              <View className={`${styles.timelineDot} ${
                milestone.status === 'completed' ? styles.dotCompleted :
                milestone.status === 'current' ? styles.dotCurrent : styles.dotPending
              }`}>
                {milestone.status === 'completed' && <Text>✓</Text>}
                {milestone.status === 'current' && <Text className={styles.dotPulse} />}
              </View>
              {index < milestones.length - 1 && (
                <View className={`${styles.timelineLine} ${
                  milestone.status === 'completed' ? styles.lineCompleted : ''
                }`} />
              )}
            </View>
            <View className={styles.timelineContent}>
              <View className={styles.timelineHeader}>
                <Text className={styles.timelineTitle}>{milestone.title}</Text>
                <Text className={styles.timelineTime}>{milestone.time}</Text>
              </View>
              <Text className={styles.timelineDesc}>{milestone.description}</Text>
              {milestone.status === 'current' && (
                <View className={styles.currentBadge}>
                  <Text className={styles.currentBadgeText}>当前阶段</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTodoTab = () => (
    <View className={styles.tabContent}>
      {todoItems.length > 0 ? (
        <View className={styles.todoList}>
          {todoItems.map(todo => (
            <View key={todo.id} className={styles.todoItem}>
              <View className={styles.todoCheckbox}>
                <View className={`${styles.checkbox} ${todo.status === 'completed' ? styles.checkboxChecked : ''}`}>
                  {todo.status === 'completed' && <Text className={styles.checkmark}>✓</Text>}
                </View>
              </View>
              <View className={styles.todoContent}>
                <Text className={`${styles.todoTitle} ${todo.status === 'completed' ? styles.todoTitleCompleted : ''}`}>
                  {todo.title}
                </Text>
                <View className={styles.todoMeta}>
                  <View className={`${styles.priorityTag} ${getPriorityColor(todo.priority)}`}>
                    <Text className={styles.priorityText}>
                      {todo.priority === 'high' ? '紧急' : todo.priority === 'medium' ? '重要' : '一般'}
                    </Text>
                  </View>
                  <Text className={styles.todoDeadline}>截止：{todo.deadline}</Text>
                </View>
              </View>
              <Button className={styles.todoAction} onClick={() => handleTodoAction(todo.id)}>
                处理
              </Button>
            </View>
          ))}
        </View>
      ) : (
        <View className={styles.emptyState}>
          <Text className={styles.emptyIcon}>✨</Text>
          <Text className={styles.emptyText}>暂无待办事项</Text>
        </View>
      )}
    </View>
  );

  return (
    <View className={styles.container}>
      {/* Tab Header */}
      <View className={styles.tabHeader}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            className={`${styles.tabItem} ${activeTab === tab.key ? styles.tabItemActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <Text className={styles.tabText}>{tab.label}</Text>
          </View>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView className={styles.scrollContent} scrollY>
        {activeTab === 'progress' && renderProgressTab()}
        {activeTab === 'milestone' && renderMilestoneTab()}
        {activeTab === 'todo' && renderTodoTab()}
      </ScrollView>
    </View>
  );
};

export default WorkspacePage;
