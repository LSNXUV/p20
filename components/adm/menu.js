
import {
    Menu, Layout, Image, Modal,ConfigProvider
} from 'antd';

const { Sider } = Layout
import { useRouter } from 'next/router';

import { useState } from 'react';

import {
    UnorderedListOutlined,
    DesktopOutlined,
    HomeOutlined,
    LogoutOutlined,
    PieChartOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;

const AdMenu = ({ SelectKey, OpenSubKey }) => {

    const router = useRouter();

    const [collapsed, setCollapsed] = useState(false);


    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type
        };
    }

    const RouterEnum = {
        '1': '',
        '21': '/pr',
        '22': '/pr/brg',
        '31': '/ae',
        '32': '/ae/cmt',
        '4': '/ca',
        '5': '/login'
    }


    const items = [

        getItem("首页管理", "1", <HomeOutlined />,),
        getItem("榜样力量", "2", <PieChartOutlined />, [
            getItem('榜样管理', '21'),
            // getItem('弹幕管理', '22'),
        ]),
        getItem("文章管理", "3", <UnorderedListOutlined />, [
            getItem('内容管理', '31'),
            getItem('评论管理', '32'),
        ]),
        getItem("红色影院", "4", <DesktopOutlined />),
        getItem("退出登录", "5", <LogoutOutlined />),

    ]

    // 在组件内部定义一个状态来控制确认框的显示与隐藏
    const [LogoutModal, setLogoutModal] = useState(false);

  
    // 定义一个函数来处理确认框中点击确定按钮的事件
    const ConfirmLogout = (key) => {

        sessionStorage.removeItem('sk');
        router.replace('/adm/login')
        // 关闭确认框
        setLogoutModal(false)
    }



    return (
        <Sider theme='light'
            style={{ overflow: 'hidden', }}
            collapsed={collapsed}
            onMouseEnter={() => {
                setCollapsed(false)
            }}
            onMouseLeave={() => {
                setCollapsed(true)
            }}
        >
            {/* <Button type="primary" onClick={toggleCollapsed} style={{ margin: 16 }}>
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Button> */}
            {
                <Image width={280} /* className={styles.logo} */ alt={'党'} preview={false} src={'/img/logo.png'} />
            }
            <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                //字色
                                // fontSize:'0.9rem',
                                fontFamily:'SourceHanSerifSC-Regular, sans-serif',
                                colorItemTextActive:'#9a0000',
                                //背景色
                                colorItemBg: '#ffffff',
                                // colorItemText: '#9a0000',
                                colorSubItemBg:'#fffeff',

                                // colorItemBgSelectedHorizontal: '#9a0000',
                                colorItemBgSelected:'#ffeeed',
                                colorItemTextSelectedHorizontal: '#ffffff',
                                colorItemTextSelected:'#9a0000',

                                colorItemBgHover:'#ffeeed',
                                colorItemTextHover: '#9a0000',
                            },
                            
                        }
                    }}
                >
            <Menu
                style={{ marginTop: '5vh' }}
                onClick={({ key }) => {


                    //退出登录
                    if (key == '5') {
                        setLogoutModal(true)
                        return
                    }
                    router.push('/adm' + RouterEnum[key])
                }}
                defaultSelectedKeys={[SelectKey ?? ""]}
                defaultOpenKeys={[OpenSubKey ?? ""]}
                mode="inline"
                theme="light"
                items={items}
            />
            </ConfigProvider>
            {
                <Modal
                    title="确认退出登录"
                    open={LogoutModal}
                    centered
                    onOk={ConfirmLogout}
                    onCancel={ () => {
                        setLogoutModal(false)
                    }}
                    okText={'确定'}
                    cancelText={'取消'}
                    
                >
                    <p>确定要退出登录吗？</p>
                </Modal>
            }
        </Sider>
    );
};

export default AdMenu;
