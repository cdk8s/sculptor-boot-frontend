import React, { Component } from 'react';
import { getQueryVariable } from '@/utils/utils';

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
    const url = getQueryVariable('url');
    return (
      <div className="iframe-container">
        <iframe
          style={{ minHeight: `calc(100vh - 64px)` }}
          src={url}
          width="100%"
          height="100%"
        ></iframe>
      </div>
    );
  }
}

export default Index;
