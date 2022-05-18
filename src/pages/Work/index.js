import './index.scss';

import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Layout, Menu, Modal, Button, PageHeader, Tag, Form, Input, message } from 'antd';
import { UserOutlined, SmileOutlined, PlusCircleOutlined } from '@ant-design/icons';


// 工具
import antdNotification from '@/utils/private/antdNotification';

// api
import {
  getProfile,
  getResource,
  postInitProfile,
  postChangeResourceName,
  postCreateResource
} from '@/services/api/toWorkApi';

// action
import { 
  actionInsertCurrentOpenResource,
  actionSetCurrentOpen } from '@/store/actions/workAction';

  
const { Content, Sider } = Layout;

export default function Work() {

  /**
   * hooks
   */
  // 是否需要初始化profile
  const [isShowInitProfileModal, setIsShowInitProfileModal] = React.useState(false);
  const [isShowIncreaseResourceModal, setIsShowIncreaseResourceModal] = React.useState(false);
  const [profileInfo, setProfileInfo] = React.useState({
    profile_name: 'undefined',
    profile_tel: null,
    profile_resource_count: 0
  });
  const [resourceInfo, setResourceInfo] = React.useState([
    {
      resource_count: 0,
      resource_name: 'loading...',
      resource_unique_id: ''
    }
  ]);

  // -1表示什么都不选择
  const [currentMenuItemEditable, setCurrentMenuItemEditable] = React.useState(-1);

  const { current: datas } = React.useRef({
    isMenuFirstOpen: true,
    currentEditableMenuItem: null
  });

  React.useEffect(() => {
    (async () => {
      displayProfile();
    })();
  }, []);

  React.useEffect(() => {
    // 保证首次render时不执行
    if (datas.currentEditableMenuItem) {
      autoEditableMenuItemFocus(datas.currentEditableMenuItem);
      datas.currentEditableMenuItem = null;
    }
  }, [currentMenuItemEditable])
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const workStore = useSelector(store=>store.work);
  /**
   * 响应事件
   */
  const handleInitProfileName = async () => {
    let validate = null;
    try {
      validate = await form.validateFields('nickName');
    } catch (e) {
      return;
    }

    let res = await postInitProfile({
      'profile_name': validate.nickName
    }).catch(err => {
      antdNotification({
        type: 'error',
        message: '发生错误!',
        description: `${err.message} [请联系管理员解决]`
      });
    });
    setIsShowInitProfileModal(false);
    message.success('欢迎您的进入！');
    // 初始化成功，重新执行页面加载逻辑
    await displayProfile();
  }

  const handleDoubleClickMenuItem = index => e => {
    datas.currentEditableMenuItem = e.target;
    setCurrentMenuItemEditable(index);
  }

  const handleBlurMenuItem = (resource_unique_id, resource_name) => e => {

    let modifiedValue = e.target.innerHTML;
    if (modifiedValue === resource_name) {
      datas.currentEditableMenuItem = null;
      setCurrentMenuItemEditable(-1);
      return;
    }
    if (!modifiedValue) {

      // 不允许为空，如果为空则将原来的值显示
      // 注意：这里不得已需要操作dom，因为react没有实现双向绑定
      // setResourceInfo([...resourceInfo]);是没有效果的，因为虚拟dom树没有变化，diff算法会认为这个同一个节点并复用
      // 可以手动实现双向绑定，但似乎这里意义不大。
      e.target.innerHTML = resource_name;
      datas.currentEditableMenuItem = null;
      setCurrentMenuItemEditable(-1);
      return;
    }

    updateMenuItemName(resource_unique_id, modifiedValue);

  }

  const handleKeyDownMenuItem = (resource_unique_id, resource_name) => e => {

    if (e.keyCode === 13) {
      // 阻止回车换行的默认行为
      e.preventDefault();
      let modifiedValue = e.target.innerHTML;
      if (modifiedValue === resource_name) {
        datas.currentEditableMenuItem = null;
        setCurrentMenuItemEditable(-1);
        return;
      }
      if (!modifiedValue) {
        e.target.innerHTML = resource_name;
        datas.currentEditableMenuItem = null;
        setCurrentMenuItemEditable(-1);
        return;
      }
      updateMenuItemName(resource_unique_id, modifiedValue);
    }
  }

  // 只有第一次打开菜单时才执行
  const handleOpenMenu = () => {
    if (datas.isMenuFirstOpen) {
      getResource().then(res => {
        setResourceInfo(res.data);
      })
      datas.isMenuFirstOpen = false;
    }
  }

  const handleClickIncreaseResource = () => {
    setIsShowIncreaseResourceModal(true);
  }

  const handleClickSubmitNewResource = async () => {
    let validate = null;
    try {
      validate = await form.validateFields(['resourceName']);
    } catch (e) {
      return;
    }
    let { resourceName } = validate;
    let res = await postCreateResource({
      resource_name: resourceName
    }).catch(err => {
      antdNotification({
        type: 'error',
        message: '新建失败!',
        description: err.message
      });
    })
    // 关闭modal
    setIsShowIncreaseResourceModal(false);
    try {
      // 重新获取resource数据
      await getResource().then(res => {
        setResourceInfo(res.data);
      })
      // 重新获取profile数据
      await displayProfile();
    } catch (e) { console.log(e) }
  }
  const handleClickCloseIncreaseResourceModal = () => {
    setIsShowIncreaseResourceModal(false);
  }
  const handleClickMenuItem = (resource_unique_id,resource_name) => (e) => {
    navigate('display');
    let checkRes =workStore.currentOpenResource.every((item)=>{
      if(item.resource_unique_id === resource_unique_id){
        return false;
      }
      return true;
    })
    if(checkRes){
      dispatch(actionInsertCurrentOpenResource({
        resource_unique_id,
        resource_name
      }));
    }
    dispatch(actionSetCurrentOpen(resource_unique_id));
  }
  
  /**
   * 所有逻辑函数
   */
  const displayProfile = async () => {
    let res = await getProfile();
    if (res.data === null) {
      return setIsShowInitProfileModal(true);
    }
    let { profile_name, profile_resource_count, profile_tel } = res.data;
    setProfileInfo({
      profile_name,
      profile_resource_count,
      profile_tel
    })

  };

  const generateMenuItem = () => {
    const items = resourceInfo.map((item, index) => {
      return {
        key: item.resource_unique_id,
        onClick: handleClickMenuItem(item.resource_unique_id, item.resource_name),
        label: (
          <div
            key={item.resource_unique_id}
            contentEditable={index === currentMenuItemEditable ? true : false}
            suppressContentEditableWarning
            onDoubleClick={handleDoubleClickMenuItem(index)}
            onBlur={handleBlurMenuItem(item.resource_unique_id, item.resource_name)}
            onKeyDown={handleKeyDownMenuItem(item.resource_unique_id, item.resource_name)}
          >
            {item.resource_name}
          </div>
        ),
      };
    });
    items.push(
      {
        key: 'item-increase',
        label: (
          <div
            className='item-increase-button'
            key='item-increase'
            onClick={handleClickIncreaseResource}
          >
            <PlusCircleOutlined className='item-increase-button-icon' />
          </div>
        ),
      }

    );

    return {
      // 目前只有一个主菜单内容
      icon: React.createElement(UserOutlined),
      label: (
        <div>
          workspace ({profileInfo['profile_resource_count']})
        </div>
      ),

      // 有多少个resource生成多少个item
      children: items
    }
  };

  const autoEditableMenuItemFocus = (targetItem) => {
    targetItem.focus();
  }

  const updateMenuItemName = async (resource_unique_id, modifiedValue) => {
    try {
      let res = postChangeResourceName({
        resource_unique_id,
        'resource_new_name': modifiedValue
      })
    } catch (e) {
      return message.error('操作失败');
    }
    getResource().then(res => {
      setResourceInfo(res.data);
    })
    datas.currentEditableMenuItem = null;
    setCurrentMenuItemEditable(-1);
  }

  /**
   * dom结构
   */
  return (
    <div className="work">

      <Layout className="work-layout">
        {/* 头部 */}
        <PageHeader
          title={profileInfo['profile_name']}
          className="site-page-header"
          subTitle="扩展描述信息"
          tags={<Tag color="blue">正式账户</Tag>}
          extra={[
            <Button key="3">Operation</Button>,
            <Button key="2">Operation</Button>,
            <Button key="1" type="primary">
              开放平台
            </Button>
          ]}
          avatar={{ src: 'https://avatars1.githubusercontent.com/u/8186664?s=460&v=4' }}
        >
        </PageHeader>

        {/* 侧边栏 */}
        <Layout>
          <Sider width={200} className="site-layout-background">
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{
                height: '100%',
                borderRight: 0,
              }}
              items={[generateMenuItem()]}
              onOpenChange={handleOpenMenu}
            />
          </Sider>

          {/* 内容区 */}
          <Layout
            style={{
              padding: '0 20px 20px',
            }}
          >

            <Outlet />

          </Layout>
        </Layout>
      </Layout>

      {/* 模态框1 */}
      <Modal
        closable={false}
        className='modal'
        title={
          (
            <div>
              <SmileOutlined />
              <span style={{ paddingLeft: 10 }}>
                请输入你的昵称！
              </span>
            </div>
          )
        }
        visible={isShowInitProfileModal}
        getContainer={false}
        footer={
          (
            <div>
              <Button type="dashed" onClick={handleInitProfileName}>
                开始工作
              </Button>
            </div>
          )
        }
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          className='modal-form'
        >
          <Form.Item
            label="你的昵称"
            name="nickName"
            rules={[{ required: true, message: '请输入你的昵称' }]}
            required
          >
            <Input
              placeholder='昵称长度小于10位'
              size='large'
              allowClear={true}
              maxLength={10}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 模态框2 */}
      <Modal
        className='modal'
        title={
          (
            <div>
              <SmileOutlined />
              <span style={{ paddingLeft: 10 }}>
                您可以增加您的资源文件夹！
              </span>
            </div>
          )
        }
        visible={isShowIncreaseResourceModal}
        onCancel={handleClickCloseIncreaseResourceModal}
        getContainer={false}
        footer={
          (
            <div>
              <Button type="dashed" onClick={handleClickSubmitNewResource}>
                添加
              </Button>
            </div>
          )
        }
      >
        <Form
          name="basic"
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          className='modal-form'
        >
          <Form.Item
            label="新建文件夹"
            name="resourceName"
            rules={[{ required: true, message: '请输入你的资源文件夹名称' }]}
            required
          >
            <Input
              placeholder='昵称长度小于10位'
              size='large'
              allowClear={true}
              maxLength={10}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
} 