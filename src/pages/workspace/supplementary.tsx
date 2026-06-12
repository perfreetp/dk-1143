import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext, SupplementaryMaterial } from '@/store/AppContext';
import styles from './supplementary.module.scss';

const SupplementaryPage: React.FC = () => {
  const { application, addSupplementaryMaterial, loadApplications } = useAppContext();
  const [materials, setMaterials] = useState<SupplementaryMaterial[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    if (application) {
      const requiredMaterials: SupplementaryMaterial[] = [
        {
          id: 'tech_demo',
          name: '技术演示视频',
          file: application.supplementaryMaterials?.find(m => m.id === 'tech_demo')?.file || null,
          uploadedAt: application.supplementaryMaterials?.find(m => m.id === 'tech_demo')?.uploadedAt
        },
        {
          id: 'market_analysis',
          name: '市场分析报告',
          file: application.supplementaryMaterials?.find(m => m.id === 'market_analysis')?.file || null,
          uploadedAt: application.supplementaryMaterials?.find(m => m.id === 'market_analysis')?.uploadedAt
        },
        {
          id: 'team_intro',
          name: '团队介绍材料',
          file: application.supplementaryMaterials?.find(m => m.id === 'team_intro')?.file || null,
          uploadedAt: application.supplementaryMaterials?.find(m => m.id === 'team_intro')?.uploadedAt
        }
      ];
      setMaterials(requiredMaterials);
    }
  }, [application]);

  const handleFileUpload = (materialId: string) => {
    Taro.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        const file = res.tempFiles[0];
        const fileData = {
          name: file.name,
          size: (file.size / 1024).toFixed(2) + 'KB'
        };

        const updatedMaterials = materials.map(m => 
          m.id === materialId ? { ...m, file: fileData } : m
        );
        setMaterials(updatedMaterials);
        setHasChanges(true);
        Taro.showToast({
          title: '上传成功',
          icon: 'success'
        });
      }
    });
  };

  const handleSave = () => {
    materials.forEach(material => {
      if (material.file) {
        addSupplementaryMaterial(material);
      }
    });
    setHasChanges(false);
    Taro.showToast({
      title: '保存成功',
      icon: 'success'
    });
    setTimeout(() => {
      Taro.switchTab({
        url: '/pages/workspace/index'
      });
    }, 1500);
  };

  const getUploadedCount = () => {
    return materials.filter(m => m.file).length;
  };

  if (!application) {
    return (
      <View className={styles.container}>
        <View className={styles.content}>
          <Text>暂无报名信息</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>材料补交</Text>
        <Text className={styles.headerSubtitle}>
          已上传 {getUploadedCount()}/{materials.length} 项材料
        </Text>
      </View>

      <ScrollView className={styles.content} scrollY>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>待补交材料</Text>
          
          {materials.map(material => (
            <View key={material.id} className={styles.materialCard}>
              <View className={styles.materialHeader}>
                <View>
                  <Text className={styles.materialName}>{material.name}</Text>
                  <Text className={styles.materialDesc}>
                    {material.id === 'tech_demo' && '请上传项目技术演示视频（MP4格式，不超过100MB）'}
                    {material.id === 'market_analysis' && '请上传详细的市场分析报告（PDF或Word格式）'}
                    {material.id === 'team_intro' && '请上传团队成员介绍和分工说明（PDF或Word格式）'}
                  </Text>
                </View>
                <View className={`${styles.materialStatus} ${
                  material.file ? styles.statusUploaded : styles.statusRequired
                }`}>
                  <Text>{material.file ? '已上传' : '待上传'}</Text>
                </View>
              </View>

              {material.file ? (
                <View className={styles.uploadedFile}>
                  <View className={styles.fileInfo}>
                    <Text className={styles.fileName}>{material.file.name}</Text>
                    <Text className={styles.fileSize}>{material.file.size}</Text>
                    {material.uploadedAt && (
                      <Text className={styles.fileUploadedAt}>
                        上传于：{new Date(material.uploadedAt).toLocaleString()}
                      </Text>
                    )}
                  </View>
                  <Button className={styles.changeFileBtn} onClick={() => handleFileUpload(material.id)}>
                    更换
                  </Button>
                </View>
              ) : (
                <View className={styles.materialUploadArea} onClick={() => handleFileUpload(material.id)}>
                  <Text className={styles.uploadIcon}>📤</Text>
                  <Text className={styles.uploadText}>点击上传文件</Text>
                  <Text className={styles.uploadHint}>支持 PDF、Word、视频格式</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles.bottomBar}>
        <Button className={styles.saveBtn} onClick={handleSave}>
          保存所有材料
        </Button>
      </View>
    </View>
  );
};

export default SupplementaryPage;
