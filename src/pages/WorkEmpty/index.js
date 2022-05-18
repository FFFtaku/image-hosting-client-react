import './index.scss';

import React from 'react'
import { Empty } from 'antd';
import empty_img_gif  from '@/assets/img/empty_img.gif'
export default function WorkEmpty() {
  return (
    <div className='work-empty'>
      <Empty 
        imageStyle ={{width:300,height:300}}
        description = {(
          <div className = "empty-desc">
            - 请选择你的资源文件夹以开始工作 -
          </div>
        )}
        image={(
          <img 
            className = "empty-img"
            src={empty_img_gif} 
          />
        )}
      />
    </div>
  )
}
