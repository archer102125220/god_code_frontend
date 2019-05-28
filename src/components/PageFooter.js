import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

import { FooterToolbar as AntdProFooterToolbar } from 'ant-design-pro';

import styles from './PageFooter.css';

class PageFooter extends React.Component {
   

    render() {
        const {action} = this.props;
        return (
            <div className={[styles.footer]}>
                <div className={[styles.action]}>
                    {action}
                </div>
            </div>
        )
    }
}

export default PageFooter