import './index.scss';
import React from 'react'
import { Card } from 'antd';

const { Meta } = Card;

export default function ImageCard(props) {

  const [isFocusImage, setIsFocusImage] = React.useState(false);
  const { info } = props;


  const handleShowImageInfo = (index) => e => {
    setIsFocusImage(true);
  }
  const handleLeaveImageInfo = (index) => e => {
    setIsFocusImage(false);
  }
  return (
    <div
      className='image-card'
      onMouseEnter={handleShowImageInfo()}
      onMouseLeave={handleLeaveImageInfo()}
    >
      <img src={info.image_path}></img>
      <div
        className='image-info'
        style={{
          display: isFocusImage ? 'block' : null
        }}
      >
        <div>
          图片名称：{info.image_name}
        </div>
        <div>
          资源大小：{info.image_size}KB
        </div>
      </div>
    </div>
  )
}
