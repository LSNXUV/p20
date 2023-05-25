
import styles from '../../../../styles/adm/adm.module.css'

import { useEffect, useState } from 'react'

import AdMenu from '../../../../components/adm/menu.js'

import {
    Image, message, List, Button, Tooltip, Input,
    Layout, Typography, Popconfirm, Space,
    Form, InputNumber, Select
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import hostConfig from '../../../../config/host.js'

const { apihost, domain } = hostConfig

import axios from 'axios';
import { useRouter } from 'next/router';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;


const Comment = ({ data, fresh, messageApi }) => {

    const router = useRouter()
    const [form] = Form.useForm();

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
        form.setFieldsValue(data)

    }, [data, form]);

    const onFinish = async (values) => {
        console.log(values)
        try {
            const response = await axios.post(
                apihost + '/v1/admin/comment/save',
                {
                    id: data.id,
                    ...values
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
                    content: '保存成功!',
                })
            }

        } catch (error) {
            console.error(error);
            messageApi.open({
                type: 'error',
                content: '保存失败!',
            })
        }

    }

    const delAe = async () => {
        try {
            const response = await axios.post(
                apihost + '/v1/admin/comment/drop',
                {
                    id: data.id
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
                router.replace('/adm/ae/cmt')
            }

        } catch (error) {
            console.error(error);
            return messageApi.open({
                type: 'error',
                content: '网络错误!',
            })
        }
    }

    return (
        <Form form={form} onFinish={onFinish}>
            <Button type='default' size='large' onClick={()=>router.back()}>
                <ArrowLeftOutlined />
            </Button>
            <Tooltip title={"点击刷新评论"} placement="topLeft" >
                <Title level={2}
                    style={{ marginBottom: '5vh', cursor: 'pointer', maxWidth: '15vw' }}
                    onClick={fresh}
                >编辑评论</Title>
            </Tooltip>
            <Form.Item label="用户名" name="author" style={{ width: '12vw' }}
                rules={[
                    {
                        required: true,
                        message: '用户名不能为空!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="内容" name="content" >
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="头像" name="avatar">
                <Input />
            </Form.Item>

            <Form.Item
                label="评论状态"
                name="status"
                rules={[
                    {
                        required: true,
                        message: '状态不能为空!',
                    },
                ]}
            >
                <Select placeholder="选择状态" style={{ width: '7vw' }}>
                    <Select.Option value={2}>2</Select.Option>
                    <Select.Option value={1}>1</Select.Option>
                    <Select.Option value={0}>0</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Space size={'large'}>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                    <Popconfirm
                        title="删除"
                        description="你确定要删除该评论吗?"
                        okText="确认"
                        cancelText="取消"
                        onConfirm={delAe}
                    >
                        <Button key="delete" danger >删除</Button>
                    </Popconfirm>
                </Space>
            </Form.Item>
        </Form>
    )
}

export default function Detail({ id }) {

    const [Cmt, setCmt] = useState({})
    const router = useRouter()
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
        freshCmt()
    }, [])

    const freshCmt = async () => {
        try {
            const response = await axios.post(
                apihost + '/v1/admin/comment/detail',
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
                setCmt(response.data.data.comment)
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Layout className={styles.container}>
            <AdMenu SelectKey={"32"} OpenSubKey={'3'}/>
            {contextHolder}
            <Content className={styles.Content}
                style={{
                    margin: '24px 16px',
                    padding: '5vh 5vw 10vh',
                    minHeight: '50vh',
                }}
            >
                <Comment data={Cmt} fresh={freshCmt} messageApi={messageApi} />
            </Content>
        </Layout>
    )
}

export const getServerSideProps = async ({ params }) => {

    const { id } = params



    return {
        props: {
            id
        }
    }
}

