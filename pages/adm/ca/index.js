
import styles from '../../../styles/adm/adm.module.css'

import { useEffect, useState } from 'react'

import AdMenu from '../../../components/adm/menu.js'

import {
  Image, Tooltip, Row, Col, Card,
  Layout, Typography, message,

} from 'antd';

import hostConfig from '../../../config/host.js'

const { apihost } = hostConfig

import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';

const { Content } = Layout;
const { Title } = Typography;


const Cinema = ({ dramas, fresh, messageApi }) => {

  useEffect(() => {


  })

  return (
    <div >
      <Tooltip title={"点击刷新影剧列表"} >
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
        >影剧管理</Title>
      </Tooltip>
      <Row gutter={[16, 16]} wrap>
        {dramas.map((item) => (
          <Col xs={24} sm={12} md={8} lg={8} xl={6} key={item.id}>
            <Link href={`/adm/ca/${item.id}`} passHref>
              <Card
                hoverable
                className={styles.CardContainer}
                style={{ overflow: 'hidden', }}
                cover={
                  <div className={styles.CardImageContainer}>
                    <Image
                      height={'14vh'}
                      width={'100%'}
                      className={styles.CardImage}
                      style={{ objectFit: 'contain' }}
                      fallback='https://www.hangzhou.com.cn/templateRes/202209/08/103025/assets/images/banner.jpg'
                      src={'/img/drama/' + item.name_img} alt={item.name} preview={false}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={<Title level={3}
                    style={{ lineHeight: '0.8rem' }}
                  >{item.name}</Title>}

                  description={item.desc}
                  style={{ height: '18vh' }}
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}


export default function Ca({ }) {

  const router = useRouter();
  const [Cas, setCas] = useState([])
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {

    freshCa()
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
  }, [])

  const freshCa = async () => {
    try {
      const response = await axios.post(
        apihost + '/v1/admin/drama/fetch',
        {
          pageSize: 8,
          page: 1
        },
        {
          headers: {
            Session: sessionStorage.getItem('sk') ?? '未登录 need login'
          },
          timeout: 4000
        }
      )
      if (response.data?.code === 0) {
        setCas(response.data.data.dramas.data)
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

      <AdMenu SelectKey={"4"} />
      {contextHolder}
      <Content className={styles.Content}
        style={{
          margin: '24px 16px',
          padding: '1vw 3vw',
          minHeight: '50vh',
        }}
      >
        <Cinema dramas={Cas} fresh={freshCa} messageApi={messageApi} />

      </Content>

    </Layout>
  )
}

export const getStaticProps = async (ctx) => {


  try {
    const response = await axios.post(
      apihost + '/v1/posterstands/fetch',
      {},
      {
        timeout: 4000
      }
    )
    if (response.data?.code === 0) {

    }

  } catch (error) {
    console.error(error);
  }

  return {
    props: {
    }
  }
}