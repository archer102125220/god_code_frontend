import React from 'react';

import { Icon } from 'antd';
import { GlobalFooter } from 'ant-design-pro';

class Footer extends React.Component {

  copyright = <div><Icon type="copyright" /> 2019 國立臺中科技大學資訊管理系姜Lab 版權所有</div>;

  render() {
    return (
      <GlobalFooter copyright={this.copyright} />
    );
  }
}

export default Footer;
