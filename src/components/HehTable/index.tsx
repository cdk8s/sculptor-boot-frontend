import React, { Fragment } from 'react';
import { Pagination, Table, Row, Col } from 'antd';
import _ from 'lodash';
import Ellipsis from '@/components/Ellipsis';
import { IProps } from './typings';
import './index.less';

export default function(props: IProps<[]>) {
  const { data, tableOptions, pageChange, getSelectedRowKeys, selectedRowKeys, adaptation, selectType = 'checkbox' } = props;
  let { columns } = props;
  const rowSelection = {
    type: selectType,
    selectedRowKeys,
    onChange: getSelectedRowKeys,
  };
  const width = document.body.clientWidth;

  function setWidth() {
    if (adaptation && adaptation.scroll.x) {
      if (width < adaptation.scroll.x) {
        if (adaptation.fixed) {
          for (let i in adaptation.fixed) {
            columns.forEach((item: any) => {
              if (item.dataIndex === i) {
                item.fixed = adaptation.fixed[i].fixed;
                item.width = adaptation.fixed[i].width;
              }
            });
          }
        }
        return adaptation.scroll;
      }
    }
    return {};
  }


  columns.forEach((item: any) => {
    item.ellipsis = true;
    item.render = (text: any, record: any, index: any) => {
      return (
        <Ellipsis
          text={_.isFunction(item.hehRender) ? item.hehRender(text, record, index) : text}
        />
      );
    };
  });

  return (
    <Fragment>
      <Table
        className={'hehTable'}
        scroll={data && data.list && data.list.length > 0 ? setWidth() : {}}
        rowSelection={getSelectedRowKeys ? rowSelection : undefined}
        dataSource={data && data.list || []}
        columns={columns}
        pagination={false}
        rowKey={(record: any) => {
          if (record.id) return record.id;
          if (record.key) return record.key;
        }}
        {...tableOptions}
      />
      <Row style={{ padding: 10 }}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Pagination
            onChange={pageChange ? (current, size) => pageChange(current, size) : undefined}
            onShowSizeChange={pageChange ? (current, size) => pageChange(current, size) : undefined}
            hideOnSinglePage={true}
            showQuickJumper={true}
            showSizeChanger={true}
            defaultCurrent={data && data.currentPage}
            total={data && data.total}
            showTotal={(total, range) => `${range[0]}-${range[1]} 共 ${total} 条`}
          />
        </Col>
      </Row>
    </Fragment>
  );
}

