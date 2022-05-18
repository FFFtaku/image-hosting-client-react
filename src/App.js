import './App.scss';
import React from 'react';
import { useRoutes, useLocation, useMatch } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Provider } from 'react-redux';

import routes from './routes';

import store from '@/store';

export default function App() {
  const elements = useRoutes(routes);
  const location = useLocation();
  let transitionKey = React.useRef(location.key);

  // 处理二级路由跳转时因为key不同会重新刷新的问题
  function setRouteTransitionKey(){
    let pathList = location.pathname.split('/');
    if(pathList.length === 2){
      transitionKey.current = location.key;
    }
  }
  setRouteTransitionKey();

  return (
    <div className="app">
      <Provider store = {store}>
        <TransitionGroup>
          <CSSTransition
            className="xxx"
            classNames={'fade'}
            appear={true}
            timeout={{
              appear: 500,
              enter: 500,
              exit: 300,
            }}
            key={transitionKey.current}
          >
            {elements}
          </CSSTransition>
        </TransitionGroup>
      </Provider>
    </div>
  );
};
