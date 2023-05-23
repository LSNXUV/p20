
import styles from '../../styles/adm/adm.module.css'

import { useEffect, useState } from 'react'

import AdMenu from '../../components/adm/menu.js'

import {
  Image, theme, Modal, Button, Form, Input,Tooltip,
  Layout, Typography, List, Pagination, Space,message

} from 'antd';

import hostConfig from '../../config/host.js'

const { apihost, domain } = hostConfig

import axios from 'axios';
import { useRouter } from 'next/router';

const { Content, Sider, Header } = Layout;

const { Title, Text } = Typography;



const News = ({ lists,messageApi }) => {

  const router = useRouter();

  const [newsList, setNewsList] = useState(lists ?? []); // 新闻列表数据

  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setmodalData] = useState(null)
  const [form] = Form.useForm();

  useEffect(() => {
    if(!sessionStorage.getItem('sk')){
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

    form.resetFields()
    form.setFieldsValue(modalData)
  }, [modalData,modalOpen]);

  const PageChange = (page) => {
    console.log(page)
  }

  const freshNews = async () => {
    try {
      const response = await axios.post(
        apihost + '/v1/admin/poststand/fetch',
        {},
        {
          headers: {
            Session: sessionStorage.getItem('sk') ?? '未登录 need login'
          },
          timeout: 4000
        }
      )
      if (response.data?.code === 0) {
        setNewsList(response.data.data)
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

  const ModalCancel = () => {
    // console.log('cancle',modalData)

    // setmodalData(null)
    setModalOpen(false)
    
  }

  const ModalSubmit = async values => {
 
    try {
      const response = await axios.post(
        apihost + '/v1/admin/poststand/save',
        {
          id: values.id,
          pic_url: values.pic_url,
          description: values.desc
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
      }
  
    } catch (error) {
      console.error(error);
      return messageApi.open({
          type: 'error',
          content: '网络错误!',
      })
    }


    setModalOpen(false);
    messageApi.open({
      type: 'success',
      content: '保存成功!',
    })

  }

  const ModalDelete = async () => {

    try {
      const response = await axios.post(
        apihost + '/v1/admin/poststand/drop',
        {
          id:modalData.id
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
      }
  
    } catch (error) {
      console.error(error);
      return messageApi.open({
          type: 'error',
          content: '网络错误!',
      })
    }


    setModalOpen(false);
    messageApi.open({
      type: 'success',
      content: '删除成功!',
    })
  }

  return (
    <div style={{ marginTop: '0vh',padding:'2vw' }}>
      <List
        header={
          <Tooltip title={"点击刷新列表"}>
            <Title level={2}
              style={{cursor:'pointer',width:'12rem',/* backgroundColor:'red' */}}
              onClick={freshNews}
            >主页轮播列表</Title>
          </Tooltip>}
        pagination={{
          position: 'bottom',
          align: 'left',
          onChange: PageChange
        }}
        dataSource={newsList}
        renderItem={(item) =>
          <List.Item
            style={{ cursor: 'pointer' }}
            onClick={() => {
              
              // form.setFieldValue(item)
              setmodalData(item)
              setModalOpen(true)
            }}
          >
            <Text>{item.desc ?? '暂无描述哦'}</Text>
          </List.Item>
        }
      />
      {
        // selectId &&
        <Modal
          open={modalOpen}
          onCancel={ModalCancel}
          footer={[
            <Button key="submit" type="primary" form="modalForm" htmlType="submit">
              保存
            </Button>,
            <Button key="delete" danger onClick={ModalDelete}>
              删除
            </Button>,

          ]}
        >
          <Form
            id="modalForm"
            form={form}
            style={{ marginTop: '5vh' }}
            onFinish={ModalSubmit}
          >
            <Space
              direction="vertical"
              size="middle"
              style={{
                width: '100%',
              }}
            >
              <Form.Item
                name="pic_url"
                label="图片URL"
                rules={[{ required: true, message: '请填写图片URL' }]}
                
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="desc"
                label="标题"
                rules={[{ required: true, message: '请填写标题' }]}
              >
                <Input />
              </Form.Item>

              {/* Add more form fields as needed */}
            </Space>
          </Form>
        </Modal>
      }
    </div>
  );
};


export default function Home({ news }) {

  const router = useRouter();

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if(!sessionStorage.getItem('sk')){
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


  return (
    <Layout className={styles.container}>

      <AdMenu />
      {contextHolder}
      <Content className={styles.Content}
        style={{
          margin: '24px 16px',
          padding: '1vw 3vw',
          minHeight: '50vh',
          backgroundColor:''
        }}
      >
        <News lists={news} messageApi={messageApi}/>
      </Content>

    </Layout>
  )
}

export const getStaticProps = async (ctx) => {

  let news = [
    {
      "id": 1,
      "pic_url": "https://www.hangzhou.com.cn/templateRes/202209/08/103025/assets/images/banner.jpg",
      "desc": '习近平：更好把握和运用党的百年奋斗历史经验',
      "sort": 1,
      "start_date": 1683433128,
      "end_date": null,
      "status": 1,
      "created_at": 1683433128,
      "updated_at": 1683433128
    }, {
      "id": 3,
      "pic_url": "https://www.hangzhou.com.cn/templateRes/202309/08/103025/assets/images/banner.jpg",
      "desc": '习近平新时代中国特色社会主义思想',
      "sort": 1,
      "start_date": 1683433128,
      "end_date": null,
      "status": 1,
      "created_at": 1683433128,
      "updated_at": 1683433128
    },
    {
      "id": 4,
      "pic_url": "https://www.hangzhou.com.cn/templateRes/202409/08/103025/assets/images/banner.jpg",
      "desc": null,
      "sort": 1,
      "start_date": 1683433128,
      "end_date": null,
      "status": 1,
      "created_at": 1683433128,
      "updated_at": 1683433128
    },
    {
      "id": 5,
      "pic_url": "https://www.hangzhou.com.cn/templateRes/202509/08/103025/assets/images/banner.jpg",
      "desc": null,
      "sort": 1,
      "start_date": 1683433128,
      "end_date": null,
      "status": 1,
      "created_at": 1683433128,
      "updated_at": 1683433128
    },
    {
      "id": 6,
      "pic_url": "https://www.hangzhou.com.cn/templateRes/202609/08/103025/assets/images/banner.jpg",
      "desc": '习近平：更好把握和运用党的百年奋斗历史经验',
      "sort": 1,
      "start_date": 1683433128,
      "end_date": null,
      "status": 1,
      "created_at": 1683433128,
      "updated_at": 1683433128
    },
    {
      "id": 7,
      "pic_url": "https://www.hangzhou.com.cn/templateRes/202709/08/103025/assets/images/banner.jpg",
      "desc": null,
      "sort": 1,
      "start_date": 1683433128,
      "end_date": null,
      "status": 1,
      "created_at": 1683433128,
      "updated_at": 1683433128
    }
  ]


  try {
    const response = await axios.post(
      apihost + '/v1/admin/poststand/fetch',
      {},
      {
        headers: {
          Session: sessionStorage.getItem('sk') ?? '未登录 need login'
        },
        timeout: 4000
      }
    )
    if (response.data?.code === 0) {
      news = response.data.data
    }

  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      news
    }
  }
}