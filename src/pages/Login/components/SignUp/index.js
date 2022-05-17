import React from 'react';
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import './index.scss';

import antdNotification from '@/utils/private/antdNotification';

// 公共组件
import DebounceButton from '@/components/common/DebounceButton';

import {
  postRegister,
  postRegisterAuth
} from '@/services/api/toLoginApi';

export default function SignUp(props) {
  const { changeLoginState } = props;
  const [form] = Form.useForm();
  // 注册逻辑
  const handleSubmit = (values) => {
    console.log('Received values of form: ', values);
    let { username, password, authCode } = values;
    postRegister({
      'account_id_email': username,
      'account_pass': password,
      'register_auth_code': authCode
    }).then(res => {
      changeLoginState(1);
      antdNotification({
        type: 'success',
        message: `注册成功`,
        duration: 2.2
      });
    }).catch(err => {
      antdNotification({
        type: 'error',
        message: `注册失败`,
        description: err.message,
        duration: 2.2
      });
    })
  };
  // 切换至登录
  const handleClickSignIn = () => {
    changeLoginState(1);
  };
  // 获取验证码
  const handleClickGetAuthCode = async () => {
    let account_id_email = null;
    try {
      // 如果邮箱不合法抛出异常，让响应函数返回false，按钮不会进入冷却
      let { username } = await form.validateFields(['username']);
      account_id_email = username;
    } catch (e) {
      return false;
    }

    // 基本邮箱校验合法，发送获取验证码请求，但‘发送验证码’任然可能失败，
    // 因为邮箱合法但不一定有效，此时任然让按钮进入冷却状态
    postRegisterAuth({ account_id_email }).catch(err => {
      antdNotification({
        type: 'error',
        message: err.message,
        duration: 5.5
      });
    });
  }
  return (
    <div className='sign-up'>
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
      >
        {/* Item1 */}
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: '请输入合法邮箱账户',
              pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="使用邮箱注册" />
        </Form.Item>

        <Form.Item
          name="authCode"
          rules={[
            {
              required: true,
              message: '输入邮箱验证码',
            },
          ]}
        >
          <div className="auth-code-box">
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="邮箱验证码"
            />
            <DebounceButton onClick={handleClickGetAuthCode} during={45}>验证码</DebounceButton>
          </div>

        </Form.Item>

        {/* Item2 */}
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请设置密码',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="设置你的密码"
          />
        </Form.Item>

        {/* Item3 */}
        <Form.Item
          name="comfirmPassword"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: '请再次输入确认密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('错误：两次密码不相同！'));
              },
            }),

          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="确认你的密码"
          />
        </Form.Item>


        {/* Item4 */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            立即注册
          </Button>
          <Button type="dashed" ghost style={{ marginTop: 20 }} onClick={handleClickSignIn}>
            返回登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
