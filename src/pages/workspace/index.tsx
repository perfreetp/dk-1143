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
  const { application, applicationList, drafts, loadApplications, setApplication, deleteDraft } = useAppContext();
  const [activeTab, setActiveTab] = useState('progress');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (applicationList.length > 0 && !application) {
      setApplication(applicationList[applicationList.length - 1]);
    }
  }, [applicationList]);

  const currentApp = application || (applicationList.length > 0 ? applicationList[applicationList.length - 1] : null);

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
      draft: { phase: '草稿', progress: 25, color: '#FAAD14' },
      submitted: { phase: '待审核', progress: 50, color: '#5B86E5' },
      under_review: { phase: '审核中', progress: 65, color: '#36D1DC' },
      approved: { phase: '已通过', progress: 80, color: '#52C41A' }
    };

    const statusInfo = statusMap[currentApp.status] || { phase: '未知', progress: 0, color: '#86909C' };

    return {
      name: currentApp.teamName || '我的项目',
      teamName: currentApp.teamName || '--',
      competition: currentApp.competitionName || '未知赛事',
      currentPhase: statusInfo.phase,
      phaseProgress: statusInfo.progress,
      phaseColor: statusInfo.color,
      track: currentApp.track,
      members: currentApp.members,
      businessPlanFile: currentApp.businessPlanFile,
      projectIntro: currentApp.projectIntro,
      status: currentApp.status
    };
  };

  const projectInfo = getProjectInfo();

  const milestones: Milestone[] = currentApp ? [
    {
      id: '1',
      title: '提交报名',
      time: currentApp.submittedAt ? new Date(currentApp.submittedAt).toLocaleDateString() : '草稿保存',
      status: currentApp.status === 'draft' ? 'current' : 'completed',
      description: currentApp.status === 'draft' ? '报名材料保存为草稿' : '报名材料已提交，等待审核'
    },
    {
      id: '2',
      title: '材料初审',
      time: currentApp.status === 'submitted' ? '审核中' : currentApp.status === 'under_review' ? '审核中' : '待审核',
      status: currentApp.status === 'submitted' || currentApp.status === 'under_review' ? 'current' : 'pending',
      description: '评委正在审核您的商业计划书'
    },
    {
      id: '3',
      title: '项目路演',
      time: '待进行',
      status: currentApp.status === 'approved' ? 'current' : 'pending',
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
      title: '结果公示',
      time: '待进行',
      status: 'pending',
      description: '公布获奖名单'
    }
  ] : [];

  const todoItems: TodoItem[] = currentApp ? [
    ...(currentApp.status === 'draft' ? [{
      id: '1',
      title: '继续完善报名材料',
      deadline: '尽快完成',
      priority: 'high' as const,
      status: 'pending' as const
    }] : []),
    ...(currentApp.status === 'submitted' ? [{
      id: '2',
      title: '等待材料初审',
      deadline: '3-5个工作日',
      priority: 'medium' as const,
      status: 'pending' as const
    }] : []),
    ...(currentApp.members?.some(m => m.status === 'pending') ? [{
      id: '3',
      title: '团队成员待确认',
      deadline: '尽快',
      priority: 'medium' as const,
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

  const handleContinueDraft = (draft) => {
    setApplication(draft);
    Taro.switchTab({
      url: '/pages/apply/index'
    });
  };

  const handleDeleteDraft = (competitionId: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个草稿吗？',
      success: (res) => {
        if (res.confirm) {
          deleteDraft(competitionId);
          Taro.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  };

  const renderDraftsSection = () => {
    if (drafts.length === 0) return null;

    return (
      <View className={styles.draftsSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>📝 草稿箱</Text>
          <Text className={styles.sectionCount}>{drafts.length}个草稿</Text>
        </View>

        {drafts.map(draft => (
          <View key={draft.competitionId} className={styles.draftCard}>
            <View className={styles.draftInfo}>
              <Text className={styles.draftCompetition}>{draft.competitionName}</Text>
              <Text className={styles.draftTeam}>{draft.teamName || '未填写团队名称'}</Text>
              <Text className={styles.draftTime}>
                最后保存：{draft.updatedAt ? new Date(draft.updatedAt).toLocaleString() : '未知'}
              </Text>
            </View>
            <View className={styles.draftActions}>
              <Button className={styles.continueBtn} onClick={() => handleContinueDraft(draft)}>
                继续填写
              </Button>
              <Button className={styles.deleteBtn} onClick={() => handleDeleteDraft(draft.competitionId)}>
                删除
              </Button>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className={styles.emptyStateContainer}>
      <Text className={styles.emptyIcon}>📋</Text>
      <Text className={styles.emptyTitle}>暂未报名</Text>
      <Text className={styles.emptyDesc}>
        {drafts.length > 0 ? '您有未完成的报名，快去继续填写吧！' : '快去选择心仪的赛事报名吧！'}
      </Text>
      <Button className={styles.gotoApplyBtn} onClick={() => Taro.switchTab({ url: '/pages/home/index' })}>
        {drafts.length > 0 ? '继续报名' : '前往报名'}
      </Button>
    </View>
  );

  const renderProgressTab = () => {
    if (!currentApp) {
      return renderEmptyState();
    }

    const confirmedMembers = currentApp.members?.filter(m => m.status === 'confirmed').length || 0;
    const totalMembers = currentApp.members?.length || 0;

    return (
      <View className={styles.tabContent}>
        {renderDraftsSection()}

        {currentApp.status === 'draft' && (
          <View className={styles.draftBanner}>
            <Text className={styles.draftBannerText}>⚠️ 当前为草稿状态，请尽快完成报名</Text>
            <Button className={styles.draftBannerBtn} onClick={() => Taro.switchTab({ url: '/pages/apply/index' })}>
              继续填写
            </Button>
          </View>
        )}

        {/* Project Overview Card */}
        <View className={styles.overviewCard}>
          <View className={styles.projectHeader}>
            <Text className={styles.projectName}>{projectInfo.name}</Text>
            <View className={styles.projectBadge} style={{ background: projectInfo.phaseColor }}>
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
              <View className={styles.progressFill} style={{ 
                width: `${projectInfo.phaseProgress}%`,
                background: projectInfo.phaseColor
              }} />
            </View>
          </View>
        </View>

        {/* Project Details */}
        <View className={styles.detailsCard}>
          <Text className={styles.detailsTitle}>项目档案</Text>
          
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
            <Text className={styles.detailValue}>{totalMembers}人（{confirmedMembers}人已确认）</Text>
          </View>

          <View className={styles.detailItem}>
            <Text className={styles.detailLabel}>商业计划书</Text>
            <Text className={styles.detailValue}>{projectInfo.businessPlanFile?.name || '未上传'}</Text>
          </View>

          <View className={styles.detailItem}>
            <Text className={styles.detailLabel}>报名状态</Text>
            <Text className={styles.detailValue} style={{ color: projectInfo.phaseColor }}>
              {projectInfo.currentPhase}
            </Text>
          </View>

          {projectInfo.projectIntro && (
            <View className={styles.detailItem}>
              <Text className={styles.detailLabel}>项目简介</Text>
              <Text className={styles.detailValueMulti}>{projectInfo.projectIntro}</Text>
            </View>
          )}
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

        {/* Quick Actions */}
        <View className={styles.quickActions}>
          <Button className={styles.quickActionBtn} onClick={() => {
            if (currentApp && currentApp.status === 'submitted' || currentApp?.status === 'under_review') {
              Taro.navigateTo({ url: '/pages/workspace/supplementary' });
            } else {
              Taro.showToast({ title: '请先提交报名', icon: 'none' });
            }
          }}>
            📤 材料补交
          </Button>
          <Button className={styles.quickActionBtn} onClick={() => {
            Taro.switchTab({ url: '/pages/review/index' });
          }}>
            📅 答辩预约
          </Button>
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
              <Text className={styles.phaseTime}>
                {currentApp.status === 'draft' ? '草稿保存' : '已提交'}
              </Text>
            </View>
            <View className={styles.phaseStatus}>
              <Text className={currentApp.status === 'draft' ? styles.statusDraft : styles.statusCompleted}>
                {currentApp.status === 'draft' ? '草稿' : '已完成'}
              </Text>
            </View>
          </View>

          <View className={styles.phaseItem}>
            <View className={`${styles.phaseIcon} ${currentApp.status !== 'draft' ? styles.phaseIconActive : styles.phaseIconPending}`}>
              <Text>2</Text>
            </View>
            <View className={styles.phaseContent}>
              <Text className={styles.phaseTitle}>材料初审</Text>
              <Text className={styles.phaseTime}>
                {currentApp.status === 'submitted' ? '等待审核' : 
                 currentApp.status === 'under_review' ? '审核中' : 
                 currentApp.status === 'approved' ? '已通过' : '待提交'}
              </Text>
            </View>
            <View className={styles.phaseStatus}>
              <Text className={currentApp.status === 'submitted' || currentApp.status === 'under_review' ? styles.statusOngoing : styles.statusPending}>
                {currentApp.status === 'submitted' || currentApp.status === 'under_review' ? '进行中' : '待开始'}
              </Text>
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
