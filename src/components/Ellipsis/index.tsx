import React, { Component } from 'react';
import { Icon } from 'antd';

class Index extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    const { text } = this.props;

    const setWidth = (dom: any): any => {
      const width = document.body.clientWidth - 200;
      const domWidth = dom && dom.getElementsByTagName('div')[2].scrollWidth;
      const positionX = dom && dom.getBoundingClientRect().x;
      if (width + 200 - positionX < domWidth) {
        return width + 100 - positionX;
      }

      if (domWidth > width) {
        return width ? width - 150 : 0;
      } else {
        return domWidth ? domWidth + 22 : 0;
      }
    };

    return (
      <div
        style={{
          position: 'relative',
        }}
        onMouseEnter={() => {
          const scrollWidth = this[`${text}`].getElementsByTagName('div')[2].scrollWidth;
          const width = this[`${text}`].offsetWidth;
          if (scrollWidth > parseInt(width, 10)) {
            this[`${text}`].getElementsByTagName('div')[0].className = 'db';
          }
        }}
        onMouseLeave={() => {
          this[`${text}`].getElementsByTagName('div')[0].className = 'dn';
        }}
        ref={(dom) => {
          this[`${text}`] = dom;
        }}
      >
        <div
          className={'dn'}
          onClick={() => {
            this[`${text}`].getElementsByTagName('div')[1].className = 'db';
          }}
          style={{
            cursor: 'pointer',
            marginTop: '-12px',
            position: 'absolute',
            right: -6,
            background: '#fff',
            boxShadow: '0px 0px 4px Rgba(0,0,0,0.3)',
            width: 20,
            height: 45,
            textAlign: 'center',
            lineHeight: '46px',
          }}>
          <Icon type='down' style={{ fontSize: 16, fontWeight: 'bold' }}/>
        </div>
        <div
          className='dn'
          style={{
            position: 'absolute',
            top: '-8px',
            left: '-6px',
            background: '#FFF',
            whiteSpace: 'normal',
            wordBreak: 'break-all',
            margin: 0,
            boxShadow: '0 1px 6px rgba(0,0,0,.12)',
            padding: '8px 10px',
            width: setWidth(this[`${text}`]),
            borderRadius: 5,
            zIndex: 999,
          }}
        >
          <span
            style={{
              fontSize: 30,
              color: 'red',
              position: 'absolute',
              top: '-15px',
              right: '-15px',
              cursor: 'pointer',
              width: 30,
              height: 30,
              background: '#fff',
              borderRadius: '50%',
            }}
            onClick={() => {
              this[`${text}`].getElementsByTagName('div')[1].className = 'dn';
            }}
          >
              <Icon style={{ position: 'absolute' }} type="close-circle"/>
          </span>
          <span>{text}</span>
        </div>
        <div
          className={'text'}
          style={{
            overflow: 'hidden',/*超出部分隐藏*/
            textOverflow: 'ellipsis',/* 超出部分显示省略号 */
            whiteSpace: 'nowrap',/*规定段落中的文本不进行换行 */
            margin: 0,
          }}
        >
          {text}
        </div>
      </div>
    );
  }
}


export default Index;
