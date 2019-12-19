export const user = [
    { name: '客户端列表', path: '/TKeyClient', icon: 'unordered-list' },
    {
        name: '测试', path: '/TKeyClientParent', icon: 'unordered-list', children: [
            {
                name: '测试子', path: '/TKeyClientChild', icon: 'unordered-list', children: [
                    { name: '测试子子', path: '/TKeyClientChildChild', icon: 'unordered-list' },
                ],
            },
            {
                name: '需要登录才能测试', path: '/loginTest', icon: 'unordered-list', children: [
                    { name: '用户管理', path: '/loginTest/userManagement', icon: 'unordered-list' },
                    { name: '登录日志管理', path: '/loginTest/logManagement', icon: 'unordered-list' },
                ],
            },
        ],
    },
];

export const sysytem = [
    { name: '客户端列表', path: '/TKeyClient', icon: 'unordered-list' },
];
