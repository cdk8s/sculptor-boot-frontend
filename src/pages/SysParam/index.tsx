import React, { Component } from 'react';
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Menu,
  Icon,
  Dropdown,
  message,
  Modal,
  Spin,
  Divider,
  Popconfirm,
  Switch,
} from 'antd';
import get from 'lodash/get';
import { handleDate } from '@/utils/columnsHandle';
import { deleteNullValue, formatDateTimeStamp, mergeLoading, getEnumValueList } from '@/utils/utils';
import SearchForm from '@/components/HehSearch';
import HehTable from '@/components/HehTable';
import { connect } from 'dva';
import { FormComponentProps } from 'antd/lib/form/Form';
import HehForm from '@/components/HehForm';

import {
  pageApiToLeft,
  createApiToLeft,
  updateApiToLeft,
  detailApiToLeft,
  deleteApiToLeft,
  cacheEvictApiToLeft,
  updateStateApiToLeft,
  detailApiReducerToLeft,
} from '@/models/SysParamTypeModel';

import {
  pageApiToRight,
  createApiToRight,
  updateApiToRight,
  detailApiToRight,
  deleteApiToRight,
  cacheEvictApiToRight,
  updateStateApiToRight,
  detailApiReducerToRight,
} from '@/models/SysParamModel';

import './index.less';

