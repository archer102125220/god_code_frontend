import React from 'react';

import styles from './Logo.css';

import logo from '@/assets/logo.png';

class Logo extends React.Component {
  render() {
    return (
      <div className={styles.logo}>
        <img src={logo} style={{ width: 184 }} alt="Logo" {...this.props} />
      </div>
    )
  }
}

export default Logo;
