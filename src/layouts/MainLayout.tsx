import React, { Component } from 'react';
import { Icon, Layout, Menu, Avatar, Dropdown, Drawer, Select, BackTop, ConfigProvider, Spin } from 'antd';
import _ from 'lodash';
import { connect } from 'dva';
import filter from 'lodash/filter';
import cloneDeep from 'lodash/cloneDeep';
import router from 'umi/router';
import classname from 'classnames';
import zhCN from 'antd/es/locale/zh_CN';
import Scrollbars from 'react-custom-scrollbars';
import Media from 'react-media';
import theme from '@/constants/theme';
import config from '../../config/admin.config';
import HehRouterTabs from '@/components/HehRouterTabs';
import './mainLayout.less';
import 'moment/locale/zh-cn';
import { generateList } from '@/utils/utils';

const { Header, Footer, Sider, Content } = Layout;

interface IMenuItem {
  path: string
  icon: string
  name: string
  id?: string
  children?: Array<any>
}

interface IChildrenItem {
  name: string
  path: string
  icon: string
  id?: string
  children?: Array<any>
}

interface IProps {
  location: {
    pathname: string
  }
  isMobile?: boolean,
  getSiderBarLoading?: boolean,
  global: {
    routerTabs: [],
    sidebarSelectKey: [],
    sidebarOpenKey: [],
    sidebarCloneOpenKey: [],
    siderMenu: [],
    siderModule: [],
  }
  dispatch: any,
  history: any,
}

const siderTheme = theme.siderTheme.trim();
const siderBackground = siderTheme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(0, 21, 41)';
const siderHeaderBackground = siderTheme === 'light' ? '#1890ff' : '#3A4D5B';
const headerBackground = siderTheme === 'light' ? '#1E90FF' : 'rgb(0, 21, 41)';
const headerFontColor = siderTheme === 'light' ? 'rgb(255, 255, 255)' : 'rgb(255, 255, 255)';

const siderBarField = { key: 'permissionUrl', value: 'permissionName', icon: 'iconClass', openKey: 'id' };

function initSelectSearch(menu: []) {
  const arr: any[] = [];
  menu && menu.forEach((item: any) => {
    if (item.children) {
      item.children.forEach((childrenItem: any) => {
        arr.push(childrenItem);
      });
    } else {
      arr.push(item);
    }
  });
  return arr;
}


class MainLayout extends Component<IProps> {
  selectSearchItem: any = [];
  state = {
    collapsed: false,
    openKey: [],
    cloneOpenKey: [],
    selectKey: [],
    drawerVisible: false,
  };

  menu = (
    <Menu>
      <Menu.Item>
        <span
          onClick={() => {
            const xToken = localStorage.getItem('tkey-token');
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = `${process.env.LOGOUT_URL}&token=${xToken}` || '';
          }}
          className='tac'
        >
          退出登录
        </span>
      </Menu.Item>
    </Menu>
  );

  componentDidMount(): void {
    this.initSiderMenu();
    this.initMenuSelect(undefined);
    this.initRouterTabs();
    this.getAllEnum();
    this.getUserInfo();
  }

  getUserInfo = () => {
    if (sessionStorage.getItem('userInfo') !== null) return;
    this.props.dispatch({
      type: 'global/getUserInfoEffect',
    }).then((res: any) => {
      if (res.isSuccess) {
        sessionStorage.setItem('userInfo', JSON.stringify(res.data));
      }
    });
  };

  getAllEnum = () => {
    if (localStorage.getItem('allEnum') !== null) return;

    this.props.dispatch({
      type: 'global/getAllEnum',
    }).then((res: any) => {
      if (res.isSuccess) {
        localStorage.setItem('allEnum', JSON.stringify(res.data));
      }
    });
  };


  static getDerivedStateFromProps(nextProps: Readonly<IProps>) {
    const { isMobile } = nextProps;
    if (isMobile) {
      return {
        collapsed: false,
      };
    }
    return null;
  }

  initSiderMenu = () => {
    if (config.siderBarMenuUrl) {
      this.getSiderMenu(undefined);
    } else {
      this.selectSearchItem = initSelectSearch(this.props.global.siderMenu);
    }
  };

