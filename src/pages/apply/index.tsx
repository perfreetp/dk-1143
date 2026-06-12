import React, { useState, useEffect } from 'react';
import { View, Text, Input, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext, TeamMember } from '@/store/AppContext';
import styles from './index.module.scss';

const ApplyPage: React.FC = () => {
  const { application, updateApplication, setApplication, addApplication, selectedCompetitionId } = useAppContext();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [teamName, setTeamName] = useState('');
  const [teamSlogan, setTeamSlogan] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [projectIntro, setProjectIntro] = useState('');
  const [businessPlanFile, setBusinessPlanFile] = useState<{ name: string; size: string } | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (application) {
      setTeamName(application.teamName || '');
      setTeamSlogan(application.teamSlogan || '');
      setSelectedTrack(application.track || '');
      setProjectIntro(application.projectIntro || '');
      setBusinessPlanFile(application.businessPlanFile || null);
      setMembers(application.members || []);
    } else {
      setMembers([{
        id: '1',
        name: '我',
        role: '队长',
        phone: '',
        email: '',
        status: 'confirmed'
      }]);
    }
  }, [application]);

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

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!teamName.trim()) {
      newErrors.teamName = '请输入团队名称';
    }
    if (!selectedTrack) {
      newErrors.track = '请选择参赛赛道';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!businessPlanFile) {
      newErrors.businessPlan = '请上传商业计划书';
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    const confirmedMembers = members.filter(m => m.status === 'confirmed');
    if (confirmedMembers.length < 2) {
      newErrors.members = '至少需要2名已确认的团队成员';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        Taro.showToast({ title: '请完善必填信息', icon: 'none' });
        return;
      }
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        Taro.showToast({ title: '请上传商业计划书', icon: 'none' });
        return;
      }
    } else if (currentStep === 3) {
      if (!validateStep3()) {
        Taro.showToast({ title: '请完善团队信息', icon: 'none' });
        return;
      }
    }

    saveApplicationData();

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      saveApplicationData();
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const saveApplicationData = () => {
    const appData = {
      competitionId: selectedCompetitionId || application?.competitionId || '',
      competitionName: application?.competitionName || '',
      teamName,
      teamSlogan,
      track: selectedTrack,
      projectIntro,
      businessPlanFile,
      members,
      status: 'draft' as const
    };
    setApplication(appData);
  };

  const handleSubmit = () => {
    Taro.showModal({
      title: '确认提交',
      content: '确定要提交报名信息吗？提交后将无法修改。',
      success: (res) => {
        if (res.confirm) {
          Taro.showLoading({ title: '提交中...' });
          
          const submittedApp = {
            competitionId: selectedCompetitionId || application?.competitionId || '',
            competitionName: application?.competitionName || '',
            teamName,
            teamSlogan,
            track: selectedTrack,
            projectIntro,
            businessPlanFile,
            members,
            status: 'submitted' as const,
            submittedAt: new Date().toISOString()
          };

          setApplication(submittedApp);
          addApplication(submittedApp);

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
        const fileData = {
          name: file.name,
          size: (file.size / 1024).toFixed(2) + 'KB'
        };
        setBusinessPlanFile(fileData);
        setErrors({});
        Taro.showToast({
          title: '上传成功',
          icon: 'success'
        });
      }
    });
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      Taro.showToast({ title: '请输入成员姓名', icon: 'none' });
      return;
    }
    if (!newMemberRole.trim()) {
      Taro.showToast({ title: '请输入成员角色', icon: 'none' });
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      role: newMemberRole.trim(),
      phone: newMemberPhone.trim(),
      email: newMemberEmail.trim(),
      status: 'pending'
    };

    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberPhone('');
    setNewMemberEmail('');
    setShowAddMember(false);

    Taro.showToast({
      title: '已添加成员',
      icon: 'success'
    });
  };

  const handleRemoveMember = (memberId: string) => {
    if (members.length <= 1) {
      Taro.showToast({
        title: '至少保留一名成员',
        icon: 'none'
      });
      return;
    }
    const updatedMembers = members.filter(m => m.id !== memberId);
    setMembers(updatedMembers);
  };

  const handleConfirmMember = (memberId: string) => {
    const updatedMembers = members.map(m => 
      m.id === memberId ? { ...m, status: 'confirmed' as const } : m
    );
    setMembers(updatedMembers);
    Taro.showToast({
      title: '成员已确认',
      icon: 'success'
    });
  };

  const handleProjectIntroChange = (e: any) => {
    setProjectIntro(e.detail.value);
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
          className={`${styles.formInput} ${errors.teamName ? styles.inputError : ''}`}
          placeholder='请输入团队名称'
          value={teamName}
          onInput={(e) => {
            setTeamName(e.detail.value);
            if (errors.teamName) setErrors({...errors, teamName: ''});
          }}
        />
        {errors.teamName && <Text className={styles.errorText}>{errors.teamName}</Text>}
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
              onClick={() => {
                setSelectedTrack(track);
                if (errors.track) setErrors({...errors, track: ''});
              }}
            >
              <Text className={styles.trackText}>{track}</Text>
            </View>
          ))}
        </View>
        {errors.track && <Text className={styles.errorText}>{errors.track}</Text>}
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
          <View 
            className={`${styles.uploadArea} ${errors.businessPlan ? styles.uploadAreaError : ''}`} 
            onClick={handleFileUpload}
          >
            <Text className={styles.uploadIcon}>📄</Text>
            <Text className={styles.uploadText}>点击上传商业计划书</Text>
            <Text className={styles.uploadHint}>支持 PDF、Word 格式</Text>
          </View>
        )}
      </View>

      <View className={styles.formCard}>
        <Text className={styles.formLabel}>项目简介</Text>
        <View className={styles.textareaWrapper}>
          <Input
            className={styles.textarea}
            placeholder='请简要描述您的项目（至少50字）'
            value={projectIntro}
            onInput={handleProjectIntroChange}
            type='textarea'
            maxlength={500}
          />
        </View>
        <Text className={styles.charCount}>{projectIntro.length}/500</Text>
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
              {(member.phone || member.email) && (
                <Text className={styles.memberContact}>{member.phone || member.email}</Text>
              )}
            </View>
            <View className={`${styles.memberStatus} ${member.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending}`}>
              <Text className={styles.memberStatusText}>
                {member.status === 'confirmed' ? '已确认' : '待确认'}
              </Text>
            </View>
          </View>
          <View className={styles.memberActions}>
            {member.status === 'pending' && (
              <Button className={styles.confirmBtn} onClick={() => handleConfirmMember(member.id)}>确认</Button>
            )}
            {index > 0 && (
              <Button className={styles.memberActionBtn} onClick={() => handleRemoveMember(member.id)}>移除</Button>
            )}
          </View>
        </View>
      ))}

      {errors.members && <Text className={styles.errorText}>{errors.members}</Text>}

      {showAddMember ? (
        <View className={styles.addMemberForm}>
          <View className={styles.formCard}>
            <Text className={styles.formLabel}>姓名 *</Text>
            <Input
              className={styles.formInput}
              placeholder='请输入成员姓名'
              value={newMemberName}
              onInput={(e) => setNewMemberName(e.detail.value)}
            />
          </View>
          <View className={styles.formCard}>
            <Text className={styles.formLabel}>角色 *</Text>
            <Input
              className={styles.formInput}
              placeholder='如：技术负责人、运营总监'
              value={newMemberRole}
              onInput={(e) => setNewMemberRole(e.detail.value)}
            />
          </View>
          <View className={styles.formCard}>
            <Text className={styles.formLabel}>手机号</Text>
            <Input
              className={styles.formInput}
              placeholder='请输入手机号（选填）'
              value={newMemberPhone}
              onInput={(e) => setNewMemberPhone(e.detail.value)}
              type='phone'
            />
          </View>
          <View className={styles.formCard}>
            <Text className={styles.formLabel}>邮箱</Text>
            <Input
              className={styles.formInput}
              placeholder='请输入邮箱（选填）'
              value={newMemberEmail}
              onInput={(e) => setNewMemberEmail(e.detail.value)}
              type='email'
            />
          </View>
          <View className={styles.addMemberActions}>
            <Button className={styles.cancelBtn} onClick={() => setShowAddMember(false)}>取消</Button>
            <Button className={styles.confirmAddBtn} onClick={handleAddMember}>确认添加</Button>
          </View>
        </View>
      ) : (
        <View className={styles.addMemberBtn} onClick={() => setShowAddMember(true)}>
          <Text className={styles.addMemberIcon}>+</Text>
          <Text className={styles.addMemberText}>添加团队成员</Text>
        </View>
      )}

      <View className={styles.inviteTip}>
        <Text className={styles.inviteTipIcon}>💡</Text>
        <Text className={styles.inviteTipText}>
          成员添加后状态为"待确认"，成员确认后状态变为"已确认"。可通过手机号或邮箱联系成员确认加入。
        </Text>
      </View>
    </View>
  );

  const renderConfirmSubmit = () => (
    <View className={styles.formSection}>
      <View className={styles.confirmCard}>
        <Text className={styles.confirmTitle}>报名信息确认</Text>
        
        <View className={styles.confirmItem}>
          <Text className={styles.confirmLabel}>参赛赛事</Text>
          <Text className={styles.confirmValue}>{application?.competitionName || '未选择'}</Text>
        </View>

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
          <Text className={styles.confirmLabel}>项目简介</Text>
          <Text className={styles.confirmValueMulti}>{projectIntro || '未填写'}</Text>
        </View>

        <View className={styles.confirmItem}>
          <Text className={styles.confirmLabel}>团队成员</Text>
          <Text className={styles.confirmValue}>{members.length}人（{members.filter(m => m.status === 'confirmed').length}人已确认）</Text>
        </View>
        
        <View className={styles.membersList}>
          {members.map((member, index) => (
            <View key={member.id} className={styles.memberConfirmItem}>
              <Text className={styles.memberConfirmName}>{member.name}</Text>
              <Text className={styles.memberConfirmRole}>{member.role}</Text>
              <View className={`${styles.memberConfirmStatus} ${member.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending}`}>
                <Text className={styles.memberConfirmStatusText}>
                  {member.status === 'confirmed' ? '已确认' : '待确认'}
                </Text>
              </View>
            </View>
          ))}
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
      {renderStepIndicator()}

      <ScrollView className={styles.scrollContent} scrollY>
        {currentStep === 1 && renderBasicInfo()}
        {currentStep === 2 && renderBusinessPlan()}
        {currentStep === 3 && renderTeamMembers()}
        {currentStep === 4 && renderConfirmSubmit()}
      </ScrollView>

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
