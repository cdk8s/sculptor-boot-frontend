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

import { deleteNullValue, mergeLoading, getEnumValueList } from '@/utils/utils';
import HehReactJson from '@/components/HehReactJson';
import {
  createApi,
  pageApi,
  updateApi,
  detailApi,
  deleteApi,
  cacheEvictApi,
  detailApiReducer,
} from '@/models/SysEventLogModel';

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
      { title: '用户账号', dataIndex: 'username', align: 'center' },
      { title: '记录信息', dataIndex: 'message', align: 'center' },
      { title: '执行时间(ms)', dataIndex: 'executeTime', align: 'center' },
      { title: '访问时间', dataIndex: 'requestDate', align: 'center', width: 170, hehRender: (text: number) => handleDate(text) },
      { title: '请求 URL', dataIndex: 'requestUrl', align: 'center' },
      { title: '请求参数', dataIndex: 'requestParam', align: 'center' },
      { title: '是否执行成功', dataIndex: 'boolExecuteSuccessEnumString', align: 'center' },
      { title: '事件类型', dataIndex: 'operateTypeEnumString', align: 'center' },
      { title: '失败异常信息', dataIndex: 'exceptionMsg', align: 'center' },
      { title: 'IP 地址', dataIndex: 'ipAddress', align: 'center' },
      { title: 'IP 信息', dataIndex: 'ipRegion', align: 'center' },
      { title: 'UserAgent', dataIndex: 'userAgent', align: 'center' },
      { title: '语言区域', dataIndex: 'browserLocale', align: 'center' },
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
        label: '用户账号',
        id: 'username',
        attribute: {
          placeholder: '请输入用户账号',
        },
      },
      {
        type: 'rangePicker',
        label: '访问时间',
        id: 'requestDate',
        attribute: {
          allowClear: true,
        },
      },
      {
        type: 'input',
        label: '请求方法名',
        id: 'requestMethod',
        attribute: {
          placeholder: '请输入请求方法名',
        },
      },
      {
        type: 'input',
        label: 'IP 地址',
        id: 'ipAddress',
        attribute: {
          placeholder: '请输入IP 地址',
        },
      },
      {
        type: 'input',
        label: 'IP 地址对应的省',
        id: 'ipRegionProvince',
        attribute: {
          placeholder: '请输入IP 地址对应的省',
        },
      },
      {
        type: 'input',
        label: 'IP 地址对应的市',
        id: 'ipRegionCity',
        attribute: {
          placeholder: '请输入IP 地址对应的市',
        },
      },
      {
        type: 'input',
        label: '设备名称',
        id: 'deviceName',
        attribute: {
          placeholder: '请输入设备名称',
        },
      },
      {
        type: 'input',
        label: '系统名称',
        id: 'osName',
        attribute: {
          placeholder: '请输入系统名称',
        },
      },
      {
        type: 'input',
        label: '浏览器',
        id: 'browserName',
        attribute: {
          placeholder: '请输入浏览器',
        },
      },
      {
        type: 'select',
        label: '事件类型',
        id: 'operateTypeEnum',
        options: getEnumValueList('operateTypeEnum'),
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
        label: '是否执行成功',
        id: 'boolExecuteSuccessEnum',
        options: getEnumValueList('booleanEnum'),
        attribute: {
          allowClear: true,
          placeholder: '请选择',
        },
        optionAttribute: {
          key: 'value',
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

      { type: 'input', id: 'userId', label: '用户ID', defaultValue: get(detailValue, 'userId'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'username', label: '用户账号', defaultValue: get(detailValue, 'username'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'message', label: '记录信息', defaultValue: get(detailValue, 'message'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'executeTime', label: '执行时间', defaultValue: get(detailValue, 'executeTime'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'requestDate', label: '访问时间', defaultValue: get(detailValue, 'requestDate'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'requestUrl', label: '请求 URL', defaultValue: get(detailValue, 'requestUrl'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'requestMethod', label: '请求方法名', defaultValue: get(detailValue, 'requestMethod'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'requestParam', label: '请求参数', defaultValue: get(detailValue, 'requestParam'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'exceptionMsg', label: '失败异常信息', defaultValue: get(detailValue, 'exceptionMsg'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'ipAddress', label: 'IP 地址', defaultValue: get(detailValue, 'ipAddress'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'ipRegion', label: 'IP 信息', defaultValue: get(detailValue, 'ipRegion'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'ipRegionCountry', label: 'IP 地址对应的国家', defaultValue: get(detailValue, 'ipRegionCountry'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'ipRegionProvince', label: 'IP 地址对应的省', defaultValue: get(detailValue, 'ipRegionProvince'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'ipRegionCity', label: 'IP 地址对应的市', defaultValue: get(detailValue, 'ipRegionCity'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'ipRegionIsp', label: 'IP 地址对应的网络提供商', defaultValue: get(detailValue, 'ipRegionIsp'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'userAgent', label: 'UserAgent', defaultValue: get(detailValue, 'userAgent'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'deviceName', label: '设备名称', defaultValue: get(detailValue, 'deviceName'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'osName', label: '系统名称', defaultValue: get(detailValue, 'osName'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'browserName', label: '浏览器', defaultValue: get(detailValue, 'browserName'), attribute: { disabled: this.state.detail } },
      { type: 'input', id: 'browserLocale', label: '语言区域', defaultValue: get(detailValue, 'browserLocale'), attribute: { disabled: this.state.detail } },


      {
        type: 'select',
        id: 'operateTypeEnum',
        label: '事件类型',
        defaultValue: get(detailValue, 'operateTypeEnum'),
        options: getEnumValueList('operateTypeEnum'),
        attribute: {
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '事件类型为必填项' },
          ],
        },
      },

      {
        type: 'radio',
        id: 'boolExecuteSuccessEnum',
        label: '是否执行成功',
        options: getEnumValueList('booleanEnum'),
        defaultValue: get(detailValue, 'boolExecuteSuccessEnum'),
        attribute: {
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '是否执行成功为必填项' },
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

  //=====================================函数式组件 end====================================

  //=====================================组件工具方法 start==================================

  getSearchFormValue = (values: any) => {

    if (values.requestDate && values.requestDate.length === 2) {
      values.requestDateStartDate = formatDateTimeStamp(values.requestDate[0], 'start');
      values.requestDateEndDate = formatDateTimeStamp(values.requestDate[1], 'end');
    }
    delete values.requestDate;
    if (values.requestDate === undefined && this.state.searchValue && this.state.searchValue.requestDateEndDate !== undefined) {
      delete this.state.searchValue.requestDateStartDate;
      delete this.state.searchValue.requestDateEndDate;
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

export default connect(({ SysEventLogModel, loading }: any) => ({
  pageValue: SysEventLogModel.pageValue,
  detailValue: SysEventLogModel.detailValue,
  pageLoading: loading.effects[pageApi],
  createLoading: loading.effects[createApi],
  updateLoading: loading.effects[updateApi],
  detailLoading: loading.effects[detailApi],
  deleteLoading: loading.effects[deleteApi],
}))(Form.create<FormComponentProps>()(Index));
