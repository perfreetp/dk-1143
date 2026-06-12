import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '@/store/AppContext';
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
  const { application, applicationList, loadApplications } = useAppContext();
  const [activeTab, setActiveTab] = useState('progress');

  useEffect(() => {
    loadApplications();
  }, []);

  const currentApp = applicationList.length > 0 ? applicationList[applicationList.length - 1] : application;

  const getProjectInfo = () => {
    if (!currentApp) {
      return {
        name: '暂未报名',
        teamName: '--',
        competition: '请先选择赛事报名',
        currentPhase: '未报名',
        phaseProgress: 0
      };
    }

    const statusMap = {
      draft: { phase: '草稿', progress: 25 },
      submitted: { phase: '待审核', progress: 50 },
      under_review: { phase: '审核中', progress: 65 },
      approved: { phase: '已通过', progress: 80 }
    };

    const statusInfo = statusMap[currentApp.status] || { phase: '未知', progress: 0 };

    return {
      name: currentApp.teamName || '我的项目',
      teamName: currentApp.teamName || '--',
      competition: currentApp.competitionName || '未知赛事',
      currentPhase: statusInfo.phase,
      phaseProgress: statusInfo.progress,
      track: currentApp.track,
      members: currentApp.members,
      businessPlanFile: currentApp.businessPlanFile,
      projectIntro: currentApp.projectIntro
    };
  };

  const projectInfo = getProjectInfo();

  const milestones: Milestone[] = currentApp ? [
    {
      id: '1',
      title: '提交报名',
      time: currentApp.submittedAt ? new Date(currentApp.submittedAt).toLocaleDateString() : '已提交',
      status: 'completed',
      description: '报名材料已提交，等待审核'
    },
    {
      id: '2',
      title: '材料初审',
      time: '审核中',
      status: 'current',
      description: '评委正在审核您的商业计划书'
    },
    {
      id: '3',
      title: '项目路演',
      time: '待进行',
      status: 'pending',
      description: '通过初审后进行项目路演'
    },
    {
      id: '4',
      title: '决赛答辩',
      time: '待进行',
      status: 'pending',
      description: '现场答辩和评委问答'
    },
    {
      id: '5',
      title: '颁奖典礼',
      time: '待进行',
      status: 'pending',
      description: '公布获奖名单并颁奖'
    }
  ] : [];

  const todoItems: TodoItem[] = currentApp ? [
    {
      id: '1',
      title: '等待材料初审',
      deadline: '3-5个工作日',
      priority: 'high',
      status: 'pending'
    },
    ...(currentApp.members.some(m => m.status === 'pending') ? [{
      id: '2',
      title: '团队成员待确认',
      deadline: '尽快',
      priority: 'medium',
      status: 'pending' as const
    }] : [])
  ] : [];

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

  const renderEmptyState = () => (
    <View className={styles.emptyStateContainer}>
      <Text className={styles.emptyIcon}>📋</Text>
      <Text className={styles.emptyTitle}>暂未报名</Text>
      <Text className={styles.emptyDesc}>快去选择心仪的赛事报名吧！</Text>
      <Button className={styles.gotoApplyBtn} onClick={() => Taro.switchTab({ url: '/pages/home/index' })}>
        前往报名
      </Button>
    </View>
  );

  const renderProgressTab = () => {
    if (!currentApp) {
      return renderEmptyState();
    }

    return (
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
          {projectInfo.track && (
            <Text className={styles.projectTrack}>参赛赛道：{projectInfo.track}</Text>
          )}
          
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

        {/* Project Details */}
        <View className={styles.detailsCard}>
          <Text className={styles.detailsTitle}>项目信息</Text>
          
          <View className={styles.detailItem}>
            <Text className={styles.detailLabel}>团队名称</Text>
            <Text className={styles.detailValue}>{projectInfo.teamName}</Text>
          </View>

          <View className={styles.detailItem}>
            <Text className={styles.detailLabel}>参赛赛道</Text>
            <Text className={styles.detailValue}>{projectInfo.track || '--'}</Text>
          </View>

          <View className={styles.detailItem}>
            <Text className={styles.detailLabel}>团队成员</Text>
            <Text className={styles.detailValue}>{projectInfo.members?.length || 0}人</Text>
          </View>

          <View className={styles.detailItem}>
            <Text className={styles.detailLabel}>商业计划书</Text>
            <Text className={styles.detailValue}>{projectInfo.businessPlanFile?.name || '未上传'}</Text>
          </View>

          <View className={styles.detailItem}>
            <Text className={styles.detailLabel}>报名状态</Text>
            <Text className={`${styles.detailValue} ${styles.statusText}`}>
              {projectInfo.currentPhase}
            </Text>
          </View>
        </View>

        {/* Team Members Preview */}
        {projectInfo.members && projectInfo.members.length > 0 && (
          <View className={styles.membersPreview}>
            <Text className={styles.membersPreviewTitle}>团队成员</Text>
            <ScrollView className={styles.membersScroll} scrollX>
              {projectInfo.members.map((member, index) => (
                <View key={member.id} className={styles.memberPreviewItem}>
                  <View className={styles.memberPreviewAvatar}>
                    <Text>{member.name[0]}</Text>
                  </View>
                  <Text className={styles.memberPreviewName}>{member.name}</Text>
                  <Text className={styles.memberPreviewRole}>{member.role}</Text>
                  <View className={`${styles.memberPreviewStatus} ${member.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending}`}>
                    <Text>{member.status === 'confirmed' ? '已确认' : '待确认'}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Phase List */}
        <View className={styles.phaseList}>
          <Text className={styles.sectionTitle}>报名流程</Text>
          
          <View className={styles.phaseItem}>
            <View className={styles.phaseIcon}>
              <Text>✓</Text>
            </View>
            <View className={styles.phaseContent}>
              <Text className={styles.phaseTitle}>团队报名</Text>
              <Text className={styles.phaseTime}>已提交</Text>
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
              <Text className={styles.phaseTime}>审核中</Text>
            </View>
            <View className={styles.phaseStatus}>
              <Text className={styles.statusOngoing}>进行中</Text>
            </View>
          </View>

          <View className={styles.phaseItem}>
            <View className={`${styles.phaseIcon} ${styles.phaseIconPending}`}>
              <Text>3</Text>
            </View>
            <View className={styles.phaseContent}>
              <Text className={styles.phaseTitle}>项目路演</Text>
              <Text className={styles.phaseTime}>待进行</Text>
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
              <Text className={styles.phaseTime}>待进行</Text>
            </View>
            <View className={styles.phaseStatus}>
              <Text className={styles.statusPending}>待开始</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderMilestoneTab = () => {
    if (!currentApp) {
      return renderEmptyState();
    }

    return (
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
  };

  const renderTodoTab = () => {
    if (!currentApp) {
      return renderEmptyState();
    }

    return (
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
                  查看
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
  };

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
