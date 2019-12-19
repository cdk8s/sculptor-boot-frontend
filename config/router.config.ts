import { IRoute } from 'umi-types';

const routes: IRoute[] = [
    {
        path: '/codeCallback',
        component: '../layouts/CodeToTokenLayout.tsx',
    },
    {
        path: '/errorPage',
        component: '../layouts/ErrorPage.tsx',
    },
    {
        path: '/',
        component: '../layouts/MainLayout.tsx',
        routes: [
            // 必须配置项:页面路由(不能修改该注释)
            { path: '/sysPermission', component: './SysPermission/index.tsx' },
            { path: '/sysParam', component: './SysParam/index.tsx' },
            { path: '/sysEmployee', component: './SysEmployee/index.tsx' },
            { path: '/sysLoginLog', component: './SysLoginLog/index.tsx' },
            { path: '/sysEventLog', component: './SysEventLog/index.tsx' },
            { path: '/sysUser', component: './SysUser/index.tsx' },
            { path: '/sysRole', component: './SysRole/index.tsx' },
            { path: '/sysDict', component: './SysDict/index.tsx' },
            { path: '/sysDept', component: './SysDept/index.tsx' },
            { path: '/', redirect: '/index' },
            { path: '/403', component: '../components/Exception/403.tsx' },
            { path: '/404', component: '../components/Exception/404.tsx' },
            { path: '/500', component: '../components/Exception/500.tsx' },
            { path: '/iframe', component: './Iframe' },
            { path: '/index', component: './Index/index.tsx' },
        ],
    },
];

export default routes;
