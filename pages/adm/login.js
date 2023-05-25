
import { useEffect,useState } from 'react'

import styles from '../../styles/adm/login.module.css'

import {
    Image, Form, Input, Button, Col, Row,
    Layout, Typography, Card, message,
    ConfigProvider
} from 'antd';

import hostConfig from '../../config/host.js'

const { apihost, domain } = hostConfig

import axios from 'axios';
import { useRouter } from 'next/router';


const { Title } = Typography;

export default function Login({ vcodepic,vcodeid }) {

    const [vcodePic, setvcodePic] = useState(vcodepic)
    const [vcodeId, setvcodeId] = useState(vcodeid)


    const router = useRouter()
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {

        if(sessionStorage.getItem('sk')){
            messageApi.open({
              type: 'success',
              content: '自动登录成功',
            })
            router.replace('/adm')
          }
    }, [])

    const refreshVcode = async () => {
        try {
            const response = await axios.post(
                apihost + '/v1/auth/captcha',
                {},
                {
                    timeout: 4000
                }
            )
            console.log(response?.data ?? response)
            if (response.data?.code === 0) {
                setvcodePic(response.data.data.captcha.img)
                setvcodeId(response.data.data.captcha.key) 
            }
            
            messageApi.open({
                type: 'success',
                content: '刷新成功!',
            })
        } catch (error) {
            messageApi.open({
                type: 'error',
                content: '刷新失败!',
            })
            console.error(error);
        }

    }

    const onFinish = async ({username,password,vcode}) => {

        //登录
        try {
            const response = await axios.post(
                apihost + '/v1/auth/login',
                {
                    username,
                    password,
                    captcha:vcode
                },
                {
                    headers:{
                        'Captcha-Key': vcodeId
                    },
                    timeout: 4000
                }
            )
            console.log(response)
            if (response.data?.code === 0) {
                
                //存token
                sessionStorage.setItem('sk',response.data.data.token.auth_data)
                

            }else{
                refreshVcode()
                return messageApi.open({
                    type: 'error',
                    content: response.data?.message,
                })
            }
            
        } catch (error) {
            console.error(error);
            
            return messageApi.open({
                type: 'error',
                content: '登录失败!',
            })
        }
        console.log('Success')
        messageApi.open({
            type: 'success',
            content: '登录成功!',
        })

        router.push('/adm')
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    }


    return (
        <Layout
            className={styles.container}
        >
            {contextHolder}
            <ConfigProvider
                theme={{
                    components:{
                        Card:{
                            boxShadow:'0 0 20px 100px rgba(0, 0, 0, 0.8)',
                            boxShadowSecondary:'0 0 20px 100px rgba(0, 0, 0, 0.8)'
                        }
                    }
                }}
            >
                <Card
                    hoverable
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '30vw',
                        boxShadow: '0 5px 14px 0 rgba(0, 0, 0, 0.4)'
                    }}
                >
                    <Title style={{ textAlign: 'center', marginBottom: '3vh' }} level={3}>管理员登录</Title>

                    <Form
                        name="basic"
                        /* labelCol={{
                            span: 5,
                        }}
                        wrapperCol={{
                            span: 20,
                        }} */
                        style={{
                            minWidth: '20vw',
                            // backgroundColor:'red',

                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        layout='vertical'
                        autoComplete="off"
                        size='middle'
                    >

                        <Form.Item
                            label="用户名"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '用户名不能为空!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '密码不能为空!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="验证码"
                            style={{
                                // backgroundColor:'blue',
                                display: 'flex',
                                flexDirection: 'row'
                            }}
                        >
                            <Row gutter={20}>
                                <Col span={10}>
                                    <Form.Item
                                        name="vcode"
                                        style={{
                                            // backgroundColor: 'skyblue',
                                            display: 'flex',
                                            flexDirection: 'row'
                                        }}
                                        rules={[{
                                            required: true,
                                            message: '请输入验证码!'
                                        }]}
                                    >
                                        <Input /* style={{ width: '7vw' }} */ />
                                    </Form.Item>
                                </Col>
                                <Col span={14}>
                                    <Image preview={false} src={vcodePic}
                                        onClick={refreshVcode}
                                        alt="验证码" /></Col>
                            </Row>
                        </Form.Item>


                        <Form.Item
                            style={{
                                // display: 'flex', justifyContent:'space-around',
                                // backgroundColor:'skyblue'   
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                登录
                            </Button>
                            <a className="login-form-forgot"
                                style={{ marginLeft: '12vw' }}
                                onClick={() => {
                                    messageApi.open({
                                        type: 'info',
                                        content: '请联系管理员',
                                    })
                                }}>
                                忘记密码
                            </a>
                        </Form.Item>

                    </Form>

                </Card>

            </ConfigProvider>
        </Layout>
    )
}

export const getStaticProps = async (ctx) => {

    let vcodepic = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAyCAMAAACgee/qAAABL1BMVEUAAABOYSRzhkl2iUyarXAuQQQ4Sw5yhUhKXSCQo2ZugURIWx6KnWBLXiFXai1sf0KfsnVBVBdzhkm2yYxjdjmesXTH2p2cr3JbbjGww4aOoWS90JOpvH97jlGyxYitwINdcDNtgEOgs3ayxYg0Rwo4Sw5GWRwzRgl3ik1IWx7C1ZiUp2pxhEeluHt7jlGHml02SQyAk1adsHNbbjFYay55jE+gs3aWqWwtQAOQo2Zoez6LnmGQo2ZMXyKzxok1SAt8j1JFWBt8j1LH2p02SQxhdDeGmVxBVBeitXiRpGenun0sPwJ8j1KuwYR0h0oxRAeGmVwqPQBbbjGitXhWaSw4Sw5ugUQ/UhVLXiGarXCqvYA9UBNxhEd1iEs5TA+ClVi/0pWyxYiww4ZtgEOClVjjf95bAAAAAXRSTlMAQObYZgAAA+1JREFUeJy8mFtr6k4QwGcNXmgo+tDUPlgUxJ76dKRIrYVgFamgYI+caj2KoP3+H+JP9n6ZjTGF/0B1s5mZ38x29uLC/yrbnxjGP+Buc5ITwzj+CdnpqWc3vJgbwwZ/MQeo1zOSc0gcxxuUPJ/P4Vf9FwBx3z0h+u8pkDFKTskYEq4UxX1yye/vfvJ4jJLPiMb9kmSAa4ec4mOsTC8Bi9bXV2JO+kkU19cOGZVP3RSRP7K19INZ2P0+I9Oeu3Pcz0/NFOH+EeTlcmlzG9pTMyGrcO7uzpLpZ+B978+YNBqK3Gw2VUCgZ0yc2p+oZhAI8k51YjPDAJOGVtFNwEhTIA54MtHJ0ynj7iQZmxku2/Wrg6fTqaYglCe69pR/X5Cx9Kbamnfulqg4kGmfS74dsOuUECB11bbiZMW4xt3/Nh8LivstyW3woJO2XNSdRAmdfus1St7/ZmS+dhYKBTtjIO12Gyo62wBbGQNESpFO+zUgce/3e8YVu0XBjS3JuFKpGDQ9BvHMv6MoMhTtfxV/3vM+z24h7St2h+Z5p7tVGfdddbcKZvz7kX11hXqETFMrQyJnqFkA/X4fC9OshdmMkR8fKbnb7TIvURT5p7H0s8NGQ2acCoYZL3qVMUtA4xKAqjFScuTQsNwOFAxJ0SMTX6/gU7VaBSChu14Qw8IbiBMotV3TqeGQlZxOpyohJAxDMC0tVBrYVOatW7vDIQMMCHkK7X7qqugB20+iIlUEt4dbX9BMOgCDwUDtLCtdu1gs6o8x6ilhib9EavTzcDj44mTcTkJWO8tqtVK6ART1iuMnfHt5JWYJ1GqcTD97XnTHel4pzSAIiPRLxAkf4WrpyoyZ9Hq9lKy9EiCFRkb2OKPTT5J1XfvlCTEYmr7V02g0Yo3IzCNLQpbO6eSSh0NKLjmB7HYjuWkYQ3HZMeHIyMgbxi2V+DGfB5Is4WLsI2NryMjl6sfj0aPwxn5XlkAc84emNdFX2MvORVTTy317E0cQ/OcFWl8XoV2Zg8oYtSIX/j9xHy53Pvcb0Ez/nXH7nIldBmhZZK19ZcbJuP/Syc/PWcjlcrnVajndDN65uhJkfXht7oNNzsAFSDK2tnAx3J1Oh3N5rrg8PNjkjLI164yel3nGQOx1CyXn5LIbKeVfnpet+n3BrD/yINn6vdluFGkr9xknz5cXhPzxoZFrWbl8x9KO3kn2KBXOZxyKfTgD2e3KfQMJYRhm5frlNRcZ71ZXFgePobr6eH3FyTc5whFXFgvzDMalqS5d7sGb8c1NVvJf+smWes5dLJCM2f0L497f+/1l5v5NyOal6QLVVPcvkMLNLnrGAPBfAAAA///x+WOcjWOw6AAAAABJRU5ErkJggg=="
    let vcodeid = 'BIcbiuabcBsaufas'
    try {
        const response = await axios.post(
            apihost + '/v1/auth/captcha',
            // 'https://v2.api-m.com/api/captcha?type=digit&width=120&height=50',
            {},
            {
                timeout: 4000
            }
        )
        // console.log(response?.data ?? response)
        if (response.data?.code === 0) {
            vcodepic = response.data.data.captcha.img
            vcodeid = response.data.data.captcha.key
        }

    } catch (error) {
        console.error(error);
    }

    return {
        props: {
            vcodepic,
            vcodeid
        }
    }
}