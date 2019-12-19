import React, { Component } from 'react';
import { Card, Divider } from 'antd';

class Index extends Component {
  constructor(props: any) {
    super(props);

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div style={{ margin: 20 }}>
        <Card>
          <div style={{ textAlign: 'left' }}>
            <iframe
              src="//player.bilibili.com/player.html?aid=79864146&cid=136683412&page=1"
              scrolling="no"
              frameBorder="no"
              width={500}
              height={500}
            />
          </div>
          <div style={{ marginTop: 20 }}>
            <Divider/>
            <h1>欢迎使用</h1>
            <ul>
              <li>代码生成器本质是规范的抽象，需要团队管理的加持才能最有最大效益</li>
              <li>所以，视频前面 18 分钟是讲管理思维与代码生成器的关系，18:50 之后是具体 CURD 演示</li>
              <li>对管理思维没有任何想法的可以直接快进到 18:50</li>
            </ul>
          </div>
          <div style={{ marginTop: 20 }}>
            <Divider/>
            <h1>联系方式</h1>
            <ul>
              <li>CDK8S：<a href="http://cdk8s.com" target="_blank">http://cdk8s.com</a></li>
              <li>Github：<a href="https://github.com/cdk8s" target="_blank">https://github.com/cdk8s</a></li>
              <li>Gitee：<a href="https://gitee.com/cdk8s" target="_blank">https://gitee.com/cdk8s</a></li>
              <li>bilibili：<a href="https://space.bilibili.com/15713069" target="_blank">https://space.bilibili.com/15713069</a></li>
              <li>邮箱：<a target="_blank" href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=1baxvu2mlaSk_7a6uA">cdk8s#qq.com</a></li>
              <li>圈主微信：<a href="http://img.gitnavi.com/markdown/judasn-weixin-qr.jpeg" target="_blank">judasn</a></li>
              <li>微信公众号：<a href="http://img.gitnavi.com/markdown/cdk8s_qr_300px.png" target="_blank">cd-k8s</a></li>
            </ul>
          </div>
          <div style={{ marginTop: 20 }}>
            <Divider/>
            <h1>Sculptor Boot 生态</h1>
            <ol>
              <li>后续的所有业务型项目都是会基于此基础</li>
              <li>2020 年 1 月中会发布基于此生态的 CMS 业务类型系统</li>
              <li>TKey：<a href="https://github.com/cdk8s/tkey" target="_blank">Github</a>、<a href="https://gitee.com/cdk8s/tkey" target="_blank">Gitee</a></li>
              <li>sculptor-boot-generator：<a href="https://github.com/cdk8s/sculptor-boot-generator" target="_blank">Github</a>、<a href="https://gitee.com/cdk8s/sculptor-boot-generator" target="_blank">Gitee</a></li>
              <li>sculptor-boot-backend：<a href="https://github.com/cdk8s/sculptor-boot-backend" target="_blank">Github</a>、<a href="https://gitee.com/cdk8s/sculptor-boot-backend" target="_blank">Gitee</a></li>
              <li>sculptor-boot-frontend：<a href="https://github.com/cdk8s/sculptor-boot-frontend" target="_blank">Github</a>、<a href="https://gitee.com/cdk8s/sculptor-boot-frontend" target="_blank">Gitee</a></li>
              <li>sculptor-boot-test：<a href="https://github.com/cdk8s/sculptor-boot-test" target="_blank">Github</a>、<a href="https://gitee.com/cdk8s/sculptor-boot-test" target="_blank">Gitee</a></li>
              <li>sculptor-boot-docs：<a href="https://github.com/cdk8s/sculptor-boot-docs" target="_blank">Github</a>、<a href="https://gitee.com/cdk8s/sculptor-boot-docs" target="_blank">Gitee</a></li>
            </ol>
          </div>
          <div style={{ marginTop: 20 }}>
            <Divider/>
            <h1>Grafana</h1>
            <ol>
              <li>账号：demo</li>
              <li>密码：123456</li>
            </ol>
          </div>
          <div style={{ marginTop: 20 }}>
            <Divider/>
            <h1>Druid Dashboard</h1>
            <ol>
              <li>账号：admin</li>
              <li>密码：123456</li>
            </ol>
          </div>
        </Card>
      </div>
    );
  }
}

export default Index;
