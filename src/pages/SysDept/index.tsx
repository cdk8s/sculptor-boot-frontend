import React, { Component } from 'react';
import {
  Card,
  Row,
  Col,
  Popconfirm,
  Form,
  Button,
  message,
  Spin,
  Icon,
} from 'antd';
import { connect } from 'dva';
import get from 'lodash/get';
import { FormComponentProps } from 'antd/lib/form/Form';
import HehForm from '@/components/HehForm';
import HehTree from '@/components/HehTree';
import { deleteNullValue, mergeLoading, getEnumValueList } from '@/utils/utils';

import {
  createApi,
  updateApi,
  detailApi,
  deleteApi,
  cacheEvictApi,
  detailApiReducer,
  treeListApi,
  assignUserDeptTreeListApi,
  assignUserPageApi,
} from '@/models/SysDeptModel';

class Index extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedNames: [],
      selectKeys: [],
      checkedKeys: [],
      clearSelected: 0,
      clearChecked: 0,
      btnType: 0,
    };
  }

  //=====================================生命周期 start=====================================

  componentDidMount() {
    this.treeListApiDispatch();
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <Row style={{ padding: 20 }} gutter={20}>
          {this.renderTreeToLeft()}
          {this.renderFormToRight()}
        </Row>
      </div>
    );
  }

  //=====================================生命周期  end=====================================

  //=====================================函数式组件 start==================================

  renderTreeToLeft = () => {
    return (
      <Col span={6}>
        <Card>
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
          <Button disabled={this.state.selectKeys.length === 0} onClick={() => {
            this.setState({ btnType: 1 }, () => {
              this.clearDetailValueEvent({
                parentName: this.state.selectedNames[0],
                parentId: this.state.selectKeys[0],
              });
            });
          }} type='primary' style={{ marginRight: 5 }}>
            <Icon type='plus'/>添加子部门
          </Button>
          <Button onClick={() => {
            this.setState({ btnType: 2 }, () => {
              this.clearDetailValueEvent({
                parentName: '顶级部门',
                parentId: 1,
              });
            });
          }} type='primary' style={{ marginRight: 5 }}>
            <Icon type='plus'/>创建一级部门
          </Button>
          <Popconfirm
            title={`确认批量删除${this.state.checkedNames && this.state.checkedNames.join('、')}`}
            onConfirm={this.deleteApiDispatch}
            okText="确认"
            cancelText="取消"
          >
            <Button disabled={this.state.checkedKeys.length === 0} type='primary' style={{ marginRight: 5 }}>
              <Icon type='delete'/> 批量删除
            </Button>
          </Popconfirm>
          <HehTree
            showInfo={{ showSelectedNames: true, showCheckedNames: true }}
            checkable={true}
            allExpand={true}
            showSearch={true}
            showOperation={true}
            loading={mergeLoading(this.props.treeListLoading, this.props.cacheEvictLoading)}
            data={this.props.treeListValue}
            field={{ title: 'deptName', id: 'id' }}
            getSelectKeys={this.getSelectKeysEvent}
            getCheckedKeys={this.getCheckedKeysEvent}
            getSelectNames={this.getSelectNamesEvent}
            getCheckedNames={this.getCheckedNamesEvent}
            clearSelected={this.state.clearSelected}
            clearChecked={this.state.clearChecked}
          />
        </Card>
      </Col>
    );
  };

  renderFormToRight = () => {
    const { form, detailValue } = this.props;
    const deptPageColumns = [
      { title: '用户账号', dataIndex: 'username' },
      { title: '真实姓名', dataIndex: 'realName' },
    ];
    const newFormItem = [
      this.state.btnType !== 0 ? {
        type: 'input',
        id: 'parentName',
        label: '父级部门',
        defaultValue: get(detailValue, 'parentName'),
        attribute: { disabled: true },
      } : {},
      this.state.btnType !== 0 ? {
        type: 'input',
        id: 'parentId',
        label: '父级部门id',
        style: { display: 'none' },
        defaultValue: get(detailValue, 'parentId'),
        attribute: { disabled: true },
      } : {},
      {
        type: 'input',
        id: 'deptName',
        label: '部门名称',
        defaultValue: get(detailValue, 'deptName'),
        attribute: { disabled: this.state.detail || this.state.selectKeys.length === 0 },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '部门名称为必填项' },
          ],
        },
      },
      {
        type: 'input',
        id: 'deptCode',
        label: '部门编码',
        defaultValue: get(detailValue, 'deptCode'),
        attribute: { disabled: this.state.detail || this.state.selectKeys.length === 0 },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '部门编码为必填项' },
          ],
        },
      },
      {
        type: 'input',
        id: 'telephone',
        label: '固话',
        defaultValue: get(detailValue, 'telephone'),
        attribute: { disabled: this.state.detail || this.state.selectKeys.length === 0 },
      },
      {
        type: 'input',
        id: 'mobilePhone',
        label: '手机号',
        defaultValue: get(detailValue, 'mobilePhone'),
        attribute: { disabled: this.state.detail || this.state.selectKeys.length === 0 },
      },
      {
        type: 'input',
        id: 'deptFax',
        label: '传真',
        defaultValue: get(detailValue, 'deptFax'),
        attribute: { disabled: this.state.detail || this.state.selectKeys.length === 0 },
      },
      {
        type: 'input',
        id: 'deptAddress',
        label: '地址',
        defaultValue: get(detailValue, 'deptAddress'),
        attribute: { disabled: this.state.detail || this.state.selectKeys.length === 0 },
      },
      {
        type: 'inputNumber',
        id: 'ranking',
        label: '排序',
        defaultValue: get(detailValue, 'ranking') || 100,
        attribute: {
          disabled: this.state.detail || this.state.selectKeys.length === 0,
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
        defaultValue: get(detailValue, 'stateEnum'),
        attribute: {
          disabled: this.state.detail || this.state.selectKeys.length === 0,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '状态为必填项' },
          ],
        },
      },
      {
        type: 'textarea',
        id: 'description',
        label: '描述',
        defaultValue: get(detailValue, 'description'),
        attribute: { disabled: this.state.detail || this.state.selectKeys.length === 0 },
      },
      {
        type: 'treeTable',
        id: 'leaderUserId',
        label: '部门负责人',
        modalAttribute: { title: '选择部门负责人', width: 1366 },
        tableAttribute: {
          columns: deptPageColumns,
          getTableData: (current: any, size: any, searchValue: any) => {
            this.setState({
              userTableSearch: Object.assign(this.state.userTableSearch || {}, searchValue),
            }, () => {
              this.assignUserPageApiDispatch();
            });
          },
          tableData: this.props.assignUserPageValue,
          field: { key: 'id', value: 'realName' },
        },
        treeAttribute: {
          getTreeData: this.assignUserDeptTreeListApiDispatch,
          treeData: this.props.assignUserDeptTreeListValue,
          field: { title: 'deptName', id: 'id' },
          onSelect: (keys: any) => {
            this.setState({
              userTableSearch: Object.assign(this.state.userTableSearch || {}, { deptId: keys[0] }),
            }, () => {
              this.assignUserPageApiDispatch();
            });
          },
        },
        defaultValue: get(detailValue, 'leaderUserId') ? [{ key: get(detailValue, 'leaderUserId'), label: get(detailValue, 'leaderRealName') }] : undefined,
        attribute: { disabled: this.state.detail || this.state.selectKeys.length === 0 },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '部门负责人为必填项' },
          ],
        },
      },
    ];
    return (
      <Col span={18}>
        <Card>
          <Spin spinning={this.props.detailLoading || false}>
            <HehForm
              rowCols={2}
              form={form}
              formItems={newFormItem}
            />
            <div style={{ textAlign: 'center' }}>
              <Popconfirm
                title={((): any => {
                  if (this.state.btnType === 1) return '确认添加子部门?';
                  if (this.state.btnType === 2) return '确认添加一级部门?';
                  return '确认修改?';
                })()}
                onConfirm={this.detailSubmitEvent}
                okText="确认"
                cancelText="取消"
              >
                <Button type='primary'>{((): any => {
                  if (this.state.btnType === 1) return '添加子部门';
                  if (this.state.btnType === 2) return '添加一级部门';
                  return '保存修改';
                })()}</Button>
              </Popconfirm>
            </div>
          </Spin>
        </Card>
      </Col>
    );
  };

  //=====================================函数式组件 end==================================

  //=====================================组件工具方法 start====================================

  getCheckedNamesEvent = (keys: any) => {
    this.setState({ checkedNames: keys });
  };

  getCheckedKeysEvent = (keys: any) => {
    this.setState({ checkedKeys: keys });
  };

  getSelectNamesEvent = (names: any) => {
    this.setState({ selectedNames: names });
  };

  getSelectKeysEvent = (selectKeys: any) => {
    this.setState({ selectKeys, btnType: 0 });
    this.detailApiDispatch({ id: selectKeys[0] });
  };

  detailSubmitEvent = (e: any) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        if (values.leaderUserId) values.leaderUserId = values.leaderUserId[0].key;
        if (this.state.btnType === 0) {
          this.updateApiDispatch(values);
        } else {
          this.createApiDispatch(values);
        }
      }
    });
  };

  clearDetailValueEvent = (data: any) => {
    this.props.dispatch({
      type: detailApiReducer,
      payload: data,
    });
  };

  //=====================================组件工具方法 end====================================

  //=====================================请求函数 start================================

  treeListApiDispatch = () => {
    this.props.dispatch({
      type: treeListApi,
      payload: {
        parentId: 1,
      },
    });
  };

  createApiDispatch = (values: any) => {
    this.props.dispatch({
      type: createApi,
      payload: values,
    }).then((res: any) => {
      if (res && res.isSuccess) {
        this.clearDetailValueEvent(undefined);
        this.setState({ btnType: 0 });
        message.success(res.msg);
        this.treeListApiDispatch();
      }
    });
  };

  updateApiDispatch = (values: any) => {
    this.props.dispatch({
      type: updateApi,
      payload: {
        ...values,
        id: this.props.detailValue.id,
      },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        // this.props.form.resetFields();
        this.detailApiDispatch({ id: this.state.selectKeys[0] });
        this.treeListApiDispatch();
        message.success(res.msg);
      }
    });
  };

  detailApiDispatch = (record: any) => {
    this.props.dispatch({
      type: detailApi,
      payload: { id: record.id },
    });
  };

  deleteApiDispatch = () => {
    this.props.dispatch({
      type: deleteApi,
      payload: {
        idList: this.state.checkedKeys,
      },
    }).then((res: any) => {
      if (res && res.isSuccess) {
        message.success(res.msg);
        this.setState({ clearChecked: this.state.clearChecked + 1 });
        this.treeListApiDispatch();
      }
    });
  };

  cacheEvictApiDispatch = () => {
    this.props.dispatch({
      type: cacheEvictApi,
    }).then((res: any) => {
      if (res.isSuccess) {
        message.success(res.msg);
        this.treeListApiDispatch();
      }
    });
  };

  assignUserDeptTreeListApiDispatch = () => {
    this.props.dispatch({
      type: assignUserDeptTreeListApi,
      payload: {
        parentId: 1,
      },
    });
  };

  assignUserPageApiDispatch = (pageNum = 1, pageSize = 10, searchValue = this.state.userTableSearch) => {
    this.props.dispatch({
      type: assignUserPageApi,
      payload: deleteNullValue({
        pageNum,
        pageSize,
        ...searchValue,
      }),
    });
  };

  //=====================================请求函数 end==================================
}

export default connect(({ SysDeptModel, loading }: any) => ({
  assignUserDeptTreeListValue: SysDeptModel.assignUserDeptTreeListValue,
  assignUserPageValue: SysDeptModel.assignUserPageValue,
  treeListValue: SysDeptModel.treeListValue,
  detailValue: SysDeptModel.detailValue,

  treeListLoading: loading.effects[treeListApi],
  detailLoading: loading.effects[detailApi],
  cacheEvictLoading: loading.effects[cacheEvictApi],
}))(Form.create<FormComponentProps>({
  mapPropsToFields(props) {
    return {
      username: Form.createFormField({
        ...props,
      }),
    };
  },
  onValuesChange: (props, changedValues, allValues) => {
    if (allValues.leaderUserId) {
      allValues.leaderRealName = allValues.leaderUserId[0].label;
      allValues.leaderUserId = allValues.leaderUserId[0].key;
    }
    // @ts-ignore
    if (props.detailValue && props.detailValue.id) {
      // @ts-ignore
      allValues.id = props.detailValue.id;
    }
    // @ts-ignore
    props.dispatch({
      type: detailApiReducer,
      payload: allValues,
    });
  },
})(Index));
