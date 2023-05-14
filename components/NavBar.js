

import styles from '../styles/Nav.module.css'


import { useRouter } from 'next/router';
import {
    ConfigProvider, Image,
    Layout, Menu, 
} from 'antd';
import { useState, useEffect } from 'react';



const NavBar = (props) => {

    const router = useRouter();
    const [bgColor, setBgColor] = useState('#9a0000');

    const handleRouteChangeComplete = (url) => {
        if (url !== '/') {
            if (router.pathname === '/') {
                scrollToNavSmoothly();
            } else {
                scrollToNavInstantly();
            }
        }
    };

    const scrollToNavSmoothly = () => {
        window.scrollTo({ top: 24 * window.innerHeight / 100, behavior: 'smooth' });
    };

    const scrollToNavInstantly = () => {
        window.scrollTo(0, 24 * window.innerHeight / 100);
    }
    const shouldShowImage = () => {
        return router.pathname !== '/cinema';
    };
    useEffect(() => {
        router.events.on('routeChangeComplete', handleRouteChangeComplete);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChangeComplete);
        };
    }, [router.pathname])

    useEffect(() => {
        if (props.act === '5') {
            setBgColor('transparent');

        } else {
            setBgColor('#9a0000');
        }
    }, [props.act, router])

    const HomeNavList = [
        { title: 'ㅤㅤ首页ㅤㅤ', nav: '/' },
        { title: 'ㅤㅤ榜样的力量ㅤㅤ', nav: '/pioneers' },
        { title: 'ㅤㅤ时事速递ㅤㅤ', nav: '/news' },
        { title: 'ㅤㅤ新思想学习ㅤㅤ', nav: '/learn' },
        { title: 'ㅤㅤ红色影院ㅤㅤ', nav: '/cinema' }
    ]

    return (
        <Layout>
            {shouldShowImage() && (
                <div className={styles.topHeader}>
                    <Image className={styles.topImage} alt={'党'} src={'/img/other/4.jpg'} preview={false}></Image>
                </div>
            )}
            <div className={styles.Header} style={{ backgroundColor: bgColor }}>

                {/* <GoogleOutlined size={24} color='#fff' style={{ marginLeft: '9vw' }} /> */}
                <Image className={styles.logo} alt={'党'}  preview={false} src={'/img/logo.png'}/>

                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                //字色
                                colorItemText: '#ffffff',
                                colorItemTextHover: '#9a0000',
                                colorItemTextSelectedHorizontal: '#9a0000',
                                //背景色
                                colorItemBg: '#9a0000',
                                colorItemBgHover: '#ffffff',//不起作用??
                                colorItemBgSelectedHorizontal: '#ffffff'
                            }
                        }
                    }}
                >
                    <Menu
                        className={props.act != '5' ? 'custom-menu' : 'custom-menu-cinema'}
                        style={{ backgroundColor: bgColor }}
                        mode="horizontal"
                        overflowedIndicator
                        selectedKeys={[props.act == '5' ? null : props.act]}
                        items={HomeNavList.map((nav, index) => {
                            return {
                                key: index + 1,
                                label: `${nav.title}`,
                                onClick: () => {
                                    router.push(nav.nav);
                                }
                            };
                        })}
                    />
                </ConfigProvider>
            </div>
        </Layout>
    )
}

export default NavBar;
