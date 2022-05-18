import './index.scss';

import React from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useNavigate } from 'react-router-dom';

// 页面内部组件
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

// 工具
import * as authUtil from '@/utils/private/authUtil';


export default function Login(props) {

  const [loginState, setLoginState] = React.useState(0);
  const [currentOpacity, setCurrentOpacity] = React.useState(null);
  const navigate = useNavigate();

  // componentDidMount
  React.useEffect(() => {
    if (authUtil.checkAuth()) {
      navigate('/work', { replace: true });
    }
  }, []);


  
  const changeLoginState = (stateCode) => {
    setCurrentOpacity(0);
    setTimeout(() => {
      unstable_batchedUpdates(() => {
        setLoginState((prev) => {
          return stateCode;
        });
        setCurrentOpacity(null);
      })

    }, 600);

  };

  const handleClickLoginButton = (e) => {
    changeLoginState(1);
  }
  const handleClickBack = (backTo) => {
    return (e) => {
      changeLoginState(backTo);
    }
  }

  return (
    <div className='login'>
      {
        ((loginState) => {
          if (loginState === 0) {
            return (
              <div
                className="login-button"
                onClick={handleClickLoginButton}
                style={{ opacity: currentOpacity }}>
                <i className='iconfont icon-user login-button-logo' />
              </div>
            )
          } else if (loginState === 1) {
            return (
              <div className="sign-in-box" style={{ opacity: currentOpacity }}>
                <div className="back-button">
                  <i className="iconfont icon-icon2" onClick={handleClickBack(0)} />
                </div>
                <div key="sign-in-box-title" className="title animate__animated animate__bounceIn">
                  | 登录 |
                </div>
                <SignIn changeLoginState={changeLoginState}></SignIn>
              </div>
            )
          } else if (loginState === 2) {
            return (
              <div className="sign-up-box" style={{ opacity: currentOpacity }}>
                <div className="back-button">
                  <i className="iconfont icon-icon2" onClick={handleClickBack(0)} />
                </div>
                <div key="sign-up-box-title" className="title animate__animated animate__bounceIn">
                  | 注册 |
                </div>
                <SignUp changeLoginState={changeLoginState}></SignUp>
              </div>
            )
          }
        })(loginState)
      }
      <div style={{ opacity: 0 }}>cc</div>
    </div>
  );
}


