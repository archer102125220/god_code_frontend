const itemIcon = 'double-right';

export default [
  {
    link: '/',
    icon: 'home',
    title: '首頁',
  },
  {
    icon: 'user',
    title: '用戶管理',
    menu: [
      {
        link: '/user',
        icon: itemIcon,
      },
      {
        link: '/role',
        icon: itemIcon,
        title: '角色權限',
      },
    ],
  },
  {
    icon: 'picture',
    title: '活動管理',
    menu: [
      {
        link: '/eventAlbum',
        icon: itemIcon,
        title: '活動集錦',
      },
      {
        link: '/eventType',
        icon: itemIcon,
        title: '活動類型',
      },
    ],
  },  
  {
    icon: 'setting',
    title: '系統管理',
    menu: [
      {
        link: '/system/config',
        icon: itemIcon,
        title: '系統配置',
      },
      {
        link: '/system/log',
        icon: itemIcon,
        title: '日誌',
      },
    ],
  },
];
