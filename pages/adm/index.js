
import styles from '../../styles/adm/adm.module.css'

import { useEffect, useState } from 'react'

import AdMenu from '../../components/adm/menu.js'

import {
  Image, Modal, Button, Form, Input, Tooltip,
  Layout, Typography, List, Space, message, InputNumber,
  DatePicker, Select, Popconfirm, Empty
} from 'antd';

const { RangePicker } = DatePicker

import hostConfig from '../../config/host.js'

const { apihost } = hostConfig

import axios from 'axios';
import { useRouter } from 'next/router';

const { Content } = Layout;

const { Title, Text } = Typography;



const News = ({ messageApi }) => {

  const router = useRouter();

  const [newsList, setNewsList] = useState([]); // 新闻列表数据

  //modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setmodalData] = useState({})
  const [modalPic, setmodalPic] = useState(modalData?.pic_url)
  const [form] = Form.useForm();

  useEffect(() => {

    freshNews()
   
    form.resetFields()
    form.setFieldsValue(modalData)
    setmodalPic(modalData?.pic_url)
  }, [modalData, modalOpen]);

  const PageChange = (page) => {
    console.log(page)
  }

  const freshNews = async () => {
    try {
      const response = await axios.post(
        apihost + '/v1/admin/posterstand/fetch',
        {},
        {
          headers: {
            Session: sessionStorage.getItem('sk') ?? '未登录 need login'
          },
          timeout: 4000
        }
      )
      if (response.data?.code === 0) {
        setNewsList(response.data.data.posterStands)
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

    console.log(values)
    const { time, ...rest } = values
    try {
      const response = await axios.post(
        apihost + '/v1/admin/posterstand/save',
        {
          ...rest,
          id: values.id,
          start_date: time?.[0].format('YYYY-MM-DD HH:mm:ss'),
          end_date: time?.[0].format('YYYY-MM-DD HH:mm:ss')
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
        apihost + '/v1/admin/posterstand/drop',
        {
          id: modalData.id
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
        await freshNews()
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
    <div style={{ marginTop: '0vh', padding: '2vw' }}>
      <List
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={"暂无数据哦"}
            />
          )
        }}
        header={
          <Tooltip title={"点击刷新列表"}>
            <Title level={2}
              style={{ cursor: 'pointer', width: '12rem',/* backgroundColor:'red' */ }}
              onClick={() => {
                freshNews()
                messageApi.open({
                  type: 'success',
                  content: '刷新成功!',
                })
              }}
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
        //主页modal修改
        <Modal
          open={modalOpen}
          onCancel={ModalCancel}
          width='50vw'
          footer={[
            <Button key="submit" type="primary" form="modalForm" htmlType="submit">
              保存
            </Button>,
            <Popconfirm
              title="删除"
              description="你确定要删除该文章吗?"
              okText="确认"
              cancelText="取消"
              onConfirm={() => {
                ModalDelete()
              }}
            >
              <Button key="delete" danger>
                删除
              </Button>
            </Popconfirm>,

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
              <Form.Item name="pic_url" label="图片URL"
                rules={[{ required: true, message: '请填写图片URL' }]}

              >
                <Input onChange={(e) => { setmodalPic(e.target.value) }} />
              </Form.Item>

              <Form.Item>
                <Image alt='图片链接有误' height={'17vh'} src={modalPic}></Image>
              </Form.Item>

              <Form.Item name="desc" label="标题"
                rules={[{ required: true, message: '请填写标题' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item name="time" label="展示时间"
                rules={[
                  {
                    type: 'array',
                    message: '请选择展示时间!',
                  },
                ]}
              >
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
              </Form.Item>

              <Form.Item label="展示状态" name="status"
                rules={[
                  {
                    required: true,
                    message: '状态不能为空!',
                  },
                ]}
              >
                <Select placeholder="选择展示状态" style={{ width: '10vw' }}>
                  <Select.Option value={1}>展示</Select.Option>
                  <Select.Option value={0}>不展示</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="排序" name="sort"
                rules={[
                  {
                    type: 'number',

                  },
                ]}>
                <InputNumber />
              </Form.Item>

              {/* Add more form fields as needed */}
            </Space>
          </Form>
        </Modal>
      }
    </div>
  );
};


export default function Home({ }) {

  const router = useRouter();
  // const [news, setnews] = useState([])
  const [messageApi, contextHolder] = message.useMessage();
  const [isMessageShown, setIsMessageShown] = useState(false);

  useEffect(() => {

    if (!sessionStorage.getItem('sk')  && !isMessageShown) {
      setIsMessageShown(true);
      messageApi.open({
        type: 'error',
        content: '请先登录!',
        duration: 2,
        onClose: () => {
          router.push('/adm/login')
        }
      })
    }
  }, [isMessageShown,router])


  return (
    <Layout className={styles.container}>

      <AdMenu SelectKey="1" />
      {contextHolder}
      <Content className={styles.Content}
        style={{
          margin: '24px 16px',
          padding: '1vw 3vw',
          minHeight: '50vh'
        }}
      >
        <News messageApi={messageApi} />
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