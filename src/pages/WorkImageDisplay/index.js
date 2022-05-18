// style
import './index.scss';

// 
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// antd
import { Breadcrumb } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

// components
import ImagesBox from './components/ImagesBox';

// actions
import {
  actionInsertCurrentOpenResource,
  actionSetCurrentOpen,
  actionRemoveResourceOpen
} from '@/store/actions/workAction';


export default function WorkImageDisplay() {

  const [currentMouseEnter, setCurrentMouseEnter] = React.useState(-1);
  const dispatch = useDispatch();
  const workStore = useSelector(store => store.work);
  const currentOpen = workStore.currentOpen;
  const navigate = useNavigate();

  const handleMouseEnterBreadCrumb = index => e => {
    setCurrentMouseEnter(index);
  }

  const handleMouseLeaveBreadCrumb = index => e => {
    setCurrentMouseEnter(-1);
  }

  const handleClickBreadCrumb = resource_unique_id => e => {
    dispatch(actionSetCurrentOpen(resource_unique_id))
  }

  const handleClickDeleteBreadCrumb = (nowClick, index) => e => {
    let { currentOpenResource } = workStore;
    let len = currentOpenResource.length;

    // 如果点击的是自己，要设置下一个被选中的项
    if (nowClick === currentOpen) {
      // 如果只剩一个，直接路由跳转回空状态
      if (len === 1) {
        navigate('../');
      }
      // 如果还有多个，选则下一个高亮的项
      else if (len !== 1) {
        let nextSelectId = null;
        // 如果是第一个，则后面的亮
        if (index === 0) {
          nextSelectId = currentOpenResource[index + 1].resource_unique_id;
        }
        // 如果不是第一个，就前面的亮 
        else {
          nextSelectId = currentOpenResource[index - 1].resource_unique_id;
        }
        dispatch(actionSetCurrentOpen(nextSelectId));
      }
    }
    // 不管是不是点的自己，都要删除index对应的那一项
    dispatch(actionRemoveResourceOpen(index));

    // 阻止冒泡防止调用 handleClickBreadCrumb 方法
    e.stopPropagation();
  }
  return (
    <div className="work-image-display">
      <div className="navigator">
        <div className="bread-crumb">
          {
            workStore.currentOpenResource.map((item, index) => {
              let { resource_unique_id, resource_name } = item;
              return (
                <div
                  key={resource_unique_id}
                  className="bread-crumb-item"
                  onClick={handleClickBreadCrumb(resource_unique_id)}
                  onMouseEnter={handleMouseEnterBreadCrumb(index)}
                  onMouseLeave={handleMouseLeaveBreadCrumb(index)}
                  style={{
                    backgroundColor: currentOpen === resource_unique_id ? 'white' : null
                  }}
                >
                  {resource_name}
                  {currentMouseEnter === index && (
                    <span
                      className="bread-crumb-icon"
                      onClick={handleClickDeleteBreadCrumb(resource_unique_id, index)}
                    >
                      <CloseOutlined className="close-icon"/>
                    </span>
                  )}
                </div>
              )
            })
          }
        </div>
      </div>

      <div className="content">
        {
          workStore.currentOpenResource.map((item, index) => {
            let { resource_unique_id } = item;
            return (
              <ImagesBox
                key={resource_unique_id}
                resource_unique_id={resource_unique_id}
                className="images-box"
                style={{
                  display: currentOpen === resource_unique_id ? 'block' : 'none'
                }}
              >

              </ImagesBox>
            )
          })
        }
      </div>
    </div>
  )
}
