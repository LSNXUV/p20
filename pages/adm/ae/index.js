
import styles from '../../../styles/adm/adm.module.css'

import { useEffect,useState } from 'react'

import AdMenu from '../../../components/adm/menu.js'

import {
  Image,message,List,Button,Tooltip,
  Layout, Typography,Popconfirm 
} from 'antd';

import hostConfig from '../../../config/host.js'

const { apihost, domain } = hostConfig

import axios from 'axios';
import { useRouter } from 'next/router';

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;


const Aes = ({articles,messageApi}) => {
  
  const [Articles, setArticles] = useState(articles)

  const freshAes = async () => {
    try {
      const response = await axios.post(
        apihost + '/v1/admin/post/fetch',
        {
          pageSize:8,
          page:1
        },
        {
          headers: {
            Session: sessionStorage.getItem('sk') ?? '未登录 need login'
          },
          timeout: 4000
        }
      )
      if (response.data?.code === 0) {
        setArticles(response.data.data)
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
    <div style={{ marginTop: '0vh',padding:'2vw' }}>
      <List
        header={
          <Tooltip title={"点击刷新列表"}>
            <Title level={2}
              style={{cursor:'pointer',width:'8rem',/* backgroundColor:'red' */}}
              onClick={freshAes}
            >文章列表</Title>
          </Tooltip>}
        pagination={{
          position: 'bottom',
          align: 'left',
          
        }}
        dataSource={Articles}
        renderItem={(item) =>
          <List.Item
            actions={[
              <Button key="submit" type="primary" >
                查看详情
              </Button>,
              <Popconfirm
                title="删除文章"
                description="你确定要删除该文章吗?"
                okText="确认删除"
                cancelText="我再想想"
              >
                <Button key="delete" danger 

                >
                  删除
                </Button>
              </Popconfirm>,
  
            ]}
            // extra = {item.published_date}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              
             
            }}
          >
            <Text>{item.title ?? '暂无标题哦'}</Text>
          </List.Item>
        }
      />
    </div>
  )
}


export default function Ae({acls}) {

  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const [Articles, setArticles] = useState(acls ?? [])

  useEffect(() => {

    if(!sessionStorage.getItem('sk')){
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
        <Aes articles={Articles} messageApi={messageApi}/>
      </Content>

    </Layout>
  )
}

export const getStaticProps = async (ctx) => {

  let acls = [
    {
			"id": 1,
			"editor": "许建文",
			"author": "新华社",
			"title": "习近平主持召开二十届中央财经委员会第一次会议强调 加快建设以实体经济为支撑的现代化产业体系 以人口高质量发展支撑中国式现代化",
			"published_date": "2023-05-08 15:09:11",
			"url": "https://cpc20.ctbu.org/news/1"
		},
		{
			"id": 2,
			"editor": "许建文",
			"author": "共产党员网",
			"title": "二十大报告学习汇编 | 深入推进现代预算制度改革重点任务",
			"published_date": "2023-05-08 15:09:11",
			"url": "https://cpc20.ctbu.org/news/2"
		},
		{
			"id": 3,
			"editor": null,
			"author": "共产党员网",
			"title": "【二十大代表风采录】李群：与病毒赛跑的疾控人",
			"published_date": "2023-05-08 15:09:11",
			"url": "https://cpc20.ctbu.org/news/3"
		},
		{
			"id": 4,
			"editor": null,
			"author": null,
			"title": "【二十大代表风采录】于吉红：科技梦助推中国梦",
			"published_date": "2023-05-08 15:09:11",
			"url": "https://cpc20.ctbu.org/news/4"
		},
		{
			"id": 5,
			"editor": null,
			"author": null,
			"title": "习近平新时代中国特色社会主义思想",
			"published_date": "2023-05-08 15:09:11",
			"url": "https://cpc20.ctbu.org/learn/5"
		},
		{
			"id": 6,
			"editor": "许建文",
			"author": "求是",
			"title": "习近平：更好把握和运用党的百年奋斗历史经验",
			"published_date": "2023-05-08 15:09:11",
			"url": "https://cpc20.ctbu.org/learn/6"
		},
		{
			"id": 7,
			"editor": "周世雄",
			"author": "中央党史和文献研究院网站",
			"title": "【党史百年·天天读】5月7日",
			"published_date": "2023-05-08 15:09:11",
			"url": "https://cpc20.ctbu.org/learn/7"
		},
		{
			"id": 8,
			"editor": "徐瑶",
			"author": "新华社",
			"title": "二十大报告摘登 | 新时代十年的伟大变革具有里程碑意义",
			"published_date": "2023-05-08 15:09:11",
			"url": "https://cpc20.ctbu.org/learn/8"
		}
	]

  try {
    const response = await axios.post(
      apihost + '/v1/admin/post/fetch',
      {
        pageSize:8,
        page:1
      },
      {
        timeout: 4000
      }
    )
    if (response.data?.code === 0) {
      acls = response.data?.data
    }

  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      acls
    }
  }
}