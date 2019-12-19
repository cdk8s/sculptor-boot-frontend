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
import { mergeLoading, getEnumValueList } from '@/utils/utils';

import {
  createApi,
  updateApi,
  detailApi,
  deleteApi,
  cacheEvictApi,
  detailApiReducer,
  treeListApi,
} from '@/models/SysPermissionModel';

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
            <Icon type='plus'/>添加子节点
          </Button>
          <Button onClick={() => {
            this.setState({ btnType: 2 }, () => {
              this.clearDetailValueEvent({
                parentName: '顶级节点',
                parentId: 1,
              });
            });
          }} type='primary' style={{ marginRight: 5 }}>
            <Icon type='plus'/>创建一级节点
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
            field={{ title: 'permissionName', id: 'id' }}
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
    const newFormItem = [
      this.state.btnType !== 0 ? {
        type: 'input',
        id: 'parentName',
        label: '父级节点',
        defaultValue: get(detailValue, 'parentName'),
        attribute: { disabled: true },
      } : {},
      this.state.btnType !== 0 ? {
        type: 'input',
        id: 'parentId',
        label: '父级节点id',
        style: { display: 'none' },
        defaultValue: get(detailValue, 'parentId'),
        attribute: { disabled: true },
      } : {},

      {
        type: 'input',
        id: 'permissionName',
        label: '权限名称',
        defaultValue: get(detailValue, 'permissionName'),
        attribute: {
          maxLength: 50,
          disabled: this.state.detail || this.state.selectKeys.length === 0,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '权限名称为必填项' },
          ],
        },
      },
      {
        type: 'input',
        id: 'permissionCode',
        label: '权限标识码',
        defaultValue: get(detailValue, 'permissionCode'),
        attribute: {
          maxLength: 50,
          disabled: this.state.detail || this.state.selectKeys.length === 0,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '权限标识码为必填项' },
          ],
        },
      },

      { type: 'input', id: 'permissionUrl', label: '路由地址', defaultValue: get(detailValue, 'permissionUrl'), attribute: { disabled: this.state.detail || this.state.selectKeys.length === 0 } },
      {
        type: 'chooseIcon',
        label: '权限图标',
        id: 'iconClass',
        defaultValue: get(detailValue, 'iconClass'),
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
        type: 'select',
        id: 'permissionTypeEnum',
        label: '权限类型',
        defaultValue: get(detailValue, 'permissionTypeEnum'),
        options: getEnumValueList('permissionTypeEnum'),
        attribute: {
          disabled: this.state.detail || this.state.selectKeys.length === 0,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '权限类型为必填项' },
          ],
        },
      },
      {
        type: 'select',
        id: 'visibleEnum',
        label: '显示状态',
        defaultValue: get(detailValue, 'visibleEnum'),
        options: getEnumValueList('visibleEnum'),
        attribute: {
          disabled: this.state.detail || this.state.selectKeys.length === 0,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '显示状态为必填项' },
          ],
        },
      },

      {
        type: 'radio',
        id: 'boolExtLinkEnum',
        label: '是否外链',
        options: getEnumValueList('booleanEnum'),
        defaultValue: get(detailValue, 'boolExtLinkEnum'),
        attribute: {
          disabled: this.state.detail || this.state.selectKeys.length === 0,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '是否外链为必填项' },
          ],
        },
      },
      {
        type: 'radio',
        id: 'boolNewTabEnum',
        label: '是否新标签打开',
        options: getEnumValueList('booleanEnum'),
        defaultValue: get(detailValue, 'boolNewTabEnum'),
        attribute: {
          disabled: this.state.detail || this.state.selectKeys.length === 0,
        },
        formDecoratorOptions: {
          rules: [
            { required: true, message: '是否新标签打开为必填项' },
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

      { type: 'textarea', id: 'description', label: '描述', defaultValue: get(detailValue, 'description'), attribute: { disabled: this.state.detail || this.state.selectKeys.length === 0 } },


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
                  if (this.state.btnType === 1) return '确认添加子节点?';
                  if (this.state.btnType === 2) return '确认添加一级节点?';
                  return '确认修改?';
                })()}
                onConfirm={this.detailSubmitEvent}
                okText="确认"
                cancelText="取消"
              >
                <Button type='primary'>{((): any => {
                  if (this.state.btnType === 1) return '添加子节点';
                  if (this.state.btnType === 2) return '添加一级节点';
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

  //=====================================请求函数 end==================================
}

export default connect(({ SysPermissionModel, loading }: any) => ({
  treeListValue: SysPermissionModel.treeListValue,
  detailValue: SysPermissionModel.detailValue,

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
