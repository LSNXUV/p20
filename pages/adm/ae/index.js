
import styles from '../../../styles/adm/adm.module.css'

import { useEffect, useState } from 'react'

import AdMenu from '../../../components/adm/menu.js'

import {
  message, List, Button, Tooltip,
  Layout, Typography, Popconfirm,Modal,Empty 
} from 'antd';

import hostConfig from '../../../config/host.js'

const { apihost } = hostConfig

import axios from 'axios';
import { useRouter } from 'next/router';

const { Content } = Layout;
const { Title, Text } = Typography;

const Comments = ({data,fresh, messageApi }) => {

  const router = useRouter()
  const [Cmts, setCmts] = useState(data)

  useEffect(() => {
    
    console.log(Cmts)
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
        await freshCmts(id)
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

  const freshCmts = async (id) => {
    try {
      const response = await axios.post(
        apihost + '/v1/admin/comment/fetch',
        {
          id,
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
        console.log(response.data.data)
        setCmts(response.data.data.comments.data)
        messageApi.open({
          type: 'success',
          content: '刷新成功!',
        })
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
            description={"暂无评论哦"}
          />
        )}}
        header={
          <Title level={3}
            style={{ cursor: 'pointer', width: '8rem',}}
        
          >评论列表</Title>}
        pagination={{
          position: 'bottom',
          align: 'left',
          onChange: (page) => {
          },
          pageSize: 4,
        }}
        dataSource={Cmts}
        renderItem={(item) =>
          <List.Item
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
              }}>{item?.content ?? '暂无内容哦'}</Text>
          </List.Item>
        }
      />
    </div>
  )
}

const Aes = ({ articles, messageApi }) => {

  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalCmts, setmodalCmts] = useState([])

  const [Articles, setArticles] = useState(articles)

  useEffect(() => {
    
    freshAes()
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
  

  const delAe = async (id) => {

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
        await freshAes()
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
    router.push(`/adm/ae/${id}`)
  }

  const freshAes = async () => {
    try {
      const response = await axios.post(
        apihost + '/v1/admin/post/fetch',
        {
          pageSize: 18,
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
        setArticles(response.data.data.posts.data)
      }

    } catch (error) {
      messageApi.open({
        type: 'error',
        content: '刷新失败!',
      })
      console.error(error);
    }
  }

  const ModalCancel = () => {
    // console.log('cancle',modalData)

    // setmodalData(null)
    setModalOpen(false)
    
  }

  const ViewCmts = async (id) => {

    try {
      const response = await axios.post(
        apihost + '/v1/admin/post/getComments',
        {
          id,
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
        setmodalCmts(response.data?.data.comments.data) 
      }
  
    } catch (error) {
      console.error(error);
    }

    setModalOpen(true)
  }

  return (
    <div style={{ marginTop: '0vh', padding: '2vw' }}>
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
              onClick={()=>{
                freshAes()
                messageApi.open({
                  type: 'success',
                  content: '刷新成功!',
                })
              }}
            >文章列表</Title>
          </Tooltip>}
        pagination={{
          position: 'bottom',
          align: 'left',
          onChange: (page) => {
          },
          pageSize: 6,
        }}
        dataSource={Articles}
        renderItem={(item) =>
          <List.Item

            actions={[
              <Button key="submit" type="primary"
                onClick={() => {
                  ViewCmts(item.id)
                }}>
                查看评论
              </Button>,
              <Popconfirm
                title="删除"
                description="你确定要删除该文章吗?"
                okText="确认"
                cancelText="取消"
                onConfirm={() => {
                  delAe(item.id)
                }}
              >
                <Button key="delete" danger >删除</Button>
              </Popconfirm>,

            ]}
          // extra = {item.published_date}
          // style={{ cursor: 'pointer' }}

          >
            <Text
              style={{ cursor: 'pointer' }}
              onClick={() => {
                ViewDetail(item.id)
              }}>{item.title ?? '暂无标题哦'}</Text>
          </List.Item>
        }
      />
      {
        <Modal
          open={modalOpen}
          onCancel={ModalCancel}
          width='50vw'
          footer={[
          ]}
        >
          <Comments data={modalCmts} fresh={ViewCmts} messageApi={messageApi} />
        </Modal>
      }
    </div>
  )
}


export default function Ae({ }) {

  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const [Articles, setArticles] = useState( [])

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

      <AdMenu SelectKey={"31"} OpenSubKey={'3'} />
      {contextHolder}
      <Content className={styles.Content}
        style={{
          margin: '24px 16px',
          padding: '1vw 3vw',
          minHeight: '50vh',
        }}
      >
        <Aes articles={Articles} messageApi={messageApi} />
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