import './index.scss';
import React from 'react';

import { Empty, Card } from 'antd';

import ImageCard from '../ImageCard';
// api
import {
  postImageByResource
} from '@/services/api/toWorkApi';

export default function ImagesBox(props) {

  const { resource_unique_id } = props;
  const [imagesCache, setImagesCache] = React.useState([]);

  React.useEffect(() => {
    console.log(123)
    setImages();
  }, []);

  const setImages = async () => {
    let res = await postImageByResource({ resource_unique_id })
    setImagesCache(res.data)

  }
  return (
    <div
      className="iamges-box"
      style={props.style}
    >
      {(() => {
        if (imagesCache.length === 0) {
          return (
            <div className='empty-state-box'>
              <Empty
                description={(
                  <div className="desc">
                    你的存储桶内还没有内容哦~
                  </div>
                )}
              />
            </div>
          )
        } else {
          const gridStyle = {
            width: '25%',
            textAlign: 'center',
          };

          return (
            <div className='main-box'>
              <Card className='main-box-inner' hoverable bordered>
                {
                  imagesCache.map((item, index) => {
                    let {image_path} = item;
                    return (
                      <Card.Grid 
                      className='each-item'
                      key = {image_path}                      
                      >
                        <ImageCard info={item}>

                        </ImageCard>
                      </Card.Grid>
                    )
                  })
                }
              </Card>

            </div>
          )
        }
      })()}
    </div>
  )
}