class Index extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedRowKeysToLeft: [],
      selectedRowKeysToRight: [],
      detailModalVisibleToLeft: false,
      detailModalVisibleToRight: false,
    };
  }

  //=====================================生命周期 start=====================================

  componentDidMount() {
    this.pageApiDispatchToLeft();
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <div style={{ margin: 20 }}>
          <Row gutter={20}>
            {/* 两边宽度加起来一定 24*/}
            <Col span={10}>
              <Card>
                {this.renderDetailModalToLeft()}
                {this.renderSearchFormToLeft()}
                {this.renderTableToLeft()}
              </Card>
            </Col>
            {/* 两边宽度加起来一定 24*/}
            <Col span={14}>
              <Card>
                {this.renderDetailModalToRight()}
                {this.renderSearchFormToRight()}
                {this.renderTableToRight()}
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  //=====================================生命周期  end=====================================
  //=====================================函数式组件 start==================================

  renderTableToLeft = () => {
    const columns = [
      { title: '类型名称', dataIndex: 'typeName', align: 'center' },
      { title: '类型编码', dataIndex: 'typeCode', align: 'center' },
      {
        title: '状态', dataIndex: 'stateEnum', align: 'center', width: 90, hehRender: (text: string | number, record: any) => (
          <Popconfirm
            title="确认改变状态?"
            onConfirm={() => this.updateStateApiDispatchToLeft([record.id], text === 1 ? 2 : 1)}
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
      { title: '描述', dataIndex: 'description', align: 'center' },
      { title: '排序', dataIndex: 'ranking', align: 'center', width: 80 },
      {
        title: '操作', width: 200, dataIndex: 'operation', align: 'center', hehRender: (text: any, record: any) => (
          <span>
            <a onClick={() => this.detailApiDispatchToLeft(record)}><Icon type='edit'/>编辑</a>
            <Divider type='vertical'/>
            <a onClick={() => this.detailApiDispatchToLeft(record, true)}><Icon type='search'/>详情</a>
            <Divider type='vertical'/>
            <Popconfirm
              title="确认删除该条数据?"
              okText="确定"
              okType='danger'
              onConfirm={() => this.deleteApiDispatchToLeft([record.id])}
              cancelText="取消"
            >
              <a><Icon type="delete"/>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];

    const {
      pageValueToLeft,
      pageLoadingToLeft,
      deleteLoading,
      updateStateLoading,
    } = this.props;

    return (
      <>
        <div style={{ marginBottom: 5 }}>
          <Popconfirm
            title="确认刷新缓存?"
            onConfirm={this.cacheEvictApiDispatchToLeft}
            okText="确认"
            cancelText="取消"
          >
            <Button type='primary' style={{ marginRight: 5 }}>
              <Icon type='reload'/>刷新缓存
            </Button>
          </Popconfirm>
          <Button
            onClick={() => this.setState({ detailModalVisibleToLeft: true })}
            style={{ width: 100 }}
            type='primary'
          >
            <Icon type='plus'/>新建
          </Button>
          <Dropdown
            disabled={this.state.selectedRowKeysToLeft.length === 0}
            overlay={(
              <Menu>
                <Menu.Item>
                  <Popconfirm
                    title="确定执行批量删除操作?"
                    onConfirm={() => this.deleteApiDispatchToLeft(this.state.selectedRowKeysToLeft)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button>
                      <Icon type='delete'/> 批量删除
                    </Button>
                  </Popconfirm>
                </Menu.Item>
                <Menu.Item>
                  <Button onClick={() => this.updateStateApiDispatchToLeft(this.state.selectedRowKeysToLeft, 1)}>
                    <Icon type="check-circle"/> 批量启用
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button onClick={() => this.updateStateApiDispatchToLeft(this.state.selectedRowKeysToLeft, 2)}>
                    <Icon type="close-circle"/> 批量禁用
                  </Button>
                </Menu.Item>
              </Menu>
            )}
          >
            <Button style={{ marginLeft: 5 }}>
              批量操作 <Icon type="down"/>
            </Button>
          </Dropdown>
        </div>
        <HehTable
          columns={columns}
          getSelectedRowKeys={(keys: any) => {
            this.setState({ selectedRowKeysToLeft: keys });
          }}
          selectedRowKeys={this.state.selectedRowKeysToLeft}
          data={pageValueToLeft && pageValueToLeft.data || []}
          tableOptions={{
            loading: mergeLoading(
              pageLoadingToLeft,
              deleteLoading,
              updateStateLoading,
            ),
            onRow: (record: any) => {
              return {
                onClick: (event: any) => {
                  event.preventDefault();
                  this.setState({
                    typeId: record.id,
                  }, () => {
                    this.pageApiDispatchToRight(1, 10);
                  });
                },
              };
            },
            rowClassName: (record: any) => {
              return record.id === this.state.typeId ? 'row-active' : '';
            },
          }}

          selectType='checkbox'
          pageChange={(pageNum, pageSize) => {
            this.pageApiDispatchToLeft(pageNum, pageSize);
          }}
        />
      </>
    );
  };

  renderSearchFormToLeft = () => {
    const searchItems = [
      {
        type: 'input',
        label: '类型编码',
        id: 'typeCode',
        attribute: {
          placeholder: '请输入类型编码',
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
        getValue={this.getSearchFormValueToLeft}
      />
    );
  };

  renderDetailModalToLeft = () => {
    const { detailValueToLeft, form, createLoadingToLeft, updateLoadingToLeft } = this.props;

    const newFormItem = [
      {
        type: 'input',
        id: 'typeName',
        label: '类型名称',
        defaultValue: get(detailValueToLeft, 'typeName'),
        attribute: {
          maxLength: 50,
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '类型名称为必填项' },
          ],
        },
      },
      {
        type: 'input',
        id: 'typeCode',
        label: '类型编码',
        defaultValue: get(detailValueToLeft, 'typeCode'),
        attribute: {
          maxLength: 100,
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '类型编码为必填项' },
          ],
        },
      },
      {
        type: 'inputNumber',
        id: 'ranking',
        label: '排序',
        defaultValue: get(detailValueToLeft, 'ranking') || 100,
        attribute: {
          disabled: this.state.detail,
          max: 100,
          min: 1,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '排序为必填项' },
            {
              validator: (rule: any, value: any, callback: any) => {
                if (value < 1 || value > 100) {
                  callback('值为1-100正整数，排序值越小排越前面！');
                }
                callback();
              },
            },
          ],
        },
      },
      {
        type: 'radio',
        id: 'stateEnum',
        label: '状态',
        options: getEnumValueList('stateEnum'),
        defaultValue: get(detailValueToLeft, 'stateEnum'),
        attribute: {
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '状态为必填项' },
          ],
        },
      },

      { type: 'textarea', id: 'description', label: '描述', defaultValue: get(detailValueToLeft, 'description'), attribute: { disabled: this.state.detail } },

    ];

    return (
      <Modal
        afterClose={() => {
          this.setState({
            detail: false,
          });
          this.props.dispatch({
            type: detailApiReducerToLeft,
            payload: undefined,
          });
        }}
        destroyOnClose={true}
        title={(() => {
          if (detailValueToLeft && this.state.detail) {
            return <span>详情</span>;
          }
          if (detailValueToLeft) {
            return <span>编辑</span>;
          }
          return <span>新建</span>;
        })()}
        visible={this.state.detailModalVisibleToLeft}
        okButtonProps={{ loading: mergeLoading(createLoadingToLeft, updateLoadingToLeft) }}
        onOk={this.detailSubmitEventToLeft}
        centered={true}
        width={1024}
        onCancel={() => this.setState({ detailModalVisibleToLeft: false })}
        footer={!this.state.detail && (
          <div>
            <Button onClick={() => this.setState({ detailModalVisibleToLeft: false })}>取消</Button>
            <Button loading={mergeLoading(createLoadingToLeft, updateLoadingToLeft)} type='primary' onClick={this.detailSubmitEventToLeft}>确定</Button>
          </div>
        )}
      >
        <Spin spinning={this.props.detailLoadingToLeft || false}>
          <HehForm
            rowCols={2}
            form={form}
            formItems={newFormItem}
          />
        </Spin>
      </Modal>
    );
  };

  renderTableToRight = () => {
    const columns = [
      { title: '参数名称', dataIndex: 'paramName', align: 'center' },
      { title: '参数值', dataIndex: 'paramValue', align: 'center' },
      {
        title: '状态', dataIndex: 'stateEnum', align: 'center', width: 90, hehRender: (text: string | number, record: any) => (
          <Popconfirm
            title="确认改变状态?"
            onConfirm={() => this.updateStateApiDispatchToRight([record.id], text === 1 ? 2 : 1)}
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
      { title: '创建时间', dataIndex: 'createDate', align: 'center', width: 190, hehRender: (text: number) => handleDate(text) },
      { title: '更新人', dataIndex: 'updateUsername', align: 'center', width: 100 },
      { title: '更新时间', dataIndex: 'updateDate', align: 'center', width: 190, hehRender: (text: number) => handleDate(text) },
      {
        title: '操作', width: 200, dataIndex: 'operation', align: 'center', hehRender: (text: any, record: any) => (
          <span>
            <a onClick={() => this.detailApiDispatchToRight(record)}><Icon type='edit'/>编辑</a>
            <Divider type='vertical'/>
            <a onClick={() => this.detailApiDispatchToRight(record, true)}><Icon type='search'/>详情</a>
            <Divider type='vertical'/>
            <Popconfirm
              title="确认删除该条数据?"
              okText="确定"
              okType='danger'
              onConfirm={() => this.deleteApiDispatchToRight([record.id])}
              cancelText="取消"
            >
              <a><Icon type="delete"/>删除</a>
            </Popconfirm>
          </span>
        ),
      },
    ];
    const {
      pageLoadingToRight,
      pageValueToRight,
      deleteLoading,
      updateStateLoading,
    } = this.props;
    return (
      <>
        <div style={{ marginBottom: 5 }}>
          <Popconfirm
            title="确认刷新缓存?"
            onConfirm={this.cacheEvictApiDispatchToRight}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type='primary'
              disabled={!this.state.typeId}
              style={{ marginRight: 5 }}
            >
              <Icon type='reload'/>刷新缓存
            </Button>
          </Popconfirm>
          <Button
            onClick={() => this.setState({ detailModalVisibleToRight: true })}
            style={{ width: 100 }}
            disabled={!this.state.typeId}
            type='primary'
          >
            <Icon type='plus'/>新建
          </Button>
          <Dropdown
            disabled={this.state.selectedRowKeysToRight.length === 0}
            overlay={(
              <Menu>
                <Menu.Item>
                  <Button onClick={() => this.deleteApiDispatchToRight(this.state.selectedRowKeysToRight)}>
                    <Icon type="delete"/> 批量删除
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button onClick={() => this.updateStateApiDispatchToRight(this.state.selectedRowKeysToRight, 1)}>
                    <Icon type="check-circle"/> 批量启用
                  </Button>
                </Menu.Item>
                <Menu.Item>
                  <Button onClick={() => this.updateStateApiDispatchToRight(this.state.selectedRowKeysToRight, 2)}>
                    <Icon type="close-circle"/> 批量禁用
                  </Button>
                </Menu.Item>
              </Menu>
            )}
          >
            <Button style={{ marginLeft: 5 }}>
              批量操作 <Icon type="down"/>
            </Button>
          </Dropdown>
        </div>
        <HehTable
          columns={columns}
          getSelectedRowKeys={(keys: any) => {
            this.setState({ selectedRowKeysToRight: keys });
          }}
          selectedRowKeys={this.state.selectedRowKeysToRight}
          data={pageValueToRight && pageValueToRight.data || []}
          tableOptions={{
            loading: mergeLoading(
              pageLoadingToRight,
              deleteLoading,
              updateStateLoading,
            ),
          }}
          pageChange={(pageNum, pageSize) => {
            this.pageApiDispatchToRight(pageNum, pageSize);
          }}
          selectType='checkbox'
        />
      </>
    );
  };

  renderSearchFormToRight = () => {
    const searchItems = [
      {
        type: 'input',
        label: '参数名称',
        id: 'paramName',
        attribute: {
          placeholder: '请输入参数名称',
        },
      },
      {
        type: 'input',
        label: '参数编码',
        id: 'paramCode',
        attribute: {
          placeholder: '请输入参数编码',
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
        getValue={this.getSearchFormValueToRight}
      />
    );
  };

  renderDetailModalToRight = () => {
    const { detailValueToRight, form, createLoadingToRight, updateLoadingToRight } = this.props;

    const newFormItem = [
      {
        type: 'input',
        id: 'paramName',
        label: '参数名称',
        defaultValue: get(detailValueToRight, 'paramName'),
        attribute: {
          maxLength: 50,
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '参数名称为必填项' },
          ],
        },
      },
      {
        type: 'input',
        id: 'paramCode',
        label: '参数编码',
        defaultValue: get(detailValueToRight, 'paramCode'),
        attribute: {
          maxLength: 100,
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '参数编码为必填项' },
          ],
        },
      },

      { type: 'input', id: 'paramValue', label: '参数值', defaultValue: get(detailValueToRight, 'paramValue'), attribute: { disabled: this.state.detail } },

      {
        type: 'inputNumber',
        id: 'ranking',
        label: '排序',
        defaultValue: get(detailValueToRight, 'ranking') || 100,
        attribute: {
          disabled: this.state.detail,
          max: 100,
          min: 1,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '排序为必填项' },
            {
              validator: (rule: any, value: any, callback: any) => {
                if (value < 1 || value > 100) {
                  callback('值为1-100正整数，排序值越小排越前面！');
                }
                callback();
              },
            },
          ],
        },
      },

      {
        type: 'select',
        id: 'paramValueTypeEnum',
        label: '参数值类型',
        defaultValue: get(detailValueToRight, 'paramValueTypeEnum'),
        options: getEnumValueList('paramValueTypeEnum'),
        attribute: {
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '参数值类型为必填项' },
          ],
        },
      },


      {
        type: 'radio',
        id: 'stateEnum',
        label: '状态',
        options: getEnumValueList('stateEnum'),
        defaultValue: get(detailValueToRight, 'stateEnum'),
        attribute: {
          disabled: this.state.detail,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '状态为必填项' },
          ],
        },
      },

      { type: 'textarea', id: 'description', label: '描述', defaultValue: get(detailValueToRight, 'description'), attribute: { disabled: this.state.detail } },

    ];

    return (
      <Modal
        afterClose={() => {
          this.setState({
            detail: false,
          });
          this.props.dispatch({
            type: detailApiReducerToRight,
            payload: undefined,
          });
        }}
        destroyOnClose={true}
        title={(() => {
          if (detailValueToRight && this.state.detail) {
            return <span>详情</span>;
          }
          if (detailValueToRight) {
            return <span>编辑</span>;
          }
          return <span>新建</span>;
        })()}
        visible={this.state.detailModalVisibleToRight}
        okButtonProps={{ loading: mergeLoading(createLoadingToRight, updateLoadingToRight) }}
        onOk={this.detailSubmitEventToRight}
        centered={true}
        width={1024}
        onCancel={() => this.setState({ detailModalVisibleToRight: false })}
        footer={!this.state.detail && (
          <div>
            <Button onClick={() => this.setState({ detailModalVisibleToRight: false })}>取消</Button>
            <Button loading={mergeLoading(createLoadingToRight, updateLoadingToRight)} type='primary' onClick={this.detailSubmitEventToRight}>确定</Button>
          </div>
        )}
      >
        <Spin spinning={this.props.detailLoadingToRight || false}>
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
  getSearchFormValueToLeft = (values: any) => {
    if (values.createDate && values.createDate.length === 2) {
      values.createDateStartDate = formatDateTimeStamp(values.createDate[0], 'start');
      values.createDateEndDate = formatDateTimeStamp(values.createDate[1], 'end');
    }
    delete values.createDate;
    if (values.createDate === undefined && this.state.searchValueLeft && this.state.searchValueLeft.createDateEndDate !== undefined) {
      delete this.state.searchValueLeft.createDateEndDate;
      delete this.state.searchValueLeft.createDateStartDate;
    }
    this.setState({ searchValueLeft: { ...this.state.searchValueLeft, ...values } });
    this.pageApiDispatchToLeft(1, 10, { ...this.state.searchValueLeft, ...values });
  };

  getSearchFormValueToRight = (values: any) => {
    if (values.createDate && values.createDate.length === 2) {
      values.createDateStartDate = formatDateTimeStamp(values.createDate[0], 'start');
      values.createDateEndDate = formatDateTimeStamp(values.createDate[1], 'end');
    }
    delete values.createDate;
    if (values.createDate === undefined && this.state.searchValueRight && this.state.searchValueRight.createDateEndDate !== undefined) {
      delete this.state.searchValueRight.createDateEndDate;
      delete this.state.searchValueRight.createDateStartDate;
    }
    this.setState({ searchValueRight: { ...this.state.searchValueRight, ...values } });
    this.pageApiDispatchToRight(1, 10, { ...this.state.searchValueRight, ...values });
  };

  //=====================================组件工具方法 end====================================

  //=====================================带请求方法 start=====================================
  updateApiDispatchToLeft = (values: any) => {
    this.props.dispatch({
      type: updateApiToLeft,
      payload: values,
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.pageApiDispatchToLeft();
        this.setState({ detailModalVisibleToLeft: false });
      }
    });
  };

  createApiDispatchToLeft = (values: any) => {
    this.props.dispatch({
      type: createApiToLeft,
      payload: values,
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.pageApiDispatchToLeft();
        this.setState({ detailModalVisibleToLeft: false });
      }
    });
  };

  detailSubmitEventToLeft = () => {
    const { detailValueToLeft } = this.props;
    this.props.form.validateFields((err: any, values: any) => {
      if (err) return;
      if (detailValueToLeft) {
        this.updateApiDispatchToLeft({ ...values, id: detailValueToLeft.id });
      } else {
        this.createApiDispatchToLeft(values);
      }
    });
  };

  detailSubmitEventToRight = () => {
    const { detailValueToRight } = this.props;
    this.props.form.validateFields((err: any, values: any) => {
      if (err) return;
      if (detailValueToRight) {
        this.updateApiDispatchToRight({
          ...values,
          id: detailValueToRight.id,
          typeId: this.state.typeId,
        });
      } else {
        this.createApiDispatchToRight({
          ...values,
          typeId: this.state.typeId,
        });
      }
    });
  };

  updateApiDispatchToRight = (values: any) => {
    this.props.dispatch({
      type: updateApiToRight,
      payload: values,
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.pageApiDispatchToRight();
        this.setState({ detailModalVisibleToRight: false });
      }
    });
  };

  createApiDispatchToRight = (values: any) => {
    this.props.dispatch({
      type: createApiToRight,
      payload: values,
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.pageApiDispatchToRight();
        this.setState({ detailModalVisibleToRight: false });
      }
    });
  };

  pageApiDispatchToLeft = (pageNum = 1, pageSize = 10, values = this.state.searchValueLeft) => {
    this.props.dispatch(deleteNullValue({
      type: pageApiToLeft,
      payload: {
        pageNum,
        pageSize,
        ...values,
      },
    }));
  };

  pageApiDispatchToRight = (pageNum = 1, pageSize = 10, values = this.state.searchValueRight) => {
    this.props.dispatch({
      type: pageApiToRight,
      payload: deleteNullValue({
        pageNum,
        pageSize,
        typeId: this.state.typeId,
        ...values,
      }),
    });
  };

  detailApiDispatchToLeft = (record: any, detail?: boolean) => {
    this.props.dispatch({
      type: detailApiToLeft,
      payload: { id: record.id },
    });
    this.setState({ detailModalVisibleToLeft: true, detail });
  };

  detailApiDispatchToRight = (record: any, detail?: boolean) => {
    this.props.dispatch({
      type: detailApiToRight,
      payload: { id: record.id },
    });
    this.setState({ detailModalVisibleToRight: true, detail });
  };

  deleteApiDispatchToLeft = (ids: any) => {
    this.props.dispatch({
      type: deleteApiToLeft,
      payload: { idList: ids },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.setState({ selectedRowKeys: [] });
        this.pageApiDispatchToLeft();
      }
    });
  };

  deleteApiDispatchToRight = (ids: any) => {
    this.props.dispatch({
      type: deleteApiToRight,
      payload: { idList: ids },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.setState({ selectedRowKeys: [] });
        this.pageApiDispatchToRight();
      }
    });
  };

  cacheEvictApiDispatchToLeft = () => {
    this.props.dispatch({
      type: cacheEvictApiToLeft,
    }).then((res: any) => {
      if (res.isSuccess) {
        message.success(res.msg);
        this.pageApiDispatchToLeft();
      }
    });
  };

  cacheEvictApiDispatchToRight = () => {
    this.props.dispatch({
      type: cacheEvictApiToRight,
    }).then((res: any) => {
      if (res.isSuccess) {
        message.success(res.msg);
        this.pageApiDispatchToRight();
      }
    });
  };

  updateStateApiDispatchToLeft = (ids: any, stateEnum: any) => {
    this.props.dispatch({
      type: updateStateApiToLeft,
      payload: {
        idList: ids,
        stateEnum,
      },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.pageApiDispatchToLeft();
      }
    });
  };

  updateStateApiDispatchToRight = (ids: any, stateEnum: any) => {
    this.props.dispatch({
      type: updateStateApiToRight,
      payload: {
        idList: ids,
        stateEnum,
      },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.pageApiDispatchToRight();
      }
    });
  };

  //=====================================带请求方法 end=====================================

}

export default connect(({ SysParamTypeModel, SysParamModel, loading }: any) => ({
  pageValueToLeft: SysParamTypeModel.pageValueToLeft,
  detailValueToLeft: SysParamTypeModel.detailValueToLeft,
  pageValueToRight: SysParamModel.pageValueToRight,
  detailValueToRight: SysParamModel.detailValueToRight,

  pageLoadingToLeft: loading.effects[pageApiToLeft],
  pageLoadingToRight: loading.effects[pageApiToRight],

  createLoadingToLeft: loading.effects[createApiToLeft],
  updateLoadingToLeft: loading.effects[updateApiToLeft],
  detailLoadingToLeft: loading.effects[detailApiToLeft],
  deleteLoadingToLeft: loading.effects[deleteApiToLeft],
  updateStateLoadingToLeft: loading.effects[updateStateApiToLeft],

  createLoadingToRight: loading.effects[createApiToRight],
  updateLoadingToRight: loading.effects[updateApiToRight],
  detailLoadingToRight: loading.effects[detailApiToRight],
  deleteLoadingToRight: loading.effects[deleteApiToRight],
  updateStateLoadingToRight: loading.effects[updateStateApiToRight],

}))(Form.create<FormComponentProps>()(Index));
