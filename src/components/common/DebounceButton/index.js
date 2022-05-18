import './index.scss';
import React from 'react'

import { Button } from 'antd';

/**
 * 简单的基于antd的防抖按钮
 */
export default function DebounceButton(props) {
  const { onClick, 
          during, 
          firstDebounce, 
          firstDebounceDuring, 
          getRemainTime,
          debounceEnd,
          children } = props;
  const text = children;
  const [isPrevent, setIsPrevent] = React.useState(false);
  const [currentDuring, setCurrentDuring] = React.useState(null);

  const timer = React.useRef(null);
  const currentDuringStatic = React.useRef(null);

  React.useEffect(()=>{
    if(firstDebounce === true && firstDebounceDuring){
      doDebounce(true);
    }
    // 清除未完成的定时器
    return ()=>{
      clearInterval(timer.current);
      if(getRemainTime){
        getRemainTime(currentDuringStatic.current);
      }
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
        doDebounce(false);
      }).catch(err => { });
    } else {
      if (debounceState === false) {
        return;
      }
      doDebounce(false);
    }
  }
  // 执行deboune
  const doDebounce = (isFirst) => {
    setIsPrevent(true);
    startDebounce(isFirst);
  }
  // 重置debounce状态
  const resetState = () => {
    setCurrentDuring(null);
    currentDuringStatic.current = null;
    setIsPrevent(false);
  }

  // debounce逻辑
  const startDebounce = (isFirst) => {
    let matchDuring = null;
    if(isFirst){
      matchDuring = firstDebounceDuring;
    }else{
      matchDuring = during;
    }
    currentDuringStatic.current = matchDuring;
    setCurrentDuring(matchDuring);
    timer.current = setInterval(() => {
      if (currentDuringStatic.current - 1 === 0) {
        if(debounceEnd){
          debounceEnd();
        }
        clearInterval(timer.current);
        return resetState();
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
