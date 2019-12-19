import React, { Component } from 'react';
import { Col, Input, Modal, Row } from 'antd';
import HehTree from '@/components/HehTree';
import _ from 'lodash';
import HehTable from '@/components/HehTable';
import { formatDateTimeStamp } from '@/utils/utils';
import SearchForm from '@/components/HehSearch';

class TreeTable extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      defaultValue: undefined,
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    const { value } = nextProps;
    // 当传入的type发生变化的时候，更新state
    const arr: any[] | never[] = [];
    // @ts-ignore
    value && value.forEach((n: any) => arr.push(n.label));
    if (value !== prevState.defaultValue) {
      return {
        ...prevState,
        defaultValue: arr.join(','),
      };
    }
    // 否则，对于state不进行任何操作
    return null;
  }

  renderTable = (item: any) => {
    const { tableAttribute } = item;
    const rowSelection = {
      selectedRowKeys: this.state[`${item.id}Selected`] && this.state[`${item.id}Selected`].selectedRowKeys,
      type: tableAttribute.selectType || 'radio',
      onChange: (selectedRowKeys: any, selectedRows: any) => {
        if (tableAttribute.selectType === 'checkbox') {
          let stateSelectRowKeys = this.state[`${item.id}Selected`] ? this.state[`${item.id}Selected`].selectedRowKeys : [];
          let stateSelectRows = this.state[`${item.id}Selected`] ? this.state[`${item.id}Selected`].selectedRows : [];
          const difference = _.difference(selectedRowKeys, stateSelectRowKeys);
          const unDifference = _.difference(stateSelectRowKeys, selectedRowKeys);
          if (difference.length === 0) {
            // 去掉勾选
            // @ts-ignore
            stateSelectRows = stateSelectRows.filter((item: any) => item.id !== unDifference[0]);
          } else {
            selectedRows = selectedRows.filter((item: any) => item.id === difference[0]);
            stateSelectRows.push(selectedRows[0]);
          }
          this.setState({
            [`${item.id}Selected`]: {
              selectedRowKeys,
              selectedRows: stateSelectRows,
            },
          });
        } else if (tableAttribute.selectType === 'radio' || 'checkbox') {
          this.setState({
            [`${item.id}Selected`]: {
              selectedRowKeys,
              selectedRows,
            },
          });
        }
      },
    };
    return (
      <>
        <HehTable
          columns={tableAttribute.columns}
          data={item.tableAttribute.tableData && item.tableAttribute.tableData.data || []}
          tableOptions={{
            loading: tableAttribute.loading,
            rowSelection,
            onRow: (record: any) => {
              return {
                onClick: (event: any) => {
                  if (tableAttribute.selectType === 'checkbox') {
                    let stateSelectRows = this.state[`${item.id}Selected`] ? this.state[`${item.id}Selected`].selectedRows : [];
                    let stateSelectedRowKeys = this.state[`${item.id}Selected`] ? this.state[`${item.id}Selected`].selectedRowKeys : [];
                    const difference = _.difference([record], stateSelectRows);
                    if (difference.length === 0) {
                      // 去掉勾选
                      // @ts-ignore
                      stateSelectRows = stateSelectRows.filter((item: any) => item.id !== record.id);
                    } else {
                      stateSelectRows.push(difference[0]);
                    }
                    if (_.includes(stateSelectedRowKeys, record.id)) {
                      stateSelectedRowKeys = stateSelectedRowKeys.filter((item: any) => item !== record.id);
                    } else {
                      stateSelectedRowKeys.push(record.id);
                    }
                    this.setState({
                      [`${item.id}Selected`]: {
                        selectedRowKeys: stateSelectedRowKeys,
                        selectedRows: stateSelectRows,
                      },
                    });
                  } else if (tableAttribute.selectType === 'radio' || tableAttribute.selectType === undefined) {
                    this.setState({
                      [`${item.id}Selected`]: {
                        selectedRows: [record],
                        selectedRowKeys: [record.id],
                      },
                    });
                  }
                },
              };
            },
          }}
          pageChange={(current, size) => {
            item.tableAttribute.getTableData(current, size);
          }}
        />
      </>
    );
  };
  getSearchValue = (values: any, item: any) => {
    if (values.rangeDate && values.rangeDate.length === 2) {
      values.startDate = formatDateTimeStamp(values.rangeDate[0], 'start');
      values.endDate = formatDateTimeStamp(values.rangeDate[1], 'end');
      delete values.rangeDate;
    }
    item.tableAttribute.getTableData(1, 10, values);
  };
  renderSearchForm = (item: any) => {
    const searchItems = [
      {
        type: 'input',
        label: '用户名',
        id: 'username',
        attribute: {
          placeholder: '请输入用户名',
        },
      },
    ];
    return (
      <SearchForm
        searchItems={searchItems}
        getValue={(values) => this.getSearchValue(values, item)}
      />
    );
  };

  render() {
    const { item } = this.props;
    return (
      <>
        <Modal
          {...item.modalAttribute}
          visible={this.state[`${item.id}Visible`]}
          onCancel={() => this.setState({ [`${item.id}Visible`]: false })}
          onOk={() => {
            this.props.onChange(
              [{ key: this.state[`${item.id}Selected`].selectedRows[0][item.tableAttribute.field.key], label: this.state[`${item.id}Selected`].selectedRows[0][item.tableAttribute.field.value] }],
            );
            this.setState({ [`${item.id}Visible`]: false });
          }}
        >
          <Row gutter={20}>
            <Col span={8}>
              <HehTree
                allExpand={true}
                showSearch={true}
                data={item.treeAttribute.treeData}
                field={item.treeAttribute.field}
                getSelectKeys={item.treeAttribute.onSelect}
                getCheckedKeys={item.treeAttribute.onChecked}
                getSelectNames={item.treeAttribute.getSelectNames}
                getCheckedName={item.treeAttribute.getCheckedKeys}
              />
            </Col>
            <Col span={16}>
              {this.renderSearchForm(item)}
              {this.renderTable(item)}
            </Col>
          </Row>
        </Modal>
        <Input
          className='form-select'
          value={this.state.defaultValue}
          style={{ width: '100%' }}
          addonAfter={(<span style={{ cursor: 'pointer' }} onClick={() => {
            if (item.tableAttribute && item.tableAttribute.tableData && JSON.stringify(item.tableAttribute.tableData) === '{}') {
              item.tableAttribute.getTableData();
            }
            if (item.treeAttribute && item.treeAttribute.treeData && JSON.stringify(item.treeAttribute.treeData) === '[]') {
              item.treeAttribute.getTreeData();
            }
            this.setState({ [`${item.id}Visible`]: true });
          }}>选择人员</span>)}
          {...this.props.attribute}
        >
        </Input>
      </>
    );
  }
}


export default TreeTable;
