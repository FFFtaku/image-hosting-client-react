import './index.scss';

import React from 'react';
import { useNavigate } from 'react-router';

import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

// 工具
import antdNotification from '@/utils/private/antdNotification';
import * as authUtil from '@/utils/private/authUtil';

// api引入
import {
  postLogin
} from '@/services/api/toLoginApi';



export default function SignIn(props) {
  let navigate = useNavigate();
  const {changeLoginState} = props;

  // 登录逻辑
  const handleSubmit = (values) => {
    let {password,username} = values;
    postLogin({
      'account_id_email':username,
      'account_pass':password
    }).then(success=>{
      let {token} = success.data;
      authUtil.setAuth(token);
      navigate('/work',{replace:true});
    }).catch(err=>{
      antdNotification({
        type:"error",
        message:'登陆失败',
        description:err.message
      })
    });
  };
  // 切换至注册
  const handleClickSignUp = ()=>{
    changeLoginState(2);
  };

  
  return (
    <div className="sign-in">
      <Form
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
              message: '请输入账号！',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="输入账号" />
        </Form.Item>

        {/* Item2 */}
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="输入密码"
          />
        </Form.Item>

        {/* Item3 */}
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{color:'#bfbfbf'}}>记住账号</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            忘记密码
        </a>
        </Form.Item>

        {/* Item4 */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            点击登入
          </Button>
          <Button type="dashed" ghost style={{marginTop:20}} onClick={handleClickSignUp}>
            立即注册！
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
