
import Link from 'next/link';

import styles from '../styles/Home.module.css'


import {useEffect} from 'react'

import NavBar from '../components/NavBar.js';

import { Image,Row, Col,
    Layout,Carousel ,Card,Typography,
  } from 'antd';



const { Content } = Layout;
const { Title } = Typography;


const NewsModule = (props) => {
  const { newsList } = props;

  return (
    <div className={styles.NewsModule}>
      <Title level={3} style={{ textAlign: 'center' }}>时事速递</Title>
      <Row gutter={[16, 16]} wrap>
        {newsList.map((item) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={6} key={item.id}>
            <Link href={`/news/${item.id}`} passHref>
              <Card
                hoverable
                cover={<Image src={item.image} alt={item.title} preview={false} />}
              >
                <Card.Meta
                  title={item.title}
                  description={item.date}
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


export default function Home() {

  useEffect(() => {
    

  }, [])
  

  const newsList = [
    { id: 1, title: '习近平主持召开二十届中央财经委员会第一次会议', date: '2023-05-05',image:'/img/7.png' },
    { id: 2, title: '习近平给中国农业大学科技小院的学生', date: '2023-05-03',image:'/img/7.png' },
    { id: 3, title: '习近平向全国广大劳动群众致以节日', date: '2023-04-30',image:'/img/7.png' },
    { id: 4, title: '习近平主持召开二十届中央财经委员会第一次会议', date: '2023-05-05',image:'/img/7.png' },
    /* { id: 5, title: '习近平给中国农业大学科技小院的学生', date: '2023-05-03',image:'/img/7.png' },
    { id: 6, title: '习近平向全国广大劳动群众致以节日', date: '2023-04-30',image:'/img/7.png' },
    { id: 7, title: '习近平主持召开二十届中央财经委员会第一次会议', date: '2023-05-05',image:'/img/7.png' },
    { id: 8, title: '习近平给中国农业大学科技小院的学生', date: '2023-05-03',image:'/img/7.png' },
    { id: 9, title: '习近平向全国广大劳动群众致以节日', date: '2023-04-30',image:'/img/7.png' },
    { id: 10, title: '习近平主持召开二十届中央财经委员会第一次会议', date: '2023-05-05',image:'/img/7.png' },
    { id: 11, title: '习近平给中国农业大学科技小院的学生', date: '2023-05-03',image:'/img/7.png' },
    { id: 12, title: '习近平向全国广大劳动群众致以节日', date: '2023-04-30',image:'/img/7.png' }, */
    /* { id: 10, title: '习近平主持召开二十届中央财经委员会第一次会议', date: '2023-05-05',image:'/img/7.png' },
    { id: 11, title: '习近平给中国农业大学科技小院的学生', date: '2023-05-03',image:'/img/7.png' },
    { id: 12, title: '习近平向全国广大劳动群众致以节日', date: '2023-04-30',image:'/img/7.png' }, */
    // 更多新闻
  ];

  return (
    <Layout className={styles.container}>
        <NavBar act="1"/>

        <Content className={styles.Content}
        >

          <Carousel className={styles.Carousel}
            autoplay 
          >
              <Image 
                className={styles.CarouselImage}
                src={"/img/xjp1.png"}  
                alt="学习强国"
                preview={false}
              />
            
            <Image className={styles.CarouselImage}
                src={"/img/other/4.jpg"}  
                alt="学习强国"
                preview={false}
              />
            <Image className={styles.CarouselImage}
                src={"/img/5.png"}  
                alt="学习强国"
                preview={false}
              />
          </Carousel>

          <NewsModule newsList={newsList} />
        </Content>
    </Layout>
  )
}
