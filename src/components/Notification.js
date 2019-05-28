import _ from 'lodash';
import { notification } from 'antd';

// 通知的全域設定
const GlobalConfig = {

};

// 個別設定
const BaseConfig = {
  success: {
    style: {
      border: '1px solid #b7eb8f',
      backgroundColor: '#f6ffed',
    },
  },
  info: {
    style: {
      border: '1px solid #91d5ff',
      backgroundColor: '#e6f7ff',
    },
  },
  warning: {
    style: {
      border: '1px solid #ffe58f',
      backgroundColor: '#fffbe6',
    },
  },
  error: {
    style: {
      border: '1px solid #ffa39e',
      backgroundColor: '#fff1f0',
    },
  }
};

function generateNotification(noticeType) {
  return (extendConfig) => {
    const config = _.extend(GlobalConfig, _.get(BaseConfig, noticeType, {}));
    _.invoke(notification, noticeType, _.extend(config, extendConfig));
  }
}

export default {
  ...notification,
  success: generateNotification('success'),
  info: generateNotification('info'),
  warning: generateNotification('warning'),
  warn: generateNotification('warning'),
  error: generateNotification('error'),
}
