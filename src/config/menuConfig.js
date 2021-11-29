const menuList = [
  {
    title: '首页', // 菜单标题名称
    key: '/home', // 对应的 path
    icon: 'home', // 图标名称
    isPublic: true, //公开的页面
    },
    {
    title: '药品',
    key: '/products',
    icon: 'appstore',
    children: [ // 子菜单列表
    {
    title: '品类管理',
    key: '/category',
    icon: 'bars'
    },
    {
    title: '药品管理',
    key: '/product',
    icon: 'tool'
    },
    ]
    },
    {
    title: '用户管理',
    key: '/user',
    icon: 'user'
    },
    {
    title: '角色管理',
    key: '/role',
    icon: 'safety',
    },
    {
      title: '疫情监控',
      key: '/charts',
      icon: 'area-chart',
      children: [
      {
      title: '国内疫情图',
      key: '/charts/bar',
      icon: 'bar-chart'
      },
      {
      title: '国外疫情图',
      key: '/charts/line',
      icon: 'line-chart'
      },
      {
      title: '地区疫情图',
      key: '/charts/pie',
      icon: 'pie-chart'
      },
      ]
      },
]
export default menuList