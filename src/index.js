import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// 使用antd样式库
import 'antd/dist/antd.min.css';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';

// css动画效果
import 'animate.css';

// 引入APP
import App from './App';
// 引入通用初始化css样式
import './assets/css/base_css.css';
// 因此项目初始化css样式
import './index.scss';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ConfigProvider locale={zhCN}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
);
