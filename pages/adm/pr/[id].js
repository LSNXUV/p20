
import styles from '../../../styles/adm/adm.module.css'

import { useEffect, useState } from 'react'

import AdMenu from '../../../components/adm/menu.js'

import {
    Image, message, Button, Tooltip, Input,
    Layout, Typography, Popconfirm, Space,
    Form, InputNumber, Select
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import hostConfig from '../../../config/host.js'

const { apihost } = hostConfig

import axios from 'axios';
import { useRouter } from 'next/router';

const { Content } = Layout;
const { Title } = Typography;


const Pr = ({ pr, fresh, messageApi }) => {

    const router = useRouter()
    const [form] = Form.useForm();
    const [Avatar, setAvatar] = useState(pr?.avatar)

    useEffect(() => {
        
        form.setFieldsValue(pr);
        setAvatar(pr?.avatar)
    }, [pr,form]);

    const onFinish = async (values) => {
    
        try {
            const response = await axios.post(
                apihost + '/v1/admin/example/save',
                {
                    id: pr.id,
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

    const delPr = async () => {
        try {
            const response = await axios.post(
                apihost + '/v1/admin/example/drop',
                {
                    id:pr.id
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
                router.replace('/adm/pr')
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
            <Tooltip title={"点击刷新榜样列表"} placement="topLeft" >
                <Title level={1}
                    style={{ marginBottom: '5vh', cursor: 'pointer', maxWidth: '15vw' }}
                    onClick={fresh}
                >编辑榜样</Title>
            </Tooltip>

            <Form.Item label="名字" name="name" style={{ width: '12vw' }}
                rules={[
                    {
                        required: true,
                        message: '名字不能为空!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="头像" name="avatar" style={{ width: '12vw' }}>
                <Input onChange={ (e) => {
                    setAvatar(e.target.value)
                }}/>
            </Form.Item>

            <Form.Item>
                <Image height={'30vh'} alt='图片链接有误' src={'/img/example/avatar/'+Avatar}></Image>
              </Form.Item>

            <Form.Item label="简介" name="detail">
                <Input.TextArea minLength={200} />
            </Form.Item>
            <Form.Item label="事迹" name="story" >
                <Input.TextArea style={{minHeight:'30vh'}}/>
            </Form.Item>
            
            <Form.Item
                label="状态"
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

            <Form.Item label="排序" name="sort"
                rules={[
                    {
                        type: 'number',

                    },
                ]}>
                <InputNumber />
            </Form.Item>

            <Form.Item>
                <Space size={'large'}>
                    <Button type="primary" htmlType="submit">
                        保存
                    </Button>
                    <Popconfirm
                        title="删除"
                        description="你确定要删除该榜样吗?"
                        okText="确认"
                        cancelText="取消"
                        onConfirm={delPr}
                    >
                        <Button key="delete" danger >删除</Button>
                    </Popconfirm>
                </Space>
            </Form.Item>
        </Form>
    )
}

export default function PrDetail({id }) {

    const [Pioneer, setPioneer] = useState(null)
    const router = useRouter()

    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {

        freshAe()
    }, [])

    const freshAe = async () => {
        try {
            const response = await axios.post(
                apihost + '/v1/admin/example/detail',
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
                setPioneer(response.data.data.example)
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Layout className={styles.container}>
            <AdMenu />
            {contextHolder}
            <Content className={styles.Content}
                style={{
                    margin: '24px 16px',
                    padding: '5vh 5vw 10vh',
                    minHeight: '50vh',
                }}
            >
                <Pr pr={Pioneer} fresh={freshAe} messageApi={messageApi} />
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

