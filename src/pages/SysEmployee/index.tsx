import React, { Component } from 'react';
import {
  Card,
  Divider,
  Modal,
  Popconfirm,
  Form,
  Button,
  message,
  Spin,
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
import { handleDate } from '@/utils/columnsHandle';
import { formatDateTimeStamp } from '@/utils/utils';

import { deleteNullValue, mergeLoading } from '@/utils/utils';
import HehReactJson from '@/components/HehReactJson';
import {
  createApi,
  pageApi,
  updateApi,
  detailApi,
  deleteApi,
  cacheEvictApi,
  detailApiReducer,
} from '@/models/SysEmployeeModel';

import '../../base.less';

class Index extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      detailModalVisible: false,
      selectedRowKeys: [],
      reactJsonVisible: false,
      reactJson: undefined,
    };
  }

  //=====================================生命周期 start=====================================

  componentDidMount() {
    this.pageApiDispatch();
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <HehReactJson
          visible={this.state.reactJsonVisible}
          json={this.state.reactJson}
          onCancel={() => this.setState({ reactJsonVisible: false })}
        />
        <Card style={{ minHeight: 500 }}>
          {this.renderDetailModal()}
          {this.renderSearchForm()}
          {this.renderTable()}
        </Card>
      </div>
    );
  }

  //=====================================生命周期  end=====================================

  //=====================================函数式组件 start==================================

  renderTable = () => {
    const columns = [
      { title: '用户ID', dataIndex: 'userId', align: 'center' },
      { title: '用户名', dataIndex: 'username', align: 'center' },
      { title: '真实姓名', dataIndex: 'realName', align: 'center' },
      { title: '工号', dataIndex: 'workCardId', align: 'center' },
      { title: '职位', dataIndex: 'jobPosition', align: 'center' },
      { title: '创建人', dataIndex: 'createUsername', align: 'center', width: 100 },
      { title: '创建时间', dataIndex: 'createDate', align: 'center', width: 170, hehRender: (text: number) => handleDate(text) },
      { title: '更新人', dataIndex: 'updateUsername', align: 'center', width: 100 },
      { title: '更新时间', dataIndex: 'updateDate', align: 'center', width: 170, hehRender: (text: number) => handleDate(text) },
      {
        title: '操作', width: 180, dataIndex: 'operation', align: 'center', hehRender: (text: any, record: any) => (
          <span>
            <a onClick={() => this.detailApiDispatch(record)}><Icon type='edit'/>编辑</a>
            <Divider type='vertical'/>
            <a onClick={() => this.detailApiDispatch(record, true)}><Icon type='search'/>详情</a>
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
        label: '用户ID',
        id: 'userId',
        attribute: {
          placeholder: '请输入用户ID',
        },
      },
      {
        type: 'input',
        label: '用户名',
        id: 'username',
        attribute: {
          placeholder: '请输入用户名',
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
        label: '工号',
        id: 'workCardId',
        attribute: {
          placeholder: '请输入工号',
        },
      },
      {
        type: 'input',
        label: '职位',
        id: 'jobPosition',
        attribute: {
          placeholder: '请输入职位',
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
        id: 'userId',
        label: '用户ID',
        defaultValue: get(detailValue, 'userId'),
        attribute: {
          disabled: this.state.detail || get(detailValue, 'userId') !== undefined,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '用户ID为必填项' },
          ],
        },
      },

      { type: 'input', id: 'workCardId', label: '工号', defaultValue: get(detailValue, 'workCardId'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'jobPosition', label: '职位', defaultValue: get(detailValue, 'jobPosition'), attribute: { disabled: this.state.detail } },
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

  //=====================================函数式组件 end====================================

  //=====================================组件工具方法 start==================================

  getSearchFormValue = (values: any) => {
    if (values.createDate && values.createDate.length === 2) {
      values.createDateStartDate = formatDateTimeStamp(values.createDate[0], 'start');
      values.createDateEndDate = formatDateTimeStamp(values.createDate[1], 'end');
    }
    delete values.createDate;
    if (values.createDate === undefined && this.state.searchValue && this.state.searchValue.createDateEndDate !== undefined) {
      delete this.state.searchValue.createDateStartDate;
      delete this.state.searchValue.createDateEndDate;
    }
    if (values.updateDate && values.updateDate.length === 2) {
      values.updateDateStartDate = formatDateTimeStamp(values.updateDate[0], 'start');
      values.updateDateEndDate = formatDateTimeStamp(values.updateDate[1], 'end');
    }
    delete values.updateDate;
    if (values.updateDate === undefined && this.state.searchValue && this.state.searchValue.updateDateEndDate !== undefined) {
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

  //=====================================带请求方法 start=====================================

  pageApiDispatch = (pageNum = 1, pageSize = 10, values = this.state.searchValue) => {
    this.props.dispatch({
      type: pageApi,
      payload: deleteNullValue({
        pageNum: pageNum,
        pageSize: pageSize,
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


  //=====================================带请求方法 end=====================================
}

export default connect(({ SysEmployeeModel, loading }: any) => ({
  pageValue: SysEmployeeModel.pageValue,
  detailValue: SysEmployeeModel.detailValue,
  pageLoading: loading.effects[pageApi],
  createLoading: loading.effects[createApi],
  updateLoading: loading.effects[updateApi],
  detailLoading: loading.effects[detailApi],
  deleteLoading: loading.effects[deleteApi],
}))(Form.create<FormComponentProps>()(Index));
