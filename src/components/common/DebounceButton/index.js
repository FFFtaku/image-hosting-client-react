import './index.scss';
import React from 'react'

import { Button } from 'antd';

/**
 * 简单的基于antd的防抖按钮
 */
export default function DebounceButton(props) {
  const { onClick, during, children } = props;
  const text = children;
  const [isPrevent, setIsPrevent] = React.useState(false);
  const [currentDuring, setCurrentDuring] = React.useState(during);
  const timer = React.useRef(null);
  const currentDuringStatic = React.useRef(null);

  React.useEffect(()=>{
    // 清除未完成的定时器
    return ()=>{
      clearInterval(timer.current);
    }
  },[])

  const handleClickBtn = () => {
    // 如果目前在冷却状态，直接终止函数
    if (isPrevent) {
      return;
    }

    // 传入的回调函数可以返回一个布尔值用于阻止默认'进入防抖状态'的行为
    // 这个函数可以是同步或异步的
    // 如果是异步函数返回false或返回一个reject状态的promise都可以阻止该默认行为
    let debounceState = onClick();
    if (debounceState instanceof Promise) {
      debounceState.then(res => {
        if (res === false) {
          return;
        }
        doDebounce();
      }).catch(err => { });
    } else {
      if (debounceState === false) {
        return;
      }
      doDebounce();
    }
  }

  const doDebounce = () => {
    setIsPrevent(true);
    startDebounce();
  }
  const resetState = () => {
    setCurrentDuring(during);
    setIsPrevent(false);
  }

  const startDebounce = () => {
    currentDuringStatic.current = during;
    timer.current = setInterval(() => {
      if (currentDuringStatic.current - 1 === 0) {
        clearInterval(timer.current);
        resetState();
      }
      setCurrentDuring(current => {
        currentDuringStatic.current = current - 1;
        return current - 1;
      });
    }, 1000);
  }

  return (
    <Button type="primary" onClick={handleClickBtn}>{isPrevent ? currentDuring : text}</Button>
  )
}
