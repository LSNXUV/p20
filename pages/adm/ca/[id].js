
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


const Drama = ({ drama, fresh, messageApi }) => {

    const router = useRouter()
    const [form] = Form.useForm();
    const [NameImg, setNameImg] = useState(drama?.name_img)

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
        form.setFieldsValue(drama);
        setNameImg(drama?.name_img)
    }, [drama, form]);

    const onFinish = async (values) => {

        try {
            const response = await axios.post(
                apihost + '/v1/admin/drama/save',
                {
                    id: drama.id,
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

    const delDrama = async () => {
        try {
            const response = await axios.post(
                apihost + '/v1/admin/drama/drop',
                {
                    id: drama.id
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
                router.replace('/adm/ca')
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
            <Button type='default' size='large' onClick={() => router.back()}>
                <ArrowLeftOutlined />
            </Button>
            <Tooltip title={"点击刷新"} placement="topLeft" >
                <Title level={1}
                    style={{ marginBottom: '5vh', cursor: 'pointer', maxWidth: '15vw' }}
                    onClick={() => {
                        fresh()
                        messageApi.open({
                            type: 'success',
                            content: '刷新成功!',
                        })
                    }}
                >编辑影剧</Title>
            </Tooltip>

            <Form.Item label="剧名" name="name" style={{ width: '12vw' }}
                rules={[
                    {
                        required: true,
                        message: '剧名不能为空!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item label="剧情简介" name="desc">
                <Input.TextArea />
            </Form.Item>

            <Form.Item label="艺术字URL" name="name_img" style={{ width: '20vw' }}
                rules={[
                    {
                        required: true,
                        message: '不能为空!',
                    },
                ]}
            >
                <Input onChange={(e) => {
                    setNameImg(e.target.value)
                }} />
            </Form.Item>

            <Form.Item /* label={<Title level={3}>预览</Title>} */>
                <Image height={'16vh'} alt='图片链接有误' src={'/img/drama/' + NameImg}></Image>
            </Form.Item>

            <Form.Item label="视频URL" name="bg_video"
                rules={[
                    {
                        required: true,
                        message: '视频URL不能为空!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item label="第三方视频URL" name="watch_url"
                rules={[
                    {
                        required: true,
                        message: '第三方视频URL不能为空!',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item label="状态" name="status"
                rules={[
                    /* {
                        required: true,
                        message: '状态不能为空!',
                    }, */
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
                        description="你确定要删除该影剧吗?"
                        okText="确认"
                        cancelText="取消"
                        onConfirm={delDrama}
                    >
                        <Button key="delete" danger >删除</Button>
                    </Popconfirm>
                </Space>
            </Form.Item>
        </Form>
    )
}

export default function CaDetail({ id }) {

    const [drama, setDrama] = useState({})

    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {

        freshDrama()
    }, [])

    const freshDrama = async () => {
        try {
            const response = await axios.post(
                apihost + '/v1/admin/drama/detail',
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
                setDrama(response.data.data.drama)
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
                <Drama drama={drama} fresh={freshDrama} messageApi={messageApi} />
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

