import React, { Component } from 'react';
import {
  Card,
  Row,
  Col,
  Divider,
  Modal,
  Popconfirm,
  Form,
  Button,
  message,
  Spin,
  Switch,
  Dropdown,
  Menu,
  Icon,
} from 'antd';
import { connect } from 'dva';
import get from 'lodash/get';
import { FormComponentProps } from 'antd/lib/form/Form';
import SearchForm from '@/components/HehSearch';
import HehTable from '@/components/HehTable';
import HehForm from '@/components/HehForm';
import AssociateUser from './AssociateRole';
import { handleDate } from '@/utils/columnsHandle';
import HehTree from '@/components/HehTree';
import BindDept from './BindDept'
import { formatDateTimeStamp } from '@/utils/utils';
import { deleteNullValue, mergeLoading, getEnumValueList } from '@/utils/utils';

import {
  createApi,
  pageToDeptApi,
  updateApi,
  detailApi,
  deleteApi,
  resetPasswordApi,
  cacheEvictApi,
  detailApiReducer,
  updateStateApi,
  treeListApi,
} from '@/models/SysUserModel';

class Index extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      treeListValue: [],
      selectedRowKeys: [],
      searchValue: {},
    };
  }

  //=====================================生命周期 start=====================================

  componentDidMount() {
    this.treeListApiDispatch();
    this.pageApiDispatch();
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <Row gutter={20}>
          <Col span={6}>
            <Card style={{ minHeight: 500 }}>
              <HehTree
                showSearch={true}
                showOperation={true}
                scrollHeight={1080}
                checkable={false}
                allExpand={true}
                data={this.props.treeListValue}
                field={{ title: 'deptName', id: 'id' }}
                getSelectKeys={this.treeSelectEvent}
              />
            </Card>
          </Col>
          <Col span={18}>
            <Card style={{ minHeight: 500 }}>
              {this.renderDetailModal()}
              {this.renderSearchForm()}
              {this.renderTable()}
            </Card>
          </Col>
        </Row>
        <AssociateUser
          visible={this.state.assignUserVisible}
          onCancel={() => this.setState({ assignUserVisible: false })}
          userIds={this.state.selectedRowKeys}
        />
        <BindDept
          visible={this.state.bindDeptVisible}
          onCancel={() => this.setState({ bindDeptVisible: false })}
          userId={this.state.userId}
        />
      </div>
    );
  }

  //=====================================生命周期  end=====================================

  //=====================================函数式组件 start==================================

  renderTable = () => {
    const columns = [
      { title: '用户账号', dataIndex: 'username', align: 'center' },
      { title: '真实姓名', dataIndex: 'realName', align: 'center' },
      { title: '邮箱地址', dataIndex: 'userEmail', align: 'center' },
      { title: '固话', dataIndex: 'telephone', align: 'center' },
      { title: '手机号', dataIndex: 'mobilePhone', align: 'center' },
      {
        title: '状态', dataIndex: 'stateEnum', align: 'center', width: 90, hehRender: (text: string | number, record: any) => (
          <Popconfirm
            title="确认改变状态?"
            onConfirm={() => this.updateStateApiDispatch([record.id], text === 1 ? 2 : 1)}
            okText="确认"
            cancelText="取消"
          >
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              checked={text === 1}
            />
          </Popconfirm>
        ),
      },
      { title: '创建人', dataIndex: 'createUsername', align: 'center', width: 100 },
      { title: '创建时间', dataIndex: 'createDate', align: 'center', width: 170, hehRender: (text: number) => handleDate(text) },
      { title: '更新人', dataIndex: 'updateUsername', align: 'center', width: 100 },
      { title: '更新时间', dataIndex: 'updateDate', align: 'center', width: 170, hehRender: (text: number) => handleDate(text) },
      {
        title: '操作', width: 280, dataIndex: 'operation', align: 'center', hehRender: (text: any, record: any) => (
          <span>
            <a onClick={() => this.detailApiDispatch(record)}><Icon type='edit'/>编辑</a>
            <Divider type='vertical'/>
            <a onClick={() => this.detailApiDispatch(record, true)}><Icon type='search'/>详情</a>
            <Divider type='vertical'/>
            <a onClick={() => this.bindDept(record.id)}><Icon type='filter'/>分配部门</a>
            <Divider type='vertical'/>
            <Popconfirm
              title="确认删除该条数据?"
              okText="确定"
              okType='danger'
              onConfirm={() => this.deleteApiDispatch([record.id])}
              cancelText="取消"
            >
              <a><Icon type="delete"/>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    const {
      pageValue,
      pageLoading,
      deleteLoading,
      updateStateLoading,
    } = this.props;
    return (
      <>
        <div style={{ marginBottom: 5 }}>
          <Popconfirm
            title="确认刷新缓存?"
            onConfirm={this.cacheEvictApiDispatch}
            okText="确认"
            cancelText="取消"
          >
            <Button type='primary' style={{ marginRight: 5 }}>
              <Icon type='reload'/>刷新缓存
            </Button>
          </Popconfirm>
          <Button
            onClick={() => this.setState({ detailModalVisible: true })}
            style={{ width: 100 }}
            type='primary'
          >
            <Icon type='plus'/>新建
          </Button>
          <Button
            disabled={this.state.selectedRowKeys.length === 0}
            onClick={() => this.setState({ assignUserVisible: true })}
            style={{ marginLeft: 5 }}
            type='primary'
          >
            <Icon type='filter'/>关联角色
          </Button>
          <Dropdown
            disabled={this.state.selectedRowKeys.length === 0}
            overlay={(
              <Menu>
                <Menu.Item>
                  <Popconfirm
                    title="确定执行批量删除操作?"
                    onConfirm={() => this.deleteApiDispatch(this.state.selectedRowKeys)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button>
                      <Icon type='delete'/> 批量删除
                    </Button>
                  </Popconfirm>
                </Menu.Item>
                <Menu.Item>
                  <Popconfirm
                    title="确定执行重置密码操作?"
                    onConfirm={() => this.resetPasswordApiDispatch(this.state.selectedRowKeys)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button>
                      <Icon type='rest'/> 重置密码
                    </Button>
                  </Popconfirm>
                </Menu.Item>
                <Menu.Item>
                  <Button
                    onClick={() => this.updateStateApiDispatch(this.state.selectedRowKeys, 1)}
                  >
                    <Icon type="check-circle"/> 批量启用
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button
                    onClick={() => this.updateStateApiDispatch(this.state.selectedRowKeys, 2)}
                  >
                    <Icon type="close-circle"/> 批量禁用
                  </Button>
                </Menu.Item>
              </Menu>
            )}
          >
            <Button style={{ marginLeft: 5 }}>
              批量操作 <Icon type='down'/>
            </Button>
          </Dropdown>
        </div>
        <HehTable
          columns={columns}
          getSelectedRowKeys={this.getSelectedRowKeysEvent}
          selectedRowKeys={this.state.selectedRowKeys}
          data={pageValue && pageValue.data || []}
          tableOptions={{
            loading: mergeLoading(
              pageLoading,
              deleteLoading,
              updateStateLoading,
            ),
            bordered: true,
            size: 'middle',
          }}
          pageChange={(pageNum, pageSize) => {
            this.pageApiDispatch(pageNum, pageSize);
          }}
        />
      </>
    );
  };

  // ===========================

  renderSearchForm = () => {
    const searchItems = [
      {
        type: 'input',
        label: '用户账号',
        id: 'username',
        attribute: {
          placeholder: '请输入用户账号',
        },
      },
      {
        type: 'input',
        label: '真实姓名',
        id: 'realName',
        attribute: {
          placeholder: '请输入真实姓名',
        },
      },
      {
        type: 'input',
        label: '手机号',
        id: 'mobilePhone',
        attribute: {
          placeholder: '请输入手机号',
        },
      },

      {
        type: 'select',
        label: '状态',
        id: 'stateEnum',
        options: getEnumValueList('stateEnum'),
        attribute: {
          allowClear: true,
          placeholder: '请选择',
        },
        optionAttribute: {
          key: 'value',
        },
      },
      {
        type: 'select',
        label: '注册方式',
        id: 'registerTypeEnum',
        options: getEnumValueList('registerTypeEnum'),
        attribute: {
          allowClear: true,
          placeholder: '请选择',
        },
        optionAttribute: {
          key: 'value',
        },
      },
      {
        type: 'select',
        label: '注册来源',
        id: 'registerOriginEnum',
        options: getEnumValueList('registerOriginEnum'),
        attribute: {
          allowClear: true,
          placeholder: '请选择',
        },
        optionAttribute: {
          key: 'value',
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

      {
        type: 'rangePicker',
        label: '更新时间',
        id: 'updateDate',
        attribute: {
          allowClear: true,
        },
      },
    ];
    return (
      <SearchForm
        searchItems={searchItems}
        getValue={this.getSearchFormValue}
      />
    );
  };

  // ===========================

  renderDetailModal = () => {
    const { detailValue, form, createLoading, updateLoading } = this.props;
    const newFormItem = [
      {
        type: 'input',
        id: 'username',
        label: '用户账号',
        defaultValue: get(detailValue, 'username'),
        attribute: {
          maxLength: 50,
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '用户账号为必填项' },
          ],
        },
      },
      !detailValue ? {
        type: 'input',
        id: 'userPassword',
        label: '登录密码',
        defaultValue: get(detailValue, 'userPassword'),
        attribute: {
          maxLength: 50,
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '登录密码为必填项' },
          ],
        },
      } : {},
      { type: 'input', id: 'realName', label: '真实姓名', defaultValue: get(detailValue, 'realName'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'userEmail', label: '邮箱地址', defaultValue: get(detailValue, 'userEmail'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'telephone', label: '固话', defaultValue: get(detailValue, 'telephone'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'mobilePhone', label: '手机号', defaultValue: get(detailValue, 'mobilePhone'), attribute: { disabled: this.state.detail } },
      {
        type: 'select',
        id: 'genderEnum',
        label: '性别',
        defaultValue: get(detailValue, 'genderEnum'),
        options: getEnumValueList('genderEnum'),
        attribute: {
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '性别为必填项' },
          ],
        },
      },
      {
        type: 'radio',
        id: 'stateEnum',
        label: '状态',
        options: getEnumValueList('stateEnum'),
        defaultValue: get(detailValue, 'stateEnum'),
        attribute: {
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '状态为必填项' },
          ],
        },
      },
    ];

    return (
      <Modal
        afterClose={() => {
          this.setState({ detail: false });
          this.clearDetailValueEvent();
        }}
        destroyOnClose={true}
        title={(() => {
          if (detailValue && this.state.detail) {
            return <span>详情</span>;
          }
          if (detailValue) {
            return <span>编辑</span>;
          }
          return <span>新建</span>;
        })()}
        visible={this.state.detailModalVisible}
        onOk={this.detailSubmitEvent}
        centered={true}
        width={1024}
        onCancel={() => this.setState({ detailModalVisible: false })}
        footer={!this.state.detail && (
          <div>
            <Button onClick={() => this.setState({ detailModalVisible: false })}>取消</Button>
            <Button loading={mergeLoading(createLoading, updateLoading)} type='primary' onClick={this.detailSubmitEvent}>确定</Button>
          </div>
        )}
      >
        <Spin spinning={this.props.detailLoading || false}>
          <HehForm
            rowCols={2}
            form={form}
            formItems={newFormItem}
          />
        </Spin>
      </Modal>
    );
  };

  //=====================================函数式组件 end==================================

  //=====================================组件工具方法 start==================================
  bindDept = (userId: any) => {
    this.setState({ bindDeptVisible: true, userId });
  };


  getSearchFormValue = (values: any) => {
    if (values.createDate && values.createDate.length === 2) {
      values.createDateStartDate = formatDateTimeStamp(values.createDate[0], 'start');
      values.createDateEndDate = formatDateTimeStamp(values.createDate[1], 'end');
    }
    delete values.createDate;
    if (values.updateDate && values.updateDate.length === 2) {
      values.updateDateStartDate = formatDateTimeStamp(values.updateDate[0], 'start');
      values.updateDateEndDate = formatDateTimeStamp(values.updateDate[1], 'end');
    }
    delete values.updateDate;
    if (values.updateDate === undefined && this.state.searchValue && this.state.searchValue.createDateEndDate !== undefined) {
      delete this.state.searchValue.createDateEndDate;
      delete this.state.searchValue.createDateStartDate;
    }
    if (!values.updateDate && this.state.searchValue && this.state.searchValue.updateDateStartDate) {
      delete this.state.searchValue.updateDateStartDate;
      delete this.state.searchValue.updateDateEndDate;
    }
    this.setState({ searchValue: { ...this.state.searchValue, ...values } });
    this.pageApiDispatch(1, 10, { ...this.state.searchValue, ...values });
  };

  getSelectedRowKeysEvent = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  };

  detailSubmitEvent = () => {
    this.props.form.validateFields((err: any, values: any) => {
      if (err) return;
      const { detailValue } = this.props;
      if (detailValue) {
        this.updateApiDispatch({ ...values, id: detailValue.id });
      } else {
        this.createApiDispatch(values);
      }
    });
  };

  clearDetailValueEvent = () => {
    this.props.dispatch({
      type: detailApiReducer,
      payload: undefined,
    });
  };

  //=====================================组件工具方法 end====================================

  //=====================================请求函数 start==================================

  pageApiDispatch = (pageNum = 1, pageSize = 10, values = this.state.searchValue) => {
    this.props.dispatch({
      type: pageToDeptApi,
      payload: deleteNullValue({
        pageNum,
        pageSize,
        ...values,
      }),
    });
  };

  createApiDispatch = (values: object) => {
    this.props.dispatch({
      type: createApi,
      payload: values,
    }).then((response: any) => {
      if (response && response.isSuccess) {
        message.success(response.msg);
        this.setState({ detailModalVisible: false });
        this.pageApiDispatch();
      }
    });
  };

  updateApiDispatch = (values: object) => {
    this.props.dispatch({
      type: updateApi,
      payload: values,
    })
      .then((response: any) => {
        if (response && response.isSuccess) {
          message.success(response.msg);
          this.setState({ detailModalVisible: false });
          this.pageApiDispatch();
        }
      });
  };

  detailApiDispatch = (record: any, detail?: boolean) => {
    this.props.dispatch({
      type: detailApi,
      payload: { id: record.id },
    });
    this.setState({ detailModalVisible: true, detail });
  };

  deleteApiDispatch = (ids: any) => {
    this.props.dispatch({
      type: deleteApi,
      payload: { idList: ids },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.setState({ selectedRowKeys: [] });
        this.pageApiDispatch();
      }
    });
  };

  resetPasswordApiDispatch = (ids: any) => {
    this.props.dispatch({
      type: resetPasswordApi,
      payload: { idList: ids },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.setState({ selectedRowKeys: [] });
        this.pageApiDispatch();
      }
    });
  };

  cacheEvictApiDispatch = () => {
    this.props.dispatch({
      type: cacheEvictApi,
    }).then((res: any) => {
      if (res.isSuccess) {
        message.success(res.msg);
        this.pageApiDispatch();
      }
    });
  };

  updateStateApiDispatch = (ids: any, stateEnum: string | number) => {
    this.props.dispatch({
      type: updateStateApi,
      payload: {
        idList: ids,
        stateEnum,
      },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.setState({ selectedRowKeys: [] });
        this.pageApiDispatch();
      }
    });
  };

  treeSelectEvent = (keys: any) => {
    this.setState({ searchValue: Object.assign(this.state.searchValue, { deptId: keys[0] }) }, () => {
      this.pageApiDispatch(1, 10);
    });
  };

  treeListApiDispatch = () => {
    this.props.dispatch({
      type: treeListApi,
      payload: {
        parentId: 1,
      },
    });
  };

  //=====================================请求函数 end==================================


}

export default connect(({ SysUserModel, loading }: any) => ({
  pageValue: SysUserModel.pageValue,
  detailValue: SysUserModel.detailValue,
  treeListValue: SysUserModel.treeListValue,

  pageLoading: loading.effects[pageToDeptApi],
  createLoading: loading.effects[createApi],
  updateLoading: loading.effects[updateApi],
  detailLoading: loading.effects[detailApi],
  deleteLoading: loading.effects[deleteApi],
  updateStateLoading: loading.effects[updateStateApi],

}))(Form.create<FormComponentProps>()(Index));
