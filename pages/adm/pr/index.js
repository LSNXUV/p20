
import styles from '../../../styles/adm/adm.module.css'

import { useEffect, useState } from 'react'

import AdMenu from '../../../components/adm/menu.js'

import {
  Image, Row, Col, Card,
  Layout, Typography, Tooltip, message,
} from 'antd';

import hostConfig from '../../../config/host.js'

const { apihost } = hostConfig

import axios from 'axios';
import Link from 'next/link';

const { Content } = Layout;
const { Title, Text } = Typography;


const Prs = ({ prs, fresh, messageApi }) => {


  useEffect(() => {


  })


  return (
    <div >
      <Tooltip title={"点击刷新榜样列表"} >
        <Title level={2}
          style={{
            cursor: 'pointer', textAlign: 'center'
            , marginBottom: '5vh', width: '10rem'
          }}
          onClick={() => {
            fresh()
            messageApi.open({
              type: 'success',
              content: '刷新成功!',
            })
          }}
        >榜样先锋</Title>
      </Tooltip>
      <Row gutter={[16, 16]} wrap>
        {prs.map((item) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={10} key={item.id}>
            <Link href={`/adm/pr/${item.id}`} passHref>
              <Card
                hoverable
                className={styles.CardContainer}
                style={{ overflow: 'hidden' }}
                actions={[<Title level={4}>{`🌹 ${item.flowers_count}`}</Title>]}
                cover={
                  <div className={styles.CardImageContainer}>
                    <Image
                      height={'40vh'}
                      width={'100%'}
                      className={styles.CardImage}
                      style={{objectPosition:'0vw -7vh'}}
                      fallback='https://www.hangzhou.com.cn/templateRes/202209/08/103025/assets/images/banner.jpg'
                      src={'/img/example/avatar/' + item.avatar} alt={item.name} preview={false}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={item.name}
                  description={item.detail}
                  style={{ maxHeight: '18vh' }}
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}


export default function Pr({ }) {

  const [Pioneers, setPioneers] = useState([])
  const [messageApi, contextHolder] = message.useMessage()

  useEffect(() => {

    if (!sessionStorage.getItem('sk')) {
      messageApi.open({
        type: 'error',
        content: '请先登录!',
        duration: 2,
        onClose: () => {
          router.push('/adm/login')
        }
      })

      return
    }
    freshPrs()
  }, [])

  const freshPrs = async () => {
    try {
      const response = await axios.post(
        apihost + '/v1/admin/example/fetch',
        {

        },
        {
          headers: {
            Session: sessionStorage.getItem('sk') ?? '未登录 need login'
          },
          timeout: 4000
        }
      )
      console.log(response.data)
      if (response.data?.code === 0) {

        setPioneers(response.data.data.examples.data)
      }

    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '刷新失败!',
      })
      console.error(error);
    }
  }

  return (
    <Layout className={styles.container}>

      <AdMenu SelectKey={"21"} OpenSubKey={'2'} />
      {contextHolder}
      <Content className={styles.Content}
        style={{
          margin: '24px 16px',
          padding: '5vh 5vw 10vh',
          minHeight: '50vh',
        }}
      >
        <Prs prs={Pioneers} fresh={freshPrs} messageApi={messageApi} />
      </Content>

    </Layout>
  )
}

/* export const getStaticProps = async (ctx) => {


  return {
    props: {
    }
  }
} */