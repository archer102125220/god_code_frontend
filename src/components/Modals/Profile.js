import _ from 'lodash';
import React from 'react';

import { connect } from 'dva';

import {
  Modal,
  Tabs,
  Button,
  Spin,
} from 'antd';

import ProfileForm from '@/components/Form/Profile';
import ChangePasswordForm from '@/components/Form/ChangePassword';

const TAB_PROFILE = 'TAB_PROFILE';
const TAB_CHANGE_PASSWORD = 'TAB_CHANGE_PASSWORD';

@connect((state) => ({
  visible: _.get(state, `modals.${Profile.NAME}.visible`, false),
  user: _.get(state, 'auth.user', {}),
  loading: _.get(state, 'loading.effects.auth/POST_profile', false),
}))
class Profile extends React.Component{
  static NAME = 'Profile';

  state = {
    currentTabKey: TAB_PROFILE,
  }

  close = () => {
    _.invoke(this, 'changePasswordForm.resetFields');
    _.invoke(this, 'profileForm.resetFields');

    setTimeout(() => {
      this.setState({
        currentTabKey: TAB_PROFILE,
      });
    }, 100);

    this.props.dispatch({
      type: 'modals/HIDE',
      key: Profile.NAME,
    });
  }

  handleOk = () => {
    const {
      currentTabKey,
    } = this.state;
    const form = (currentTabKey === TAB_PROFILE) ? this.profileForm : this.changePasswordForm;
    if(_.has(form, 'validateFields')){
      form.validateFields((err, values) => {
        if(err) return err;
        this.props.dispatch({
          type: 'auth/POST_profile',
          payload: values,
        });
      });
    }
  }

  handleCancel = () => {
    this.close();
  }

  handleTabChange = (key) => {
    this.setState({
      currentTabKey: key,
    });
  }

  renderFooter = () => {
    const { loading } = this.props;
    return (
      <Button
        key="ok"
        type="primary"
        onClick={this.handleOk}
        loading={loading}
      >
        儲存
      </Button>
    );
  }

  render() {
    const { visible, user, loading } = this.props;
    return (
      <Modal
        title="設置"
        visible={visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={760}
        closable={!loading}
        maskClosable={!loading}
        footer={this.renderFooter()}
      >
        <Spin tip="儲存中" spinning={loading}>
          <Tabs
            activeKey={this.state.currentTabKey}
            tabPosition="left"
            onChange={this.handleTabChange}
          >
            <Tabs.TabPane tab="個人資料" key={TAB_PROFILE} >
              <ProfileForm isEdit={true} ref={(ref) => { this.profileForm = ref; }} defaultValue={user} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="修改密碼" key={TAB_CHANGE_PASSWORD} >
              <ChangePasswordForm isEdit={true} ref={(ref) => { this.changePasswordForm = ref; }} />
            </Tabs.TabPane>
          </Tabs>
        </Spin>
      </Modal>
    )
  }

}

export default Profile;
