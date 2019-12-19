import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, message, Modal } from 'antd';
import HehTree from '@/components/HehTree';

import {
  treeListApi,
  relPermissionRoleListApi,
  relPermissionRoleBatchCreateApi,
} from '@/models/SysPermissionModel';

const BindPermission = (props: any) => {
  const { visible, onCancel, treeListValue, roleId } = props;
  const [checkedKeys, setCheckedKeys] = useState([]);

  useEffect(() => {
    props.dispatch({
      type: treeListApi,
      payload: {
        parentId: 1,
      },
    });

  }, []);

  useEffect(() => {
    props.dispatch({
      type: relPermissionRoleListApi,
      payload: {
        roleId,
      },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        const checked: any[] = [];
        res.data.forEach((item: any) => {
          checked.push(item.permissionId);
        });
        // @ts-ignore
        setCheckedKeys(checked);
      }
    });
  }, [roleId]);

  const onOk = () => {
    props.dispatch({
      type: relPermissionRoleBatchCreateApi,
      payload: {
        roleIdList: [roleId],
        permissionIdList: checkedKeys,
      },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success('分配权限成功');
      }
    });
  };

  return (
    <Modal
      title='绑定权限'
      visible={visible}
      centered={true}
      onCancel={onCancel}
      onOk={onOk}
    >
      <HehTree
        showSearch={true}
        showOperation={true}
        scrollHeight={1080}
        selectable={false}
        propsCheckStrictlyBtn={false}
        propsCheckStrictly={false}
        checkable={true}
        allExpand={true}
        data={treeListValue}
        setCheckedPropsKeys={checkedKeys}
        getCheckedKeys={(keys: any) => setCheckedKeys(keys)}
        field={{ title: 'permissionName', id: 'id' }}
      />
    </Modal>
  );
};

export default connect(({ SysPermissionModel }: any) => ({
  treeListValue: SysPermissionModel.treeListValue,
}))(Form.create<any>()(BindPermission));