  getSiderMenu = (key: any) => {
    if (sessionStorage.getItem('siderBarMenu') === null) {
      this.props.dispatch({
        type: 'global/getSiderBarMenu',
        payload: { key },
      }).then((res: any): any => {
        if (res) sessionStorage.setItem('siderBarMenu', JSON.stringify(res));
        if (!res) return false;
        if (res && res.length) {
          this.selectSearchItem = initSelectSearch(res);
          this.initMenuSelect(res[0].index);
          this.setState({});
        }
      });
    } else {
      let data = sessionStorage.getItem('siderBarMenu');
      if (data != null) {
        data = JSON.parse(data);
        this.props.dispatch({
          type: 'global/setSiderBarMenu',
          payload: data,
        });
        setTimeout(() => {
          // @ts-ignore
          this.selectSearchItem = initSelectSearch(data);
          // @ts-ignore
          if (data && data.length) {
            // @ts-ignore
            this.initMenuSelect(data[0].index);
            this.setState({});
          }
        }, 100);
      }
    }
  };

  getSiderModule = () => {
    this.props.dispatch({
      type: 'global/getSiderBarModule',
    }).then((res: any) => {
      this.props.dispatch({
        type: 'global/setSiderModule',
        payload: res,
      });
    });
  };

  recursion = (arr: Array<IMenuItem>, pathname: string, parentKey?: string) => {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (item.path === pathname) {
        this.props.dispatch({
          type: 'global/setSidebarSelectKey',
          payload: [item.path],
        });
        this.props.dispatch({
          type: 'global/setSidebarOpenKey',
          payload: [parentKey] || [],
        });
        this.props.dispatch({
          type: 'global/setSidebarCloneOpenKey',
          payload: [parentKey] || [],
        });
        break;
      }
      if (item.children) {
        this.recursion(item.children, pathname, item.path);
      }
    }
  };

  initRouterTabs = () => {
    let initRouterTabs = localStorage.getItem('routerTabs');
    if (initRouterTabs === null) return;
    initRouterTabs = JSON.parse(initRouterTabs);
    this.props.dispatch({
      type: 'global/setRouterTabs',
      payload: initRouterTabs,
    });
  };

  getCurrentSelectItem = (path: any) => {
    const { global: { siderMenu } } = this.props;
    let newSiderBarMenu = _.cloneDeep(siderMenu);
    // @ts-ignore
    newSiderBarMenu = generateList(newSiderBarMenu);
    let currentItem: any = {};
    newSiderBarMenu.forEach((item: any) => {
      if (item[siderBarField.key] === path) {
        currentItem = item;
      }
    });
    return currentItem;
  };

  initMenuSelect = (path: any) => {
    const pathname = path ? path : this.props.location.pathname;
    const { global: { siderMenu } } = this.props;
    let newSiderBarMenu = _.cloneDeep(siderMenu);
    // @ts-ignore
    newSiderBarMenu = generateList(newSiderBarMenu);
    newSiderBarMenu.forEach(((item: any) => {
      if (item[siderBarField.key] === pathname) {
        let openkey = item.parentIds.split(',');
        openkey.splice(0, 1);
        this.props.dispatch({
          type: 'global/setSidebarOpenKey',
          payload: openkey,
        });
        this.props.dispatch({
          type: 'global/setSidebarSelectKey',
          payload: [item.permissionUrl],
        });
      }
    }));
  };

  onCollapse = (collapsed: boolean) => {
    if (collapsed) {
      this.props.dispatch({
        type: 'global/setSidebarOpenKey',
        payload: [],
      });
      this.setState({
        collapsed,
      });
    } else {
      this.props.dispatch({
        type: 'global/setSidebarOpenKey',
        payload: this.props.global.sidebarCloneOpenKey,
      });
      this.setState({
        collapsed,
      });
    }
  };

  addRouterTabs = (e: React.SyntheticEvent, name: string, path: string) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const { routerTabs } = this.props.global;
    let newRouterTabs = cloneDeep(routerTabs);
    // @ts-ignore
    newRouterTabs.push({ name, path });
    this.props.dispatch({
      type: 'global/setRouterTabs',
      payload: newRouterTabs,
    });
  };

  reduceRouterTabs = (e: React.SyntheticEvent, path: string) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const { routerTabs } = this.props.global;
    let newRouterTabs = cloneDeep(routerTabs);
    // @ts-ignore
    newRouterTabs = filter(newRouterTabs, (n: any) => {
      return n.path !== path;
    });
    this.props.dispatch({
      type: 'global/setRouterTabs',
      payload: newRouterTabs,
    });
  };

  renderMenuItem = (item: IMenuItem) => {
    return (
      <Menu.Item key={item[siderBarField.key] || item.id} className='icon-pushpin-parent'>
        <Icon type={item[siderBarField.icon] || item.icon}/>
        <span>{item[siderBarField.value || item.name]}</span>
        {
          this.isIncludes(item[siderBarField.key] || item.path) ?
            <Icon
              className='icon-pushpin'
              type="pushpin"
              rotate={-45}
              onClick={(e) => this.reduceRouterTabs(e, item[siderBarField.key] || item.path)}
            />
            :
            <Icon
              className='icon-pushpin'
              type="pushpin"
              onClick={(e) => this.addRouterTabs(e, item[siderBarField.value] || item.name, item[siderBarField.key] || item.path)}
            />
        }
      </Menu.Item>
    );
  };

  renderSubMenuItem = (item: IChildrenItem) => {
    return (
      <Menu.SubMenu
        key={item[siderBarField.openKey] || item.id}
        title={
          <span>
            <Icon type={item[siderBarField.icon] || item.icon}/>
            <span>{item[siderBarField.value] || item.name}</span>
          </span>
        }
      >
        {
          item.children && item.children.map((childrenItem: IChildrenItem) => (
            childrenItem.children ? this.renderSubMenuItem(childrenItem) : (
              <Menu.Item
                key={childrenItem[siderBarField.key] || childrenItem.path || childrenItem.id}
                className='icon-pushpin-parent'
              >
                <Icon type={childrenItem[siderBarField.icon] || childrenItem.icon}/>
                {childrenItem[siderBarField.value] || childrenItem.name}
                {
                  this.isIncludes(childrenItem[siderBarField.key] || childrenItem.path) ?
                    <Icon
                      className='icon-pushpin'
                      type="pushpin"
                      rotate={-45}
                      style={{ zIndex: 999 }}
                      onClick={(e) => this.reduceRouterTabs(e, childrenItem.path || childrenItem[siderBarField.key])}
                    />
                    :
                    <Icon
                      className='icon-pushpin'
                      type="pushpin"
                      onClick={(e) => this.addRouterTabs(e, childrenItem.name || childrenItem[siderBarField.value], childrenItem.path || childrenItem[siderBarField.key])}
                    />
                }
              </Menu.Item>
            )
          ))
        }
      </Menu.SubMenu>
    );
  };

  isIncludes = (path: string) => {
    const { routerTabs } = this.props.global;
    let arr = routerTabs.filter((n: any) => {
      return n.path === path;
    });
    return arr.length !== 0;
  };

  menuSelect = ({ key }: any) => {
    const current = this.getCurrentSelectItem(key);
    if (current && current.boolNewTabEnum === 1) {
      window.open(current.permissionUrl);
    } else if (current && current.boolExtLinkEnum === 1) {
      router.push(`/iframe?url=${current.permissionUrl}`);
    } else {
      router.push(key);
    }

    this.props.dispatch({
      type: 'global/setCurrentPath',
      payload: key,
    });
    this.props.dispatch({
      type: 'global/setSidebarSelectKey',
      payload: [key],
    });
  };

  menuOpen = (openKey: string[]) => {
    this.props.dispatch({
      type: 'global/setSidebarOpenKey',
      payload: openKey,
    });
    this.props.dispatch({
      type: 'global/setSidebarCloneOpenKey',
      payload: openKey,
    });
  };

  renderSider = () => {
    const { collapsed } = this.state;
    const { isMobile, global: { siderMenu, sidebarOpenKey, sidebarSelectKey } } = this.props;
    const recursiveRenderMenu = () => {
      return siderMenu && siderMenu.map((item: any) => {
        return (
          !item.children
            ? this.renderMenuItem(item)
            : this.renderSubMenuItem(item)
        );
      });
    };

    return (
      <Sider
        trigger={null}
        breakpoint="lg"
        collapsible={true}
        collapsed={isMobile ? false : collapsed}
        style={{ background: siderBackground, boxShadow: '2px 0 6px rgba(0,21,41,.15)' }}
        width={200}
        className={
          classname(
            siderTheme === 'light' ? 'light_collapsed_icon' : '',
            'base_sider',
            isMobile ? 'mobile-sider' : '',
          )
        }
        onCollapse={this.onCollapse}
      >
        <div className='sider_icon_wrapper'>
          <div
            style={{ backgroundColor: siderHeaderBackground }}
            className={classname(isMobile ? 'logo_open' : !collapsed ? 'logo_open' : 'logo_close')}
          >
            {
              isMobile
                ? process.env.SYSTEM_TITLE_OPEN
                : !collapsed
                ? process.env.SYSTEM_TITLE_OPEN
                : process.env.SYSTEM_TITLE_CLOSE
            }
          </div>
        </div>
        <Spin
          tip='读取菜单中...'
          style={{ minHeight: 400 }}
          spinning={this.props.getSiderBarLoading || false}
        >
          <Menu
            onClick={this.menuSelect}
            onOpenChange={this.menuOpen}
            theme={theme.siderTheme}
            openKeys={sidebarOpenKey}
            selectedKeys={sidebarSelectKey}
            mode="inline"
          >
            {recursiveRenderMenu()}
          </Menu>
        </Spin>
      </Sider>
    );
  };

  toggleSiderMenu = (data: any) => {
    if (config.siderBarMenuUrl) {
      this.getSiderMenu(data.key);
      this.setState({ drawerVisible: false });
    } else {
      this.selectSearchItem = initSelectSearch(this.props.global.siderMenu);
    }
  };

  renderDrawer = () => {
    const { global: { siderModule } } = this.props;
    return (
      <Drawer
        title="切换模块"
        placement="left"
        closable={false}
        onClose={() => {
          this.setState({ drawerVisible: false });
        }}
        visible={this.state.drawerVisible}
      >
        <Menu
          mode="inline"
          style={{ height: '100%', borderRight: 0 }}
        >
          {
            siderModule && siderModule.map((item: any) => {
              return (
                <Menu.Item onClick={this.toggleSiderMenu} key={item.key}>
                  <Icon type={item.icon}/>
                  <span>{item.name}</span>
                </Menu.Item>
              );
            })
          }
        </Menu>
      </Drawer>
    );
  };

  render() {
    const { collapsed } = this.state;
    const { isMobile } = this.props;
    // @ts-ignore
    let userInfo = sessionStorage.getItem('userInfo');
    if (userInfo !== null) {
      // @ts-ignore
      userInfo = JSON.parse(userInfo);
    } else {
      // @ts-ignore
      userInfo = {};
    }

    return (
      <Scrollbars>
        <BackTop/>
        <Layout className='mh100'>
          {
            !isMobile
              ? this.renderSider()
              :
              <Drawer
                closable={false}
                visible={collapsed}
                width={200}
                placement="left"
                onClose={() => this.onCollapse(false)}
                style={{
                  padding: 0,
                  height: '100vh',
                }}
              >
                {this.renderSider()}
              </Drawer>
          }
          {/*{this.renderDrawer()}*/}
          <Layout>
            <Header className='pdlr20' style={{ background: headerBackground }}>
              <div className='header_wrapper'>
              <span style={{ fontSize: 20 }} className='pr20'>
                 {/*<Icon*/}
                {/*  onClick={() => this.setState({ drawerVisible: true })}*/}
                {/*  style={{ cursor: 'pointer', color: '#fff', marginRight: 10 }}*/}
                {/*  type='swap'*/}
                {/*/>*/}
                <Icon
                  onClick={() => this.onCollapse(!collapsed)}
                  style={{ cursor: 'pointer', color: '#fff' }}
                  type={collapsed ? 'menu-unfold' : 'menu-fold'}
                />
              </span>

                <div className='header_menu_wrapper'>
                  <Select
                    value='请输入搜索侧边栏'
                    onSelect={(value: any, option: any) => router.push(option.key)}
                    showSearch={true}
                    style={{ width: 249, color: '#999' }}
                    optionFilterProp="value"
                    filterOption={(input: any, option: any) =>
                      option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {
                      this.selectSearchItem.map((item: any) => (
                        <Select.Option key={item.path || item[siderBarField.key]} value={item.name || item[siderBarField.value]}>
                          <Icon type={item.icon || item[siderBarField.icon]}/><span className='ml10' style={{ marginBottom: 0 }}>{item.name || item[siderBarField.value]}</span>
                          <p style={{ marginBottom: 0 }}>{item.path || item[siderBarField.key]}</p>
                        </Select.Option>
                      ))
                    }
                  </Select>
                </div>
                <Dropdown overlay={this.menu} trigger={['click']}>
                  <div className='header_userIcon_wrapper'>
                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>U</Avatar>
                    <span style={{ color: headerFontColor }} className='username'>{(userInfo && userInfo['username'])}</span>
                  </div>
                </Dropdown>
              </div>
            </Header>
            <Content>
              <div>
                <HehRouterTabs/>
                <ConfigProvider locale={zhCN}>
                  {this.props.children}
                </ConfigProvider>
              </div>
            </Content>
            <Footer className='tac footer'>https://github.com/cdk8s</Footer>
          </Layout>
        </Layout>
      </Scrollbars>
    );
  }
}

export default connect(({ global, loading }: any) => ({
  global,
  getSiderBarLoading: loading.effects['global/getSiderBarMenu'],
}))((props: IProps) => (
  <Media query="(max-width: 599px)">
    {isMobile => {
      return (
        <MainLayout {...props} isMobile={isMobile}/>
      );
    }}
  </Media>
));

