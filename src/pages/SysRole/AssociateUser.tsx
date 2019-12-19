import React, { useEffect, useState } from 'react';
import { Button, Col, Dropdown, Form, Icon, Menu, message, Modal, Popconfirm, Row } from 'antd';
import HehTable from '@/components/HehTable';
import { deleteNullValue, formatDateTimeStamp, mergeLoading } from '@/utils/utils';
import SearchForm from '@/components/HehSearch';

import {
  pageToRoleApi,
} from '@/models/SysUserModel';

import {
  deleteByUserIdListApi,
} from '@/models/RelRoleUserModel';
import { connect } from 'dva';


const AssociateUser = (props: any) => {
  const { visible, onCancel } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  useEffect(() => {
    if (visible === true) {
      pageApiDispatch();
    }
  }, [visible]);


  const renderTable = () => {
    const columns = [
      { title: '用户名', dataIndex: 'username', align: 'center' },
      { title: '用户邮箱', dataIndex: 'userEmail', align: 'center' },
      {
        title: '操作', width: 280, dataIndex: 'operation', align: 'center', hehRender: (text: any, record: any) => (
          <span>
            <Popconfirm
              title="确认解绑该条数据?"
              okText="确定"
              okType='danger'
              onConfirm={() => unbindApiDispatch([record.id])}
              cancelText="取消"
            >
              <a><Icon type="delete"/>解绑</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    const {
      pageValue,
      pageLoading,
    } = props;
    return (
      <>
        <Row style={{ marginBottom: 5 }}>
          <Col span={24}>
            <Dropdown
              disabled={selectedRowKeys.length === 0}
              overlay={(
                <Menu>
                  <Menu.Item>
                    <Popconfirm
                      title="确定执行批量解绑操作?"
                      onConfirm={() => unbindApiDispatch(selectedRowKeys)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button>
                        <Icon type='delete'/> 批量解绑
                      </Button>
                    </Popconfirm>
                  </Menu.Item>
                </Menu>
              )}
              placement="bottomCenter"
            >
              <Button>
                批量操作 <Icon type='down'/>
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <HehTable
          columns={columns}
          getSelectedRowKeys={(selectedRowKeys: any) => setSelectedRowKeys(selectedRowKeys)}
          selectedRowKeys={selectedRowKeys}
          data={pageValue && pageValue.data || []}
          tableOptions={{
            loading: mergeLoading(
              pageLoading,
            ),
            bordered: true,
            size: 'middle',
          }}
          pageChange={(pageNum, pageSize) => {
            pageApiDispatch(pageNum, pageSize);
          }}
        />
      </>
    );
  };

  const renderSearchForm = () => {
    const getSearchValue = (values: any) => {
      if (values.createDate && values.createDate.length === 2) {
        values.createDateStartDate = formatDateTimeStamp(values.createDate[0], 'start');
        values.createDateEndDate = formatDateTimeStamp(values.createDate[1], 'end');
        delete values.createDate;
      }
      if (values.updateDate && values.updateDate.length === 2) {
        values.updateDateStartDate = formatDateTimeStamp(values.updateDate[0], 'start');
        values.updateDateEndDate = formatDateTimeStamp(values.updateDate[1], 'end');
        delete values.updateDate;
      }
      values = deleteNullValue(values);
      pageApiDispatch(1, 10, values);
    };

    const searchItems = [
      {
        type: 'input',
        label: '用户名',
        id: 'username',
        attribute: {
          placeholder: '请输入用户名',
        },
      },
      {
        type: 'rangePicker',
        label: '创建时间',
        id: 'createDate',
        attribute: {
          allowClear: true,
        },
      },
    ];
    return (
      <SearchForm
        searchItems={searchItems}
        getValue={getSearchValue}
      />
    );
  };

  //=====================================函数式组件 end==================================

  //=====================================组件工具方法 start==================================
  //=====================================组件工具方法 end==================================

  //=====================================带请求方法 start=====================================

  const pageApiDispatch = (pageNum = 1, pageSize = 10, values = {}) => {
    props.dispatch({
      type: pageToRoleApi,
      payload: {
        pageNum: pageNum,
        pageSize: pageSize,
        roleId: props.roleId,
        ...values,
      },
    });
  };

  const unbindApiDispatch = (ids: any) => {
    props.dispatch({
      type: deleteByUserIdListApi,
      payload: {
        userIdList: ids,
      },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        pageApiDispatch();
      }
    });
  };

  return (
    <Modal
      afterClose={() => {
        setSelectedRowKeys([]);
      }}
      width={1024}
      title='关联用户'
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      {renderSearchForm()}
      {renderTable()}
    </Modal>
  );


};

export default connect(({ SysUserModel, loading }: any) => ({
  pageValue: SysUserModel.pageValue,
  pageLoading: loading.effects[pageToRoleApi],
}))(Form.create<any>()(AssociateUser));
