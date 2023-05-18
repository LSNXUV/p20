
import Link from 'next/link';

import styles from '../styles/Home.module.css'


import {useEffect} from 'react'

import NavBar from '../components/NavBar.js';

import { Image,Row, Col,
    Layout,Carousel ,Card,Typography,
  } from 'antd';

import hostConfig from '../config/host.js'

const { apihost,domain } = hostConfig
import axios from 'axios';

const { Content } = Layout;
const { Title } = Typography;


const NewsModule = (props) => {
  const { newsList } = props;

  return (
    <div className={styles.NewsModule}>
      <Title level={3} style={{ textAlign: 'center' }}>精彩在线</Title>
      <Row gutter={[16, 16]} wrap>
        {newsList.map((item) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={6} key={item.id}>
            <Link href={`/news/${item.id}`} passHref>
              <Card
                hoverable
                cover={
                <Image height={'25vh'} 
                  style={{objectFit:'cover'}}
                  fallback='https://www.hangzhou.com.cn/templateRes/202209/08/103025/assets/images/banner.jpg'
                  src={item.pined_photo} alt={item.title} preview={false} 
                  />}
              >
                <Card.Meta
                  title={item.title}
                  description={item.published_date}
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
      <Row style={{marginTop:'2vh'}}>
        <Col xs={{ span: 24 }} sm={{ span: 12, offset: 12 }} md={{ span: 8, offset: 16 }} lg={{ span: 6, offset: 18 }} xl={{ span: 4, offset: 20 }}>
          <Link href="/news" passHref>
              <Typography.Text strong style={{fontSize:'1.2rem', textDecoration: 'underline', cursor: 'pointer', display: 'block', textAlign: 'right' }}>
                查看更多
              </Typography.Text>
          </Link>
        </Col>
      </Row>
    </div>
  );
};


export default function Home({Carousels,newsList}) {

  useEffect(() => {
    
  }, [])
  

  /* const newsList = [
    { id: 1, title: '习近平主持召开二十届中央财经委员会第一次会议', date: '2023-05-05',image:'/img/7.png' },
    { id: 2, title: '习近平给中国农业大学科技小院的学生', date: '2023-05-03',image:'/img/7.png' },
    { id: 3, title: '习近平向全国广大劳动群众致以节日', date: '2023-04-30',image:'/img/7.png' },
    { id: 4, title: '习近平主持召开二十届中央财经委员会第一次会议', date: '2023-05-05',image:'/img/7.png' },
  ]; */

  return (
    <Layout className={styles.container}>
        <NavBar act="1"/>

        <Content className={styles.Content}
        >

          <Carousel className={styles.Carousel}
            autoplay 
          >
            {
              Carousels.map((img,index) => 
                <Image 
                  key={index}
                  // className={styles.CarouselImage}
                  style={{objectFit:'cover',objectPosition:'center'}}
                  src={img.pic_url}  
                  alt="学习强国"
                  fallback="https://www.hangzhou.com.cn/templateRes/202209/08/103025/assets/images/banner.jpg"
                  preview={false}
                />
              )
            }
            
          </Carousel>

          <NewsModule newsList={newsList} />
        </Content>
    </Layout>
  )
}

export const getStaticProps = async (ctx) => {

  let Carousels = [
    {
			"id": 1,
			"pic_url": 'https://www.hangzhou.com.cn/templateRes/202209/08/103025/assets/images/banner.jpg',
			"desc": null,
			"sort": 1,
			"start_date": 1683433128,
			"end_date": null,
			"status": 1,
			"created_at": null,
			"updated_at": null
		},
    {
			"id": 2,
			"pic_url": 'https://www.chinacourt.org/style/subject/xyesd/banner.jpg',
			"desc": null,
			"sort": 1,
			"start_date": 1683433128,
			"end_date": null,
			"status": 1,
			"created_at": null,
			"updated_at": null
		},
    {
			"id": 3,
			"pic_url": 'https://news.jschina.com.cn/zt2022/gk2022/202209/W020220914541145334822.png',
			"desc": null,
			"sort": 1,
			"start_date": 1683433128,
			"end_date": null,
			"status": 1,
			"created_at": null,
			"updated_at": null
		}
  ]

  let newsList = [
    {
      "id": 1,
      "title": "习近平主持召开二十届中央财经委员会第一次会议强调 加快建设以实体经济为支撑的现代化产业体系 以人口高质量发展支撑中国式现代化",
      "pined_photo": null,
      "published_date": "2023-05-08 15:09:11",
      "url": "http://p20.ctbu.org/news/1"
    },
    {
      "id": 2,
      "title": "二十大报告学习汇编 | 深入推进现代预算制度改革重点任务",
      "pined_photo": null,
      "published_date": "2023-05-08 15:09:11",
      "url": "http://p20.ctbu.org/news/2"
    },
    {
      "id": 5,
      "title": "习近平新时代中国特色社会主义思想",
      "pined_photo": null,
      "published_date": "2023-05-08 15:09:11",
      "url": "http://p20.ctbu.org/news/5"
    },
    {
      "id": 6,
      "title": "习近平：更好把握和运用党的百年奋斗历史经验",
      "pined_photo": null,
      "published_date": "2023-05-08 15:09:11",
      "url": "http://p20.ctbu.org/news/6"
    }
  ]

  try {
    const response = await axios.post(
        apihost + '/v1/posterstands/fetch',
        {},
        {
            timeout: 4000
        }
    )
    if (response.data?.code === 0) {
      Carousels = response.data.data.posterStands
      newsList = response.data.data.pinedNews
    }
    console.log(Carousels,newsList)
} catch (error) {
    console.error(error);
}

  return {
    props:{
      Carousels,
      newsList
    }
  }
}