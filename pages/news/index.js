import React from 'react';
import Link from 'next/link';

import styles from '../../styles/news/news.module.css'

import {
    Carousel, Row, Col,  Typography, Layout,  Divider
} from 'antd';

import NavBar from '../../components/NavBar';

import { useEffect } from 'react';


import axios from 'axios';

import hostConfig from '../../config/host.js'
const { apihost,domain } = hostConfig

const { Title, Text } = Typography;


const News = ({ newsList,TopNews }) => {

    useEffect(() => {

    }, []);

    // 示例数据
    /* let TopNews1 = [
		{
			"id": 1,
			"editor": "许建文",
			"author": "新华社",
			"title": "习近平主持召开二十届中央财经委员会第一次会议强调 加快建设以实体经济为支撑的现代化产业体系 以人口高质量发展支撑中国式现代化",
			"published_date": "2023-05-08 15:09:11",
			"pined_photo": null,
			"url": "http://p20.ctbu.org/news/1"
		},
		{
			"id": 2,
			"editor": "许建文",
			"author": "共产党员网",
			"title": "二十大报告学习汇编 | 深入推进现代预算制度改革重点任务",
			"published_date": "2023-05-08 15:09:11",
			"pined_photo": null,
			"url": "http://p20.ctbu.org/news/2"
		}
	] */


    return (
        <Layout>
            <NavBar act="3" />


            {/* 轮播图 */}
            <Carousel
                autoplay
                className={styles.Carousel}
            >
                {TopNews.map((item) => (
                    <Link key={item.id} href={`${item.url.replace(domain,'')}`} passHref>
                    <div
                        className={styles.NewsCarousel}
                        style={{ backgroundImage: `url(/img/news/${item.id}.png)` }}
                        >
                            <div
                                className={styles.CarouselTitle}>
                                <Title level={3} style={{ color: '#fff' }}>{item.title}</Title>
                            </div>
                        </div>
                    </Link>
                ))}
            </Carousel>


            {/* 新闻列表 */}
            <Title level={3} style={{ textAlign: 'center', marginTop: '0vh', marginBottom: '3vh', fontSize: '30px' }}>时事速递</Title>
            <div style={{ width: '70%', margin: '0 auto' }}>
                <Row gutter={[16, 16]} style={{ marginBottom: '10vh' }}>
                    {newsList.map((item, index) => (
                        <Col xs={24} key={item.id}>
                            <Link href={`/news/${item.id}`} passHref>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            fontSize: '24px',
                                            fontWeight: '500',
                                        }}
                                    >
                                        {item.title}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: '14px' }}>{item.date}</Text>
                                </div>
                            </Link>
                            {index !== newsList.length - 1 && (
                                <Divider dashed
                                    style={{
                                        borderColor: '#9a0000',
                                        margin: '16px 0',
                                    }}
                                />
                            )}
                        </Col>
                    ))}
                </Row>
            </div>
        </Layout>
    )
}


export async function getStaticProps() {

    let newsList = [
        {
            "id": 1,
            "editor": "许建文",
            "author": "新华社",
            "title": "习近平主持召开二十届中央财经委员会第一次会议强调 加快建设以实体经济为支撑的现代化产业体系 以人口高质量发展支撑中国式现代化",
            "published_date": "2023-05-08 07:05:11",
            "url": "https://p20.ctbu.org/post/1"
        },
        {
            "id": 2,
            "editor": "许建文",
            "author": "共产党员网",
            "title": "二十大报告学习汇编 | 深入推进现代预算制度改革重点任务",
            "published_date": "2023-05-08 07:05:11",
            "url": "https://p20.ctbu.org/post/2"
        },
        {
            "id": 3,
            "editor": null,
            "author": null,
            "title": "【二十大代表风采录】李群：与病毒赛跑的疾控人",
            "published_date": "2023-05-08 07:05:11",
            "url": "https://p20.ctbu.org/post/3"
        },
        {
            "id": 4,
            "editor": null,
            "author": null,
            "title": "【二十大代表风采录】于吉红：科技梦助推中国梦",
            "published_date": "2023-05-08 07:05:11",
            "url": "https://p20.ctbu.org/post/4"
        }
    ]

    try {
        const response = await axios.post(
            apihost + '/v1/post/getList',
            { type: 'news' },
            {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                timeout: 4000
            }
        )
        if (response.status === 200) {
            newsList = response.data.data;
        }
    } catch (error) {
        console.error(error);
    }

    let TopNews = [
        {
            "id": 1,
            "editor": "许建文",
            "author": "新华社",
            "title": "习近平主持召开二十届中央财经委员会第一次会议强调 加快建设以实体经济为支撑的现代化产业体系 以人口高质量发展支撑中国式现代化",
            "published_date": "2023-05-08 15:09:11",
            "pined_photo": null,
            "url": "http://p20.ctbu.org/news/1"
        },
        {
            "id": 2,
            "editor": "许建文",
            "author": "共产党员网",
            "title": "二十大报告学习汇编 | 深入推进现代预算制度改革重点任务",
            "published_date": "2023-05-08 15:09:11",
            "pined_photo": null,
            "url": "http://p20.ctbu.org/news/2"
        }
    ]
    try {
        const response = await axios.post(
            apihost + '/v1/post/getPosterStand',
            { type: 'news' },
            {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                timeout: 3000
            }
        )
        if (response.data?.code === 0) {
            TopNews = response.data.data;
        }

    } catch (error) {
        console.error(error);
    }

    return {
        props: {
            newsList,
            TopNews
        },
        revalidate: 60, // Optional: Set a revalidation time (in seconds) to regenerate the page at runtime
    };
}

export default News;
