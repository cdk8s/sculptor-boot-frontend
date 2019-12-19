import React, { useState, useEffect } from 'react';
import { Alert, Icon, Input, Tree, Dropdown, Button, Menu, Spin } from 'antd';
import _ from 'lodash';
import './index.less';

const { TreeNode, DirectoryTree } = Tree;

// @ts-ignore
const getParentKey = (key: any, tree: any, field: any) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: any) => {
        return key === item.id;
      })) {
        parentKey = node.id;
      } else if (getParentKey(key, node.children, field)) {
        parentKey = getParentKey(key, node.children, field);
      }
    }
  }
  return parentKey;
};

const dataList: any[] | never[] = [];

export default (props: any) => {
  const {
    data = [],
    field = {},
    allExpand = false,
    checkable = false,
    selectable = true,
    propsCheckStrictlyBtn = true,
    propsCheckStrictly = true,
    getSelectKeys,
    getCheckedKeys,
    attribute = {},
    getSelectNames,
    getCheckedNames,
    setCheckedPropsKeys,
    setSelectedPropsKeys,
    showInfo,
    showSearch,
    showOperation,
    scrollHeight = 700,
    loading = false,
    clearSelected = 0,
    clearChecked = 0,
  } = props;
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedNames, setSelectedNames] = useState([]);
  const [checkedNames, setCheckedNames] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(false);
  const [checkStrictly, setCheckStrictly] = useState(true);
  const generateList = (treeData: any) => {
    for (let i = 0; i < treeData.length; i++) {
      const node = treeData[i];
      // @ts-ignore
      dataList.push(node);
      if (node.children) {
        generateList(node.children);
      }
    }
  };

  useEffect(() => {
    setCheckedKeys(setCheckedPropsKeys);
  }, [setCheckedPropsKeys]);

  useEffect(() => {
    setCheckStrictly(!propsCheckStrictly);
  }, [propsCheckStrictly]);

  useEffect(() => {
    setSelectedKeys(setSelectedPropsKeys);
  }, [setSelectedPropsKeys]);

  useEffect(() => {
    generateList(data);
    if (allExpand && data.length !== 0) expandedAll();
  }, [data]);

  useEffect(() => {
    setSelectedKeys([]);
    setSelectedNames([]);
  }, [clearSelected]);

  useEffect(() => {
    setCheckedKeys([]);
    setCheckedNames([]);
  }, [clearChecked]);

  const onExpand = (expandedKeys: any) => {
    expandedKeys = _.uniq(expandedKeys);
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeys: any, info?: any) => {
    if (checkStrictly) {
      let nameArr: any[] | never[] | ((prevState: never[]) => never[]) = [];
      info.checkedNodes.forEach((n: any) => {
        // @ts-ignore
        nameArr.push(n.props.title.props.children[2]);
      });
      nameArr = _.uniq(nameArr);
      checkedKeys.checked = _.uniq(checkedKeys.checked);
      // @ts-ignore
      setCheckedNames(nameArr);
      getCheckedNames && getCheckedNames(nameArr);
      getCheckedKeys && getCheckedKeys(checkedKeys.checked);
      setCheckedKeys(checkedKeys.checked);
    } else {
      let nameArr: any[] | never[] | ((prevState: never[]) => never[]) = [];
      info.checkedNodes.forEach((n: any) => {
        // @ts-ignore
        nameArr.push(n.props.title.props.children[2]);
      });
      nameArr = _.uniq(nameArr);
      checkedKeys = _.uniq(checkedKeys);
      // @ts-ignore
      setCheckedNames(nameArr);
      getCheckedNames && getCheckedNames(nameArr);
      getCheckedKeys && getCheckedKeys(checkedKeys);
      setCheckedKeys(checkedKeys);
    }

  };

  const onSelect = (selectedKeys: any, info: any) => {
    let nameArr: any[] | never[] | ((prevState: never[]) => never[]) = [];
    info.selectedNodes.forEach((n: any) => {
      // @ts-ignore
      nameArr.push(n.props.title.props.children[2]);
    });
    nameArr = _.uniq(nameArr);
    selectedKeys = _.uniq(selectedKeys);
    // @ts-ignore
    setSelectedNames(nameArr);
    getSelectNames && getSelectNames(nameArr);
    getSelectKeys && getSelectKeys(selectedKeys);
    setSelectedKeys(selectedKeys);
  };

  const onChange = (e: any) => {
    const { value } = e.target;
    // @ts-ignore
    const expandedKeys = dataList
      .map((item: any) => {
        if ((item.title || item[field.title]) && (item.title || item[field.title]).indexOf(value) > -1) {
          return getParentKey(item.id, data, field);
        }
        return null;
      })
      .filter((item: any, i: any, self: any) => item && self.indexOf(item) === i);
    setSearchValue(value);
    // @ts-ignore
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(true);
  };

  const loop = (data: any) =>
    data.map((item: any) => {
      const index = item.title || (item[field.title] && item[field.title].indexOf(searchValue));
      const beforeStr = item.title || (item[field.title] && item[field.title].substr(0, index));
      const afterStr = item.title || (item[field.title] && item[field.title].substr(index + searchValue.length));
      const title =
        index > -1 ? (
          <span>
              {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
            </span>
        ) : (
          <span>{item.title || item[field.title]}</span>
        );
      if (item.children) {
        return (
          <TreeNode key={item['id' || field.id]} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode isLeaf key={item['id' || field.id]} title={title}/>;
    });
  let message;
  if (showInfo && showInfo.showSelectedNames && !showInfo.showCheckedNames) {
    message = <span>当前已选择 <span style={{ color: '#1E90FF' }}>{selectedNames.length === 0 ? '空' : selectedNames.join(',')}</span></span>;
  } else if (showInfo && !showInfo.showSelectedNames && showInfo.showCheckedNames) {
    message = <span>当前已勾选 <span style={{ color: '#1E90FF' }}>{checkedNames.length === 0 ? '空' : checkedNames.join(',')}</span></span>;
  } else if (showInfo && showInfo.showSelectedNames && showInfo.showCheckedNames) {
    message = <span>当前已选择 <span style={{ color: '#1E90FF' }}>{selectedNames.length === 0 ? '空' : selectedNames.join(',')}</span>, 当前已勾选 <span style={{ color: '#1E90FF' }}>{checkedNames.length === 0 ? '空' : checkedNames.join(',')}</span> </span>;
  }

  function expandedAll() {
    // @ts-ignore
    const arr = [];
    dataList.forEach((n: any) => {
      if (n.children) arr.push(n.id || n[field.id]);
    });
    // @ts-ignore
    setExpandedKeys(arr);
  }

  function mergeAll() {
    setExpandedKeys([]);
  }

  function checkAll() {
    // @ts-ignore
    let arr = [];
    // @ts-ignore
    let arrName = [];
    dataList.forEach((n: any) => {
      arr.push(n.id || n[field.id]);
      arrName.push(n.title || n[field.title]);
    });
    // @ts-ignore
    arr = _.uniq(arr);
    // @ts-ignore
    arrName = _.uniq(arrName);
    // @ts-ignore
    setCheckedNames(arrName);
    // @ts-ignore
    getCheckedNames && getCheckedNames(arrName);
    // @ts-ignore
    getCheckedKeys && getCheckedKeys(arr);
    // @ts-ignore
    setCheckedKeys(arr);

  }

  function unCheckAll() {
    // @ts-ignore
    setCheckedNames([]);
    // @ts-ignore
    getCheckedNames && getCheckedNames([]);
    // @ts-ignore
    getCheckedKeys && getCheckedKeys([]);
    // @ts-ignore
    setCheckedKeys([]);
  }

  function expandTopLevelItem() {
    let expandArr: any[] = [];
    dataList && dataList.forEach((item: any) => {
      const parentIds = item.parentIds.split(',');
      if (parentIds.length === 1) {
        expandArr.push(item.id);
      }
    });
    // @ts-ignore
    setExpandedKeys(expandArr);
  }

  function expandSecondLevelItem() {
    let expandArr: any[] = [];
    dataList && dataList.forEach((item: any) => {
      const parentIds = item.parentIds.split(',');
      if (parentIds.length === 2 || parentIds.length === 1) {
        expandArr.push(item.id);
      }
    });
    // @ts-ignore
    setExpandedKeys(expandArr);
  }

  function handleMenuClick(e: any) {
    switch (e.key) {
      case '1' :
        expandedAll();
        break;
      case '2' :
        mergeAll();
        break;
      case '3' :
        checkAll();
        break;
      case '4' :
        unCheckAll();
        break;
      case '5' :
        expandTopLevelItem();
        break;
      case '6' :
        expandSecondLevelItem();
        break;
      case '7' :
        openRelation();
        break;
      case '8' :
        closeRelation();
        break;
      default:
        break;
    }
  }

  const openRelation = () => {
    setCheckStrictly(false);
  };

  const closeRelation = () => {
    setCheckStrictly(true);
  };

  const menu = () => {
    let menuData = [
      { key: '2', name: '全部折叠' },
      { key: '1', name: '全部展开' },
      { key: '5', name: '展开一级' },
      { key: '6', name: '展开二级' },
      { key: '3', name: '全部勾选' },
      { key: '4', name: '取消全选' },
      { key: '7', name: '开启父子关联' },
      { key: '8', name: '关闭父子关联' },
    ];
    if (!checkable) menuData = menuData.slice(0, 4);
    if (!propsCheckStrictlyBtn) menuData = menuData.slice(0, 6);
    return (
      <Menu onClick={handleMenuClick}>
        {
          menuData && menuData.map((item: any) => (
            <Menu.Item key={item.key}>
              {item.name}
            </Menu.Item>
          ))
        }
      </Menu>
    );
  };

  return (
    <div>
      {showInfo !== undefined && <Alert style={{ marginTop: 8 }} message={message} type="info"/>}

      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', marginTop: 5 }}>
        {
          showOperation && (
            <div style={{ order: 1, marginRight: 5 }}>
              <Dropdown overlay={menu}>
                <Button>
                  树操作 <Icon type="down"/>
                </Button>
              </Dropdown>
            </div>
          )
        }
        {
          showSearch && (
            <div style={{ order: 2, flex: 1 }}>
              <Input.Search style={{ marginTop: 8, marginBottom: 5, margin: 0 }} placeholder="搜索" onChange={onChange}/>
            </div>
          )
        }
      </div>
      <Spin spinning={loading}>
        <div className='heh-Tree' style={{ minHeight: 100, maxHeight: scrollHeight, overflow: 'auto' }}>
          {
            _.isArray(data) && data.length !== 0 && (
              <DirectoryTree
                {...attribute}
                checkStrictly={checkStrictly}
                checkable={checkable}
                selectable={selectable}
                autoExpandParent={autoExpandParent}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                onSelect={onSelect}
                selectedKeys={selectedKeys}
                expandAction='doubleClick'
              >
                {_.isArray(data) && data.length !== 0 && loop(data)}
              </DirectoryTree>
            )
          }

        </div>
      </Spin>
    </div>
  );
}
