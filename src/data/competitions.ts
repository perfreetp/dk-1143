import { Competition } from '@/types/competition';

export const mockCompetitions: Competition[] = [
  {
    id: '1',
    title: '2024校园创新创业大赛',
    subtitle: '点燃创业梦想，展现创新风采',
    coverImage: 'https://picsum.photos/id/1/750/400',
    status: 'ongoing',
    startTime: '2024-03-01',
    endTime: '2024-05-30',
    registrationDeadline: '2024-03-20',
    prizePool: '50万元',
    participantCount: 328,
    description: '面向全校学生的创新创业大赛，鼓励学生团队将创新理念转化为实际项目。',
    requirements: [
      '全日制在校本科生、研究生',
      '团队成员3-8人',
      '项目具有创新性和可行性',
      '未获得过国家级创业大赛奖项'
    ],
    awards: [
      { rank: '一等奖', name: '冠军奖', prize: '10万元', count: 1 },
      { rank: '二等奖', name: '卓越奖', prize: '5万元', count: 2 },
      { rank: '三等奖', name: '优秀奖', prize: '2万元', count: 5 },
      { rank: '单项奖', name: '最佳创意奖', prize: '1万元', count: 3 }
    ],
    process: [
      { step: 1, title: '报名阶段', time: '3月1日-3月20日', description: '团队注册与资料提交' },
      { step: 2, title: '初审阶段', time: '3月21日-3月31日', description: '材料评审与筛选' },
      { step: 3, title: '复赛阶段', time: '4月1日-4月20日', description: '项目路演与答辩' },
      { step: 4, title: '决赛阶段', time: '5月1日-5月15日', description: '终极PK与颁奖' }
    ]
  },
  {
    id: '2',
    title: '第五届"互联网+"创业挑战赛',
    subtitle: '互联网+时代的创业机遇',
    coverImage: 'https://picsum.photos/id/119/750/400',
    status: 'upcoming',
    startTime: '2024-04-15',
    endTime: '2024-06-30',
    registrationDeadline: '2024-04-30',
    prizePool: '30万元',
    participantCount: 156,
    description: '聚焦互联网+领域的创新创业项目，推动传统产业数字化转型。',
    requirements: [
      '互联网+相关领域项目',
      '团队成员2-6人',
      '项目已形成产品原型',
      '有明确的商业模式'
    ],
    awards: [
      { rank: '金奖', name: '金奖', prize: '8万元', count: 1 },
      { rank: '银奖', name: '银奖', prize: '4万元', count: 3 },
      { rank: '铜奖', name: '铜奖', prize: '2万元', count: 6 }
    ],
    process: [
      { step: 1, title: '报名阶段', time: '4月15日-4月30日', description: '在线报名与材料提交' },
      { step: 2, title: '初赛阶段', time: '5月1日-5月15日', description: '项目计划书评审' },
      { step: 3, title: '决赛阶段', time: '6月1日-6月15日', description: '现场路演与答辩' }
    ]
  },
  {
    id: '3',
    title: '校园科技创业孵化项目',
    subtitle: '科技创新，从校园开始',
    coverImage: 'https://picsum.photos/id/160/750/400',
    status: 'ongoing',
    startTime: '2024-02-01',
    endTime: '2024-12-31',
    registrationDeadline: '2024-06-30',
    prizePool: '100万元孵化基金',
    participantCount: 89,
    description: '为科技创新项目提供孵化支持，包括资金、场地、导师等全方位资源。',
    requirements: [
      '科技类创新项目',
      '团队成员不限',
      '项目具有技术壁垒',
      '愿意接受孵化服务'
    ],
    awards: [
      { rank: '重点孵化', name: 'A级孵化', prize: '20万元', count: 2 },
      { rank: '一般孵化', name: 'B级孵化', prize: '10万元', count: 5 },
      { rank: '扶持项目', name: 'C级孵化', prize: '5万元', count: 10 }
    ],
    process: [
      { step: 1, title: '申请阶段', time: '全年受理', description: '在线申请与材料提交' },
      { step: 2, title: '评审阶段', time: '材料提交后30天', description: '项目评审与尽职调查' },
      { step: 3, title: '孵化阶段', time: '6-12个月', description: '项目孵化与跟踪服务' }
    ]
  },
  {
    id: '4',
    title: '2023年创新创业大赛（往届回顾）',
    subtitle: '回顾精彩，激发灵感',
    coverImage: 'https://picsum.photos/id/3/750/400',
    status: 'ended',
    startTime: '2023-03-01',
    endTime: '2023-06-30',
    registrationDeadline: '2023-03-15',
    prizePool: '40万元',
    participantCount: 412,
    description: '2023年度创新创业大赛精彩回顾，展示优秀项目成果。',
    requirements: [
      '往届赛事记录'
    ],
    awards: [
      { rank: '冠军', name: '特等奖', prize: '8万元', count: 1 },
      { rank: '亚军', name: '一等奖', prize: '5万元', count: 2 },
      { rank: '季军', name: '二等奖', prize: '3万元', count: 3 }
    ],
    process: []
  },
  {
    id: '5',
    title: '校园公益创业大赛',
    subtitle: '用商业手段解决社会问题',
    coverImage: 'https://picsum.photos/id/250/750/400',
    status: 'upcoming',
    startTime: '2024-05-01',
    endTime: '2024-07-31',
    registrationDeadline: '2024-05-15',
    prizePool: '20万元',
    participantCount: 0,
    description: '鼓励学生关注社会问题，用创新商业模式推动公益事业发展。',
    requirements: [
      '公益类创业项目',
      '团队成员2-10人',
      '项目具有社会影响力',
      '商业模式可持续'
    ],
    awards: [
      { rank: '最佳公益奖', name: '金奖', prize: '5万元', count: 1 },
      { rank: '优秀项目奖', name: '银奖', prize: '3万元', count: 3 },
      { rank: '潜力项目奖', name: '铜奖', prize: '1万元', count: 5 }
    ],
    process: [
      { step: 1, title: '报名阶段', time: '5月1日-5月15日', description: '项目申报' },
      { step: 2, title: '初审阶段', time: '5月16日-5月31日', description: '材料评审' },
      { step: 3, title: '决赛阶段', time: '6月中旬', description: '路演答辩' }
    ]
  }
];
