

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
        // console.log(url,' ',router.pathname)
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
    }, [router.events, handleRouteChangeComplete])

    useEffect(() => {
        if (props.act === '5') {
            setBgColor('transparent');

        } else {
            setBgColor('#9a0000');
        }
    }, [props.act])

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
                    <Image className={styles.topImage} height={'30vh'} width={'100vw'} alt={'党'} src={'/img/other/p.png'} preview={false}></Image>
                </div>
            )}
            <div className={styles.Header} style={{ backgroundColor: bgColor }}>
                <Image className={styles.logo} alt={'党'}  preview={false} src={'/img/logo.png'}/>

                <ConfigProvider
                    theme={{
                        components: {
                            Menu: {
                                //字色
                                colorItemText: '#9a0000',
                                colorItemTextHover: '#9a0000',
                                colorItemTextSelectedHorizontal: '#9a0000',
                                colorItemTextSelected:'#ffffff',
                                //背景色
                                colorItemBg: '#ffffff',
                                colorItemBgHover: '#ffffff',//不起作用??
                                colorItemBgSelectedHorizontal: '#ffffff',
                                colorItemBgSelected:'#9a0000',
                                colorItemBgHover:'#ffffff',
                            }
                        }
                    }}
                >
                    <Menu
                        className={props.act != '5' ? 'custom-menu' : 'custom-menu-cinema'}
                        style={{ backgroundColor: bgColor }}
                        mode="horizontal"
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
