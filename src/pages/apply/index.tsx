import React, { useState } from 'react';
import { View, Text, Input, Button, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  avatar?: string;
  status: 'confirmed' | 'pending';
}

const ApplyPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [teamSlogan, setTeamSlogan] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [businessPlanFile, setBusinessPlanFile] = useState<any>(null);
  const [members, setMembers] = useState<TeamMember[]>([
    { id: '1', name: '张三', role: '队长', phone: '13800138000', email: 'zhangsan@example.com', status: 'confirmed' }
  ]);
  const [showAddMember, setShowAddMember] = useState(false);

  const tracks = [
    '科技创新',
    '互联网+',
    '社会公益',
    '文化创意',
    '乡村振兴'
  ];

  const steps = [
    { step: 1, title: '基本信息' },
    { step: 2, title: '商业计划书' },
    { step: 3, title: '团队成员' },
    { step: 4, title: '确认提交' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    Taro.showModal({
      title: '确认提交',
      content: '确定要提交报名信息吗？提交后将无法修改。',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });
          setTimeout(() => {
            Taro.hideLoading();
            Taro.showToast({
              title: '提交成功',
              icon: 'success'
            });
            Taro.switchTab({
              url: '/pages/workspace/index'
            });
          }, 1500);
        }
      }
    });
  };

  const handleFileUpload = () => {
    Taro.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const file = res.tempFiles[0];
        setBusinessPlanFile({
          name: file.name,
          size: (file.size / 1024).toFixed(2) + 'KB'
        });
        Taro.showToast({
          title: '上传成功',
          icon: 'success'
        });
      }
    });
  };

  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: '新成员',
      role: '成员',
      phone: '',
      email: '',
      status: 'pending'
    };
    setMembers([...members, newMember]);
    setShowAddMember(false);
  };

  const handleRemoveMember = (memberId: string) => {
    if (members.length <= 1) {
      Taro.showToast({
        title: '至少保留一名成员',
        icon: 'none'
      });
      return;
    }
    setMembers(members.filter(m => m.id !== memberId));
  };

  const renderStepIndicator = () => (
    <View className={styles.stepIndicator}>
      {steps.map((item, index) => (
        <View key={item.step} className={styles.stepItem}>
          <View className={`${styles.stepCircle} ${currentStep >= item.step ? styles.stepActive : ''}`}>
            <Text className={styles.stepNumber}>{item.step}</Text>
          </View>
          <Text className={`${styles.stepText} ${currentStep >= item.step ? styles.stepTextActive : ''}`}>
            {item.title}
          </Text>
          {index < steps.length - 1 && (
            <View className={`${styles.stepLine} ${currentStep > item.step ? styles.stepLineActive : ''}`} />
          )}
        </View>
      ))}
    </View>
  );

  const renderBasicInfo = () => (
    <View className={styles.formSection}>
      <View className={styles.formCard}>
        <Text className={styles.formLabel}>团队名称 *</Text>
        <Input
          className={styles.formInput}
          placeholder='请输入团队名称'
          value={teamName}
          onInput={(e) => setTeamName(e.detail.value)}
        />
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formLabel}>团队口号</Text>
        <Input
          className={styles.formInput}
          placeholder='请输入团队口号（选填）'
          value={teamSlogan}
          onInput={(e) => setTeamSlogan(e.detail.value)}
        />
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formLabel}>参赛赛道 *</Text>
        <View className={styles.trackGrid}>
          {tracks.map(track => (
            <View
              key={track}
              className={`${styles.trackItem} ${selectedTrack === track ? styles.trackItemActive : ''}`}
              onClick={() => setSelectedTrack(track)}
            >
              <Text className={styles.trackText}>{track}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  const renderBusinessPlan = () => (
    <View className={styles.formSection}>
      <View className={styles.formCard}>
        <Text className={styles.formLabel}>商业计划书 *</Text>
        <Text className={styles.formHint}>请上传PDF或Word格式的商业计划书，文件大小不超过20MB</Text>
        
        {businessPlanFile ? (
          <View className={styles.fileCard}>
            <View className={styles.fileInfo}>
              <Text className={styles.fileName}>{businessPlanFile.name}</Text>
              <Text className={styles.fileSize}>{businessPlanFile.size}</Text>
            </View>
            <Button className={styles.changeFileBtn} onClick={handleFileUpload}>更换</Button>
          </View>
        ) : (
          <View className={styles.uploadArea} onClick={handleFileUpload}>
            <Text className={styles.uploadIcon}>📄</Text>
            <Text className={styles.uploadText}>点击上传商业计划书</Text>
            <Text className={styles.uploadHint}>支持 PDF、Word 格式</Text>
          </View>
        )}
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formLabel}>项目简介 *</Text>
        <Input
          className={styles.formInput}
          placeholder='请简要描述您的项目（200字以内）'
          value=''
          onInput={() => {}}
        />
      </View>
    </View>
  );

  const renderTeamMembers = () => (
    <View className={styles.formSection}>
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>团队成员</Text>
        <Text className={styles.sectionCount}>{members.length}人</Text>
      </View>

      {members.map((member, index) => (
        <View key={member.id} className={styles.memberCard}>
          <View className={styles.memberInfo}>
            <View className={styles.memberAvatar}>
              <Text>{member.name[0]}</Text>
            </View>
            <View className={styles.memberDetail}>
              <View className={styles.memberName}>
                <Text className={styles.memberNameText}>{member.name}</Text>
                {index === 0 && <View className={styles.leaderBadge}><Text className={styles.leaderText}>队长</Text></View>}
              </View>
              <Text className={styles.memberRole}>{member.role}</Text>
            </View>
            <View className={`${styles.memberStatus} ${member.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending}`}>
              <Text className={styles.memberStatusText}>
                {member.status === 'confirmed' ? '已确认' : '待确认'}
              </Text>
            </View>
          </View>
          <View className={styles.memberActions}>
            <Button className={styles.memberActionBtn} onClick={() => handleRemoveMember(member.id)}>移除</Button>
          </View>
        </View>
      ))}

      <View className={styles.addMemberBtn} onClick={handleAddMember}>
        <Text className={styles.addMemberIcon}>+</Text>
        <Text className={styles.addMemberText}>添加团队成员</Text>
      </View>

      <View className={styles.inviteTip}>
        <Text className={styles.inviteTipIcon}>💡</Text>
        <Text className={styles.inviteTipText}>
          成员添加后，可以通过邀请链接或手机号邀请成员确认加入团队
        </Text>
      </View>
    </View>
  );

  const renderConfirmSubmit = () => (
    <View className={styles.formSection}>
      <View className={styles.confirmCard}>
        <Text className={styles.confirmTitle}>报名信息确认</Text>
        
        <View className={styles.confirmItem}>
          <Text className={styles.confirmLabel}>团队名称</Text>
          <Text className={styles.confirmValue}>{teamName || '未填写'}</Text>
        </View>

        <View className={styles.confirmItem}>
          <Text className={styles.confirmLabel}>参赛赛道</Text>
          <Text className={styles.confirmValue}>{selectedTrack || '未选择'}</Text>
        </View>

        <View className={styles.confirmItem}>
          <Text className={styles.confirmLabel}>商业计划书</Text>
          <Text className={styles.confirmValue}>{businessPlanFile ? businessPlanFile.name : '未上传'}</Text>
        </View>

        <View className={styles.confirmItem}>
          <Text className={styles.confirmLabel}>团队成员</Text>
          <Text className={styles.confirmValue}>{members.length}人</Text>
        </View>
      </View>

      <View className={styles.agreementCard}>
        <Text className={styles.agreementTitle}>参赛协议</Text>
        <Text className={styles.agreementText}>
          1. 参赛项目必须为原创项目，不得侵犯他人知识产权{'\n'}
          2. 参赛者需保证所填信息真实有效{'\n'}
          3. 大赛组委会有权对参赛项目进行宣传展示{'\n'}
          4. 获奖项目需配合后续孵化对接工作
        </Text>
      </View>
    </View>
  );

  return (
    <View className={styles.container}>
      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Form Content */}
      <ScrollView className={styles.scrollContent} scrollY>
        {currentStep === 1 && renderBasicInfo()}
        {currentStep === 2 && renderBusinessPlan()}
        {currentStep === 3 && renderTeamMembers()}
        {currentStep === 4 && renderConfirmSubmit()}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className={styles.bottomBar}>
        {currentStep > 1 && (
          <Button className={styles.prevBtn} onClick={handlePrev}>
            上一步
          </Button>
        )}
        <Button className={styles.nextBtn} onClick={handleNext}>
          {currentStep === 4 ? '提交报名' : '下一步'}
        </Button>
      </View>
    </View>
  );
};

export default ApplyPage;
