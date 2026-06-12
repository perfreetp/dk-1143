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
  id: string;
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
  createdAt?: string;
  updatedAt?: string;
}

interface AppState {
  selectedCompetitionId: string | null;
  searchKeyword: string;
  filterStatus: string;
  application: ProjectApplication | null;
  applicationList: ProjectApplication[];
  drafts: ProjectApplication[];
}

interface AppContextType extends AppState {
  setSelectedCompetitionId: (id: string | null) => void;
  setSearchKeyword: (keyword: string) => void;
  setFilterStatus: (status: string) => void;
  setApplication: (app: ProjectApplication | null) => void;
  updateApplication: (updates: Partial<ProjectApplication>) => void;
  saveDraft: () => void;
  loadDraft: (competitionId: string) => ProjectApplication | null;
  submitApplication: () => void;
  loadApplications: () => void;
  deleteDraft: (competitionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [application, setApplication] = useState<ProjectApplication | null>(null);
  const [applicationList, setApplicationList] = useState<ProjectApplication[]>([]);
  const [drafts, setDrafts] = useState<ProjectApplication[]>([]);

  const updateApplication = (updates: Partial<ProjectApplication>) => {
    setApplication(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
  };

  const saveDraft = () => {
    if (!application) return;
    
    const draftData: ProjectApplication = {
      ...application,
      status: 'draft',
      updatedAt: new Date().toISOString(),
      createdAt: application.createdAt || new Date().toISOString()
    };

    const existingDraftIndex = drafts.findIndex(d => d.competitionId === application.competitionId);
    let updatedDrafts: ProjectApplication[];

    if (existingDraftIndex >= 0) {
      updatedDrafts = [...drafts];
      updatedDrafts[existingDraftIndex] = draftData;
    } else {
      updatedDrafts = [...drafts, draftData];
    }

    setDrafts(updatedDrafts);
    Taro.setStorageSync('applicationDrafts', JSON.stringify(updatedDrafts));
    
    console.log('[AppContext] Draft saved:', draftData.competitionName);
  };

  const loadDraft = (competitionId: string): ProjectApplication | null => {
    const draft = drafts.find(d => d.competitionId === competitionId);
    if (draft) {
      setApplication(draft);
      console.log('[AppContext] Draft loaded:', draft.competitionName);
      return draft;
    }
    return null;
  };

  const loadApplications = () => {
    try {
      const stored = Taro.getStorageSync('applicationList');
      if (stored) {
        const apps = JSON.parse(stored);
        setApplicationList(apps);
        console.log('[AppContext] Applications loaded:', apps.length);
      }

      const storedDrafts = Taro.getStorageSync('applicationDrafts');
      if (storedDrafts) {
        const draftList = JSON.parse(storedDrafts);
        setDrafts(draftList);
        console.log('[AppContext] Drafts loaded:', draftList.length);
      }
    } catch (error) {
      console.error('[AppContext] Failed to load data:', error);
    }
  };

  const submitApplication = () => {
    if (!application) return;

    const submittedApp: ProjectApplication = {
      ...application,
      id: application.id || Date.now().toString(),
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    const existingIndex = applicationList.findIndex(app => app.id === submittedApp.id);
    let updatedList: ProjectApplication[];

    if (existingIndex >= 0) {
      updatedList = [...applicationList];
      updatedList[existingIndex] = submittedApp;
    } else {
      updatedList = [...applicationList, submittedApp];
    }

    setApplicationList(updatedList);
    setApplication(submittedApp);
    Taro.setStorageSync('applicationList', JSON.stringify(updatedList));

    const updatedDrafts = drafts.filter(d => d.competitionId !== application.competitionId);
    setDrafts(updatedDrafts);
    Taro.setStorageSync('applicationDrafts', JSON.stringify(updatedDrafts));

    console.log('[AppContext] Application submitted:', submittedApp.competitionName);
  };

  const deleteDraft = (competitionId: string) => {
    const updatedDrafts = drafts.filter(d => d.competitionId !== competitionId);
    setDrafts(updatedDrafts);
    Taro.setStorageSync('applicationDrafts', JSON.stringify(updatedDrafts));
  };

  return (
    <AppContext.Provider
      value={{
        selectedCompetitionId,
        searchKeyword,
        filterStatus,
        application,
        applicationList,
        drafts,
        setSelectedCompetitionId,
        setSearchKeyword,
        setFilterStatus,
        setApplication,
        updateApplication,
        saveDraft,
        loadDraft,
        submitApplication,
        loadApplications,
        deleteDraft
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
