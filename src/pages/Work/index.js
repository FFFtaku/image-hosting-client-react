import './index.scss';

import React from 'react'
import { Outlet } from 'react-router-dom';

import { Layout, Menu, Modal, Button, PageHeader, Tag, Form, Input, message } from 'antd';
import { UserOutlined, SmileOutlined } from '@ant-design/icons';


// 工具
import antdNotification from '@/utils/private/antdNotification';

// api
import {
  getProfile,
  getResource,
  postInitProfile,
  postChangeResourceName
} from '@/services/api/toWorkApi';

const { Content, Sider } = Layout;


export default function Work() {

  /**
   * hooks
   */
  // 是否需要初始化profile
  const [isShowInitProfileModal, setIsShowInitProfileModal] = React.useState(false);
  const [profileInfo, setProfileInfo] = React.useState({
    profile_name: 'undefined',
    profile_tel: null,
    profile_resource_count: 0
  });
  const [resourceInfo, setResourceInfo] = React.useState([
    {
      resource_count:0,
      resource_name:'loading...',
      resource_unique_id:''
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
  /**
   * 响应事件
   */
  const handleInitProfileName = async () => {

    let hasError = form.getFieldError('nickName');
    if (hasError.length !== 0) {
      message.error('请正确输入昵称');
      return;
    }
    let nickName = form.getFieldValue('nickName');
    let res = await postInitProfile({
      'profile_name': nickName
    }).catch(err => {
      antdNotification({
        type: 'error',
        message: '发生错误!',
        description: `${err.message} [请联系管理员解决]`
      });
    });

    // 初始化成功，重新执行页面加载逻辑
    await displayProfile();
  }

  const handleDoubleClickMenuItem = index => e => {
    datas.currentEditableMenuItem = e.target;
    setCurrentMenuItemEditable(index);
  }

  const handleBlurMenuItem = (resource_unique_id,resource_name) => e => {
    datas.currentEditableMenuItem = null;
    setCurrentMenuItemEditable(-1);
  }

  const handleKeyDownMenuItem = (resource_unique_id,resource_name) => e => {
    
    if (e.keyCode === 13) {
      // 阻止回车换行的默认行为
      e.preventDefault();
      console.log(e,e.innerHTML)

      datas.currentEditableMenuItem = null;
      setCurrentMenuItemEditable(-1);
    }
  }

  // 只有第一次打开菜单时才执行
  const handleOpenMenu = () => {
    if (datas.isMenuFirstOpen) {
      getResource().then(res => {
        console.log(res.data)
        setResourceInfo(res.data);
      })
      datas.isMenuFirstOpen = false;
    }
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
    return {
      // 目前只有一个主菜单内容
      icon: React.createElement(UserOutlined),
      label: (
        <div>
          workspace ({profileInfo['profile_resource_count']})
        </div>
      ),

      // 有多少个resource生成多少个item
      children: resourceInfo.map((item, index) => {
        return {
          key: item.resource_unique_id,
          label: (
            <div
              contentEditable={index === currentMenuItemEditable ? true : false}
              suppressContentEditableWarning
              onDoubleClick={handleDoubleClickMenuItem(index)}
              onBlur={handleBlurMenuItem(item.resource_unique_id,item.resource_name)}
              onKeyDown={handleKeyDownMenuItem(item.resource_unique_id,item.resource_name)}
            >
              {item.resource_name} ({item.resource_count})
            </div>
          ),
        };
      }),
    }
  };

  const autoEditableMenuItemFocus = (targetItem) => {
    targetItem.focus();
  }

  const updateMenuItemName =async (resource_unique_id)=>{
    postChangeResourceName({
      resource_unique_id,
      'resource_new_name':0
    });
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

      {/* 模态框 */}

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
    </div>
  )
} 