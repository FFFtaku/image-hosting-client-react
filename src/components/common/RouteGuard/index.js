import React from 'react'
import { useNavigate } from 'react-router';


/**
 * 路由守卫组件.
 * 使用render props传入组件.
 * 被渲染组件中需要调用guarderFunc方法，否则无路由意义.
 */
export default function RouteGuard(props) {

  let readyCallBack = null;
  const navigate = useNavigate();
  const { render } = props;

  React.useEffect(() => {
    if (readyCallBack) {
      readyCallBack();
    }
  }, []);

  function guarderFunc(customGuarder) {
    if (customGuarder) {
      readyCallBack = customGuarder;
    } else {
      readyCallBack = authLogin;
    }
  }

  /**
   * 默认鉴权操作，用于路由前判断是否登录.
   */
  const authLogin = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }

  return (
    <>
      {render(guarderFunc)}
    </>
  );

}
