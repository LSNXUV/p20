
import styles from '../../../../styles/adm/adm.module.css'

import { useEffect, useState } from 'react'

import AdMenu from '../../../../components/adm/menu.js'

import {
  Image, message, List, Button, Tooltip,
  Layout, Typography, Popconfirm,Empty
} from 'antd';

import hostConfig from '../../../../config/host.js'

const { apihost, domain } = hostConfig

import axios from 'axios';
import { useRouter } from 'next/router';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;


const Comments = ({ data, messageApi }) => {

  const router = useRouter()
  const [Cmts, setCmts] = useState(data)

  useEffect(() => {
    
    
    freshCmts()
    
  }, [])
  

  const delCmt = async (id) => {

    try {
      const response = await axios.post(
        apihost + '/v1/admin/post/drop',
        {
          id
        },
        {
          headers: {
            Session: sessionStorage.getItem('sk') ?? '未登录 need login'
          },
          timeout: 4000
        }
      )
      if (response.data?.code === 0) {
        messageApi.open({
          type: 'success',
          content: response.data?.message,
        })
        await freshCmts()
      }

    } catch (error) {
      console.error(error);
      return messageApi.open({
        type: 'error',
        content: '网络错误!',
      })
    }
  }

  const ViewDetail = (id) => {
    router.push(`/adm/ae/cmt/${id}`)
  }

  const freshCmts = async () => {
    try {
      const response = await axios.post(
        apihost + '/v1/admin/comment/fetch',
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
        setCmts(response.data.data.comments.data)
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
    <div style={{ padding: '2vw' }}>
      <List
        locale={{emptyText:(
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={"暂无数据哦"}
          />
        )}}
        header={
          <Tooltip title={"点击刷新列表"}>
            <Title level={2}
              style={{ cursor: 'pointer', width: '8rem',/* backgroundColor:'red' */ }}
              onClick={ () => {
                freshCmts()
                messageApi.open({
                  type: 'success',
                  content: '刷新成功!',
                })
              }}
            >评论列表</Title>
          </Tooltip>}
        pagination={{
          position: 'bottom',
          align: 'left',
          onChange: (page) => {
          },
          pageSize: 6,
        }}
        dataSource={Cmts}
        renderItem={(item) =>
          <List.Item
            locale={{emptyText:(
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={"暂无评论哦"}
              />
            )}}
            actions={[
              <Popconfirm
                title="删除"
                description="你确定要删除该评论吗?"
                okText="确认"
                cancelText="取消"
                onConfirm={() => {
                  delCmt(item.id)
                }}
              >
                <Button type='primary' key="delete" danger >删除</Button>
              </Popconfirm>,
            ]}
          // extra = {item.published_date}
          // style={{ cursor: 'pointer' }}

          >
            <Text 
              style={{ cursor: 'pointer' }} 
              onClick={() => {
                  ViewDetail(item.id)
              }}>{item.content ?? '暂无内容哦'}</Text>
          </List.Item>
        }
      />
    </div>
  )
}


export default function Ae({  }) {

  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const [Cmts, setCmts] = useState([])

  useEffect(() => {

    if (!sessionStorage.getItem('sk')) {
      messageApi.open({
        type: 'error',
        content: '请先登录!',
        duration: 2,
        onClose: () => {
          router.replace('/adm/login')
        }
      })

      return
    }
  }, [])

  return (
    <Layout className={styles.container}>

      <AdMenu SelectKey={"32"} OpenSubKey={'3'} />
      {contextHolder}
      <Content className={styles.Content}
        style={{
          margin: '24px 16px',
          padding: '1vw 3vw',
          minHeight: '50vh',
        }}
      >
        <Comments data={Cmts} messageApi={messageApi} />
      </Content>

    </Layout>
  )
}

export const getStaticProps = async (ctx) => {

  
  return {
    props: {
    }
  }
}