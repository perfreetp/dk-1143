export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/home/detail',
    'pages/apply/index',
    'pages/workspace/index',
    'pages/review/index',
    'pages/notify/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#5B86E5',
    navigationBarTitleText: '校园创业圈',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909C',
    selectedColor: '#5B86E5',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '赛事首页'
      },
      {
        pagePath: 'pages/apply/index',
        text: '报名表'
      },
      {
        pagePath: 'pages/workspace/index',
        text: '工作台'
      },
      {
        pagePath: 'pages/review/index',
        text: '评审反馈'
      },
      {
        pagePath: 'pages/notify/index',
        text: '通知'
      }
    ]
  }
})
