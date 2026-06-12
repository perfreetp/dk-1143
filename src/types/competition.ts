// 赛事相关类型定义

export interface Competition {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  status: 'ongoing' | 'upcoming' | 'ended';
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  prizePool: string;
  participantCount: number;
  description: string;
  requirements: string[];
  awards: Award[];
  process: ProcessStep[];
}

export interface Award {
  rank: string;
  name: string;
  prize: string;
  count: number;
}

export interface ProcessStep {
  step: number;
  title: string;
  time: string;
  description: string;
}

export interface CompetitionCardProps {
  competition: Competition;
  onClick?: () => void;
}

export interface SearchFilters {
  keyword: string;
  status: string;
  category: string;
}
