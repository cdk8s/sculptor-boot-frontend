import config from '../../config/admin.config';

const apiServer = !config.isMock ? process.env.API_SERVER : process.env.MOCK_SERVER;
const api = {
  // 如果有侧边栏需要获取后台数据时的 url
  getSiderBarMenu: config.siderBarMenuUrl,
  getSiderBarModule: config.siderBarModuleUrl,

  getAllEnumApi: `${apiServer}/api/sysCommon/open/enumList`,
  getUserInfoApi: `${apiServer}/api/sysUser/userinfo`,
  codeToToken: `${process.env.API_SERVER}/codeCallback`,

  // 必须配置项:api地址(不能修改该注释)
  sysPermissionPageApiUrl: `${apiServer}/api/sysPermission/page`,
  sysPermissionTreeListApiUrl: `${apiServer}/api/sysPermission/listTreeByParentId`,
  sysPermissionDetailApiUrl: `${apiServer}/api/sysPermission/detail`,
  sysPermissionCreateApiUrl: `${apiServer}/api/sysPermission/create`,
  sysPermissionUpdateApiUrl: `${apiServer}/api/sysPermission/update`,
  sysPermissionDeleteApiUrl: `${apiServer}/api/sysPermission/batchDelete`,
  sysPermissionCacheEvictApiUrl: `${apiServer}/api/sysPermission/cacheEvict`,
  sysPermissionUpdateStateApiUrl: `${apiServer}/api/sysPermission/batchUpdateState`,

  sysParamTypePageApiUrl: `${apiServer}/api/sysParamType/page`,
  sysParamTypeDetailApiUrl: `${apiServer}/api/sysParamType/detail`,
  sysParamTypeCreateApiUrl: `${apiServer}/api/sysParamType/create`,
  sysParamTypeUpdateApiUrl: `${apiServer}/api/sysParamType/update`,
  sysParamTypeDeleteApiUrl: `${apiServer}/api/sysParamType/batchDelete`,
  sysParamTypeCacheEvictApiUrl: `${apiServer}/api/sysParamType/cacheEvict`,
  sysParamTypeUpdateStateApiUrl: `${apiServer}/api/sysParamType/batchUpdateState`,

  sysParamPageApiUrl: `${apiServer}/api/sysParam/page`,
  sysParamDetailApiUrl: `${apiServer}/api/sysParam/detail`,
  sysParamCreateApiUrl: `${apiServer}/api/sysParam/create`,
  sysParamUpdateApiUrl: `${apiServer}/api/sysParam/update`,
  sysParamDeleteApiUrl: `${apiServer}/api/sysParam/batchDelete`,
  sysParamCacheEvictApiUrl: `${apiServer}/api/sysParam/cacheEvict`,
  sysParamUpdateStateApiUrl: `${apiServer}/api/sysParam/batchUpdateState`,

  sysEmployeePageToUserApiUrl: `${apiServer}/api/sysEmployee/pageToUser`,
  sysEmployeeDetailApiUrl: `${apiServer}/api/sysEmployee/detail`,
  sysEmployeeCreateApiUrl: `${apiServer}/api/sysEmployee/create`,
  sysEmployeeUpdateApiUrl: `${apiServer}/api/sysEmployee/update`,
  sysEmployeeDeleteApiUrl: `${apiServer}/api/sysEmployee/batchDelete`,
  sysEmployeeCacheEvictApiUrl: `${apiServer}/api/sysEmployee/cacheEvict`,

  sysLoginLogPageApiUrl: `${apiServer}/api/sysLoginLog/page`,
  sysLoginLogDetailApiUrl: `${apiServer}/api/sysLoginLog/detail`,
  sysLoginLogCreateApiUrl: `${apiServer}/api/sysLoginLog/create`,
  sysLoginLogUpdateApiUrl: `${apiServer}/api/sysLoginLog/update`,
  sysLoginLogDeleteApiUrl: `${apiServer}/api/sysLoginLog/batchDelete`,
  sysLoginLogCacheEvictApiUrl: `${apiServer}/api/sysLoginLog/cacheEvict`,

  sysEventLogPageApiUrl: `${apiServer}/api/sysEventLog/page`,
  sysEventLogDetailApiUrl: `${apiServer}/api/sysEventLog/detail`,
  sysEventLogCreateApiUrl: `${apiServer}/api/sysEventLog/create`,
  sysEventLogUpdateApiUrl: `${apiServer}/api/sysEventLog/update`,
  sysEventLogDeleteApiUrl: `${apiServer}/api/sysEventLog/batchDelete`,
  sysEventLogCacheEvictApiUrl: `${apiServer}/api/sysEventLog/cacheEvict`,

  sysUserPageToDeptApiUrl: `${apiServer}/api/sysUser/pageToDept`,
  sysUserPageToRoleApiUrl: `${apiServer}/api/sysUser/pageToRole`,
  sysUserDetailApiUrl: `${apiServer}/api/sysUser/detail`,
  sysUserCreateApiUrl: `${apiServer}/api/sysUser/create`,
  sysUserUpdateApiUrl: `${apiServer}/api/sysUser/update`,
  sysUserDeleteApiUrl: `${apiServer}/api/sysUser/batchDelete`,
  sysUserResetPasswordApiUrl: `${apiServer}/api/sysUser/resetPassword`,
  sysUserCacheEvictApiUrl: `${apiServer}/api/sysUser/cacheEvict`,
  sysUserUpdateStateApiUrl: `${apiServer}/api/sysUser/batchUpdateState`,

  sysRolePageApiUrl: `${apiServer}/api/sysRole/page`,
  sysRoleDetailApiUrl: `${apiServer}/api/sysRole/detail`,
  sysRoleCreateApiUrl: `${apiServer}/api/sysRole/create`,
  sysRoleUpdateApiUrl: `${apiServer}/api/sysRole/update`,
  sysRoleDeleteApiUrl: `${apiServer}/api/sysRole/batchDelete`,
  sysRoleCacheEvictApiUrl: `${apiServer}/api/sysRole/cacheEvict`,
  sysRoleUpdateStateApiUrl: `${apiServer}/api/sysRole/batchUpdateState`,

  relRoleUserDeleteByUserIdListApiUrl: `${apiServer}/api/relRoleUser/batchDeleteByUserIdList`,
  relRoleUserDeleteBatchCreateApiUrl: `${apiServer}/api//relRoleUser/batchCreate`,

  relDeptUserListApiUrl: `${apiServer}/api/relDeptUser/list`,
  relDeptUserBatchCreateApiUrl: `${apiServer}/api/relDeptUser/batchCreate`,
  relPermissionRoleListApiUrl: `${apiServer}/api/relPermissionRole/list`,
  relPermissionRoleBatchCreateApiUrl: `${apiServer}/api/relPermissionRole/batchCreate`,

  sysDeptPageApiUrl: `${apiServer}/api/sysDept/page`,
  sysDeptTreeListApiUrl: `${apiServer}/api/sysDept/listTreeByParentId`,
  sysDeptDetailApiUrl: `${apiServer}/api/sysDept/detail`,
  sysDeptCreateApiUrl: `${apiServer}/api/sysDept/create`,
  sysDeptUpdateApiUrl: `${apiServer}/api/sysDept/update`,
  sysDeptDeleteApiUrl: `${apiServer}/api/sysDept/batchDelete`,
  sysDeptCacheEvictApiUrl: `${apiServer}/api/sysDept/cacheEvict`,

  sysDictItemPageApiUrl: `${apiServer}/api/sysDictItem/page`,
  sysDictItemDetailApiUrl: `${apiServer}/api/sysDictItem/detail`,
  sysDictItemCreateApiUrl: `${apiServer}/api/sysDictItem/create`,
  sysDictItemUpdateApiUrl: `${apiServer}/api/sysDictItem/update`,
  sysDictItemDeleteApiUrl: `${apiServer}/api/sysDictItem/batchDelete`,
  sysDictItemCacheEvictApiUrl: `${apiServer}/api/sysDictItem/cacheEvict`,
  sysDictItemUpdateStateApiUrl: `${apiServer}/api/sysDictItem/batchUpdateState`,

  sysDictPageApiUrl: `${apiServer}/api/sysDict/page`,
  sysDictDetailApiUrl: `${apiServer}/api/sysDict/detail`,
  sysDictCreateApiUrl: `${apiServer}/api/sysDict/create`,
  sysDictUpdateApiUrl: `${apiServer}/api/sysDict/update`,
  sysDictDeleteApiUrl: `${apiServer}/api/sysDict/batchDelete`,
  sysDictCacheEvictApiUrl: `${apiServer}/api/sysDict/cacheEvict`,
  sysDictUpdateStateApiUrl: `${apiServer}/api/sysDict/batchUpdateState`,

};
export default api;
