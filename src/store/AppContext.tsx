import React, { createContext, useContext, useState, ReactNode } from 'react';
import Taro from '@tarojs/taro';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  status: 'confirmed' | 'pending';
}

export interface ProjectApplication {
  competitionId: string;
  competitionName: string;
  teamName: string;
  teamSlogan: string;
  track: string;
  projectIntro: string;
  businessPlanFile: {
    name: string;
    size: string;
  } | null;
  members: TeamMember[];
  status: 'draft' | 'submitted' | 'under_review' | 'approved';
  submittedAt?: string;
}

interface AppState {
  selectedCompetitionId: string | null;
  searchKeyword: string;
  filterStatus: string;
  application: ProjectApplication | null;
  applicationList: ProjectApplication[];
}

interface AppContextType extends AppState {
  setSelectedCompetitionId: (id: string | null) => void;
  setSearchKeyword: (keyword: string) => void;
  setFilterStatus: (status: string) => void;
  setApplication: (app: ProjectApplication | null) => void;
  updateApplication: (updates: Partial<ProjectApplication>) => void;
  addApplication: (app: ProjectApplication) => void;
  loadApplications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [application, setApplication] = useState<ProjectApplication | null>(null);
  const [applicationList, setApplicationList] = useState<ProjectApplication[]>([]);

  const updateApplication = (updates: Partial<ProjectApplication>) => {
    setApplication(prev => prev ? { ...prev, ...updates } : null);
  };

  const addApplication = (app: ProjectApplication) => {
    const newList = [...applicationList, app];
    setApplicationList(newList);
    Taro.setStorageSync('applicationList', JSON.stringify(newList));
  };

  const loadApplications = () => {
    try {
      const stored = Taro.getStorageSync('applicationList');
      if (stored) {
        setApplicationList(JSON.parse(stored));
      }
    } catch (error) {
      console.error('[AppContext] Failed to load applications:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedCompetitionId,
        searchKeyword,
        filterStatus,
        application,
        applicationList,
        setSelectedCompetitionId,
        setSearchKeyword,
        setFilterStatus,
        setApplication,
        updateApplication,
        addApplication,
        loadApplications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
