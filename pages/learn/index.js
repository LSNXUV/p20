import React, { useEffect,useRef } from 'react';
import Link from 'next/link';

import styles from '../../styles/news/news.module.css'
import hostConfig from '../../config/host.js'
const { apihost,domain } = hostConfig

import {
    Carousel, Row, Col, Typography,Layout, Divider
} from 'antd';


import NavBar from '../../components/NavBar.js';

import axios from 'axios';

const { Title, Text } = Typography;



const News = ({ learnDetail,TopLearns }) => {

    // 示例数据
    /* let TopLearns1 = [
		{
			"id": 5,
			"editor": null,
			"author": null,
			"title": "习近平新时代中国特色社会主义思想",
			"published_date": "2023-05-08 15:09:11",
			"pined_photo": null,
			"url": "http://p20.ctbu.org/learn/5"
		},
		{
			"id": 6,
			"editor": "许建文",
			"author": "求是",
			"title": "习近平：更好把握和运用党的百年奋斗历史经验",
			"published_date": "2023-05-08 15:09:11",
			"pined_photo": null,
			"url": "http://p20.ctbu.org/learn/6"
		}
	]*/

    const carouselRef = useRef()

    useEffect(() => {


    }, []);

    return (
        <Layout>
            <NavBar act="4" />
            {/* 轮播图 */}
            {/* <Button className="carousel-btn prev-btn" 
                onClick={() => {
                    carouselRef.current.prev()
                }} 
                icon={<LeftOutlined />} /> */}
            <Carousel
                ref={carouselRef}
                autoplay
                className={styles.Carousel}
            >
                {TopLearns.map((item) => (
                    <Link key={item.id} href={`${item.url.replace(domain,'')}`} passHref>
                        <div
                            className={styles.NewsCarousel}
                            style={{ backgroundImage: item.pined_photo }}
                        >
                            <div
                                className={styles.CarouselTitle}>
                                <Title level={3} style={{ color: '#fff' }}>{item.title}</Title>
                            </div>
                        </div>
                    </Link>
                ))}
            </Carousel>
            {/* <Button className="carousel-btn next-btn"
                onClick={() => {
                    carouselRef.current.next()
                }} 
                icon={<RightOutlined />} /> */}

            {/* 新闻列表 */}
            <Title level={3} style={{ textAlign: 'center', marginTop: '0vh', marginBottom: '3vh', fontSize: '30px' }}>新思想学习</Title>
            <div style={{ width: '70%', margin: '0 auto' }}>
                <Row gutter={[16, 16]} style={{ marginBottom: '10vh' }}>
                    {learnDetail.map((item, index) => (
                        <Col xs={24} key={item.id}>
                            <Link href={`/learn/${item.id}`} passHref>
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
                            {index !== learnDetail.length - 1 && (
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


    let learnDetail = [
        {
            "id": 5,
            "editor": null,
            "author": null,
            "title": "习近平新时代中国特色社会主义思想",
            "published_date": "2023-05-08 07:05:11",
            "url": "/img/7.png"
        },
        {
            "id": 6,
            "editor": "许建文",
            "author": "求是",
            "title": "习近平：更好把握和运用党的百年奋斗历史经验",
            "published_date": "2023-05-08 07:05:11",
            "url": "/img/7.png"
        },
        {
            "id": 7,
            "editor": "周世雄",
            "author": "中央党史和文献研究院网站",
            "title": "【党史百年·天天读】5月7日",
            "published_date": "2023-05-08 07:05:11",
            "url": "/img/7.png"
        },
        {
            "id": 8,
            "editor": "徐瑶",
            "author": "新华社",
            "title": "二十大报告摘登 | 新时代十年的伟大变革具有里程碑意义",
            "published_date": "2023-05-08 07:05:11",
            "url": "/img/7.png"
        }
    ]

    try {
        const response = await axios.post(
            apihost + '/v1/post/getList',
            { type: 'study' },
            {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                timeout: 4000
            }
        )
        if (response.status === 200) {
            learnDetail = response.data.data;
        }

    } catch (error) {
        console.error(error);
    }

    let TopLearns = [
        {
            "id": 1,
            "editor": "许建文",
            "author": "新华社",
            "title": "习近平主持召开二十届中央财经委员会第一次会议强调 加快建设以实体经济为支撑的现代化产业体系 以人口高质量发展支撑中国式现代化",
            "published_date": "2023-05-08 15:09:11",
            "pined_photo": null,
            "url": "http://p20.ctbu.org/post/1"
        },
        {
            "id": 2,
            "editor": "许建文",
            "author": "共产党员网",
            "title": "二十大报告学习汇编 | 深入推进现代预算制度改革重点任务",
            "published_date": "2023-05-08 15:09:11",
            "pined_photo": null,
            "url": "http://p20.ctbu.org/post/2"
        }
    ]
    try {
        const response = await axios.post(
            apihost + '/v1/post/getPosterStand',
            { type: 'study' },
            {
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                timeout: 3000
            }
        )
        if (response.status === 200) {
            TopLearns = response.data.data;
        }

    } catch (error) {
        console.error(error);
    }


    return {
        props: {
            learnDetail,
            TopLearns
        },
        revalidate: 60, // Optional: Set a revalidation time (in seconds) to regenerate the page at runtime
    };
}

export default News;
