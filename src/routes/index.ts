export default {
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    // { path: '/login', component: '@/pages/login/index' },
    { path: '/403', component: '@/pages/exception/e403/index' },
    { path: '/404', component: '@/pages/exception/e404/index' },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          path: '/home',
          component: '@/pages/home',
        },
      ],
    },
  ],
};
