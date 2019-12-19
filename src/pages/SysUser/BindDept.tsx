import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, message, Modal } from 'antd';
import HehTree from '@/components/HehTree';

import {
  treeListApi,
} from '@/models/SysUserModel';
import {
  listApi,
  batchCreateApi,
} from '@/models/RelDeptUserModel';

const BindPermission = (props: any) => {
  const { visible, onCancel, treeListValue, userId } = props;
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
      type: listApi,
      payload: {
        userId,
      },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        const checked: any[] = [];
        res.data.forEach((item: any) => {
          checked.push(item.deptId);
        });
        // @ts-ignore
        setCheckedKeys(checked);
      }
    });
  }, [userId]);

  const onOk = () => {
    props.dispatch({
      type: batchCreateApi,
      payload: {
        userIdList: [userId],
        deptIdList: checkedKeys,
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
        field={{ title: 'deptName', id: 'id' }}
      />
    </Modal>
  );
};

export default connect(({ SysUserModel }: any) => ({
  treeListValue: SysUserModel.treeListValue,
}))(Form.create<any>()(BindPermission));
