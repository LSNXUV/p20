
import styles from '../../../styles/adm/adm.module.css'

import { useEffect, useState } from 'react'

import AdMenu from '../../../components/adm/menu.js'

import {
    message, Button, Tooltip, Input,
    Layout, Typography, Popconfirm, Space,
    Form, InputNumber, Select, Image
} from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import hostConfig from '../../../config/host.js'

const { apihost } = hostConfig

import axios from 'axios';
import { useRouter } from 'next/router';

const { Content } = Layout;
const { Title } = Typography;


const Ae = ({ article, fresh, messageApi }) => {

    const router = useRouter()
    const [form] = Form.useForm();
    const [TopImage, setTopImage] = useState(article?.pined_photo)

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
        form.setFieldsValue(article);
        setTopImage(article?.pined_photo)

    }, [article, form]);

    const onFinish = async (values) => {
        console.log(values)
        try {
            const response = await axios.post(
                apihost + '/v1/admin/post/save',
                {
                    id: article.id,
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
                apihost + '/v1/admin/post/drop',
                {
                    id: article.id
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
                router.replace('/adm/ae')
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
            <Tooltip title={"点击刷新列表"} placement="topLeft" >
                <Title level={1}
                    style={{ marginBottom: '5vh', cursor: 'pointer', maxWidth: '15vw' }}
                    onClick={fresh}
                >编辑文章</Title>
            </Tooltip>
            <Form.Item label="标题" name="title"
                rules={[
                    {
                        required: true,
                        message: '日期不能为空!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="编辑" name="editor" style={{ width: '10rem' }}>
                <Input />
            </Form.Item>
            <Form.Item label="作者" name="author" style={{ width: '18rem' }}>
                <Input />
            </Form.Item>

            <Form.Item label="内容" name="content">
                <Input.TextArea autoSize={{ maxRows: 14 }} />
            </Form.Item>



            <Form.Item label="是否置顶" name="pined_status"
                rules={[
                    {
                        required: true,
                        message: '状态不能为空!',
                    },
                ]}
            >
                <Select placeholder="选择状态" style={{ width: '6rem' }}>
                    <Select.Option value={1}>置顶</Select.Option>
                    <Select.Option value={0}>不置顶</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="置顶图片" name="pined_photo">
                <Input onChange={(e) => {
                    setTopImage(e.target.value)
                }} />
            </Form.Item>

            <Form.Item>
                <Image height={'20vh'} alt='图片链接有误' src={TopImage}></Image>
            </Form.Item>

            <Form.Item label="发布日期" name="published_date"
                rules={[
                    {
                        required: true,
                        message: '日期不能为空!',
                    },
                ]}
            >
                <Input style={{ width: '10rem' }} />
            </Form.Item>

            <Form.Item label="状态" name="status"
                rules={[
                    {
                        required: true,
                        message: '状态不能为空!',
                    },
                ]}
            >
                <Select placeholder="选择状态" style={{ width: '6rem' }}>
                    <Select.Option value={2}>2</Select.Option>
                    <Select.Option value={1}>1</Select.Option>
                    <Select.Option value={0}>0</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="评论状态" name="comment_status"
                rules={[
                    {
                        required: true,
                        message: '状态不能为空!',
                    },
                ]}
            >
                <Select placeholder="选择状态" style={{ width: '6rem' }}>
                    <Select.Option value={2}>2</Select.Option>
                    <Select.Option value={1}>1</Select.Option>
                    <Select.Option value={0}>0</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="文章类型" name="type"
                rules={[
                    {
                        required: true,
                        message: '状态不能为空!',
                    },
                ]}
            >
                <Select placeholder="选择状态" style={{ width: '6rem' }}>
                    <Select.Option value={"news"}>news</Select.Option>
                    <Select.Option value={"study"}>study</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item label="置顶排序" name="pined_sort"
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
                        description="你确定要删除该文章吗?"
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

    const [Article, setArticle] = useState({})
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
        freshAe()
    }, [])

    const freshAe = async () => {
        try {
            const response = await axios.post(
                apihost + '/v1/admin/post/detail',
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
                setArticle(response.data.data.post)
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
                <Ae article={Article} fresh={freshAe} messageApi={messageApi} />
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

