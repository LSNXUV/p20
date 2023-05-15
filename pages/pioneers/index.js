import React, { useState, useEffect, useRef } from 'react';

import styles from '../../styles/pioneer/pi.module.css'

import { } from '@ant-design/icons';

import hostConfig from '../../config/host.js'
const { apihost, domain } = hostConfig


import {
  Row, Col, Image, Typography,
  Button,ConfigProvider,Layout
} from 'antd';

import NavBar from '../../components/NavBar.js';

import { v4 as uuidv4 } from 'uuid';


import axios from 'axios';

const { Title, Text, Paragraph } = Typography;


const Barrage = ({ prebrs,pid}) => {

  const [barrages, setBarrages] = useState([])

  const [fAnimation, setfAnimation] = useState('')
  const [flowerAready, setflowerAready] = useState(false)


  useEffect(() => {

    // 初始化预置弹幕
    const initialBarrages = prebrs.map((brs, index) => ({
      id: brs.id,
      content: `(${brs.time}) 来自${brs.from_city}的网友献了一朵🌹`,
      border:'',
      top: index * 27,
      duration: 8,
      delay: (Math.random() * 5) + 's',
    }));
    console.log('initialBarrages: ', initialBarrages);
    setBarrages(initialBarrages);
  }, [prebrs]);


  const addBarrage = async () => {
    
    let time = 0.7
    setfAnimation(`flower linear ${time}s`)
    setTimeout(() => {
      setfAnimation('')
    }, time * 2000);
    if(flowerAready){

      return 
    }

    let newBarrage = {
      id: uuidv4(),
      content: '你献出了一朵鲜花🌹',
      border: '1px solid #fff',
      top: Math.floor(Math.random() * 10) * 27,
      duration: 8,
    }
    
    setBarrages([...barrages, newBarrage])

    try {
        const response = await axios.post(
          apihost+'/v1/example/sendLike',
          {id:pid},
          {
            timeout: 3000
          }
        )
        if (response?.data?.code === 0) {
          let data = response.data.data;
          newBarrage = {
            ...newBarrage,
            id: data.id
          }

          /* setBarrages(prevBarrages => {
            const newBarrages = prevBarrages.slice(0, -1); // 移除最后一项
            newBarrages.push(newBarrage); // 添加新的弹幕
            return newBarrages;
          }) */
        
        }
  
      } catch (error) {
        console.error(error);
      }

    console.log(barrages)

    setflowerAready(true)
    // console.log([...barrages, newBarrage].slice(1))
  }

  const onAnimationEnd = (index) => {
    
    const currentBarrages = [...barrages]; // 创建一个本地变量
    const currentBarrage = currentBarrages[index];

    let newTop = Math.floor(Math.random() * 10) * 27
    let isOverlapping = true;
    let ct = 0
    while (isOverlapping && ct++ < 40) {
      isOverlapping = false;
      for (let i = 0; i < currentBarrages.length; i++) {
        if (i === index) continue;
        if (Math.abs(barrages[i].top - newTop) < 27) {
          isOverlapping = true;
          newTop = Math.floor(Math.random() * 10) * 27;
          break;
        }
      }
    }
    const updatedBarrage = {
      ...currentBarrage,
      id: uuidv4(),
      top: newTop,
      duration: 8,
    }
    currentBarrages[index] = updatedBarrage;
  
    setBarrages(currentBarrages);
  }

  return (
    <div>
      <div className="barrage-area" >
        {barrages.map((barrage, index) => (
          <div
            key={barrage.id}
            className='barrage'
            style={{
              top: `${barrage.top}px`,
              animation: `scroll linear ${barrage.duration}s`,
              animationDelay: `${barrage.delay}`,
              border:barrage.border
            }}
            onAnimationEnd={() => onAnimationEnd(index)}
          >
            {barrage.content}
          </div>
        ))}
      </div>
      <div style={{ margin: '3vh auto', width: '60vw', marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: '#9a0000',
                colorBorder: 'transparent',
                colorPrimaryHover: 'red',
                fontSize: '1.5rem'
              }
            }
          }}
        >
          
          <Button
            type="primary"
            size='large'
            onClick={addBarrage}
            style={{ width: '70px', height: '60px', marginLeft: '90%' }}
          >
            <Image 
              style={{
                animation: `${fAnimation ?? ''}`,
              }} 
              preview={false} alt={'🌹'} src='/img/icon/f128.png'
            />
          </Button>
        </ConfigProvider>
      </div>
    </div>
  );
}; 



const Pi = ({ pioneer }) => {


  useEffect(() => {

  }, []);

  return (
    <Layout>
      <NavBar act="2" />

      <div className={styles.Pcontainer}>
        <Title level={1} className={`${styles.CenterTitle}`} style={{ marginBottom: '7vh' }}>Pioneer</Title>
        <Row className={styles.row}>
          <Col span={12} className={styles.leftColumn}>
            <Image
              src={pioneer.avatar.replace(domain, '')}
              alt="Pioneer"
              preview={false}
              className={styles.heroImage}
            />
          </Col>
          <Col span={12} className={styles.rightColumn}>
            <Title level={1} className={styles.whiteText} style={{/*  fontWeight: '500'  */ }}>{pioneer.name}</Title>

            <Paragraph className={`${styles.whiteText} ${styles.Paragraph}`}
              style={{ fontSize: '24px', lineHeight: '2', textIndent: '2' }}
            >
              {pioneer.detail}
            </Paragraph>
          </Col>
        </Row>

        <Barrage prebrs={pioneer.like_log} pid={pioneer.id} />

        <div className={styles.IntroContainer}>
          <Row className={styles.row}>
            <Col span={24} style={{ zIndex: 2 }}>
              <Title level={1} className={styles.whiteText} style={{ textAlign: 'center', fontWeight: '500' }}>伟大事迹</Title>
              <Paragraph className={`${styles.whiteText} ${styles.Paragraph}`}
                style={{ fontSize: '24px' }}
              >
                {pioneer.story}
              </Paragraph>

            </Col>
          </Row>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {

  let pioneer = {
    "id": 1,
    "name": "习近平",
    "avatar": "https://p20.ctbu.org/img/example/avatar/xjp.png",
    "detail": "男，陕西富平人，生于北京，祖籍河南邓州，中国共产党、中华人民共和国政治人物，正国级领导人，2012年11月至今任中共中央总书记及中共中央军委主席，2013年3月至今任中华人民共和国主席及国家中央军委主席，是中华人民共和国党、政、军队当前及第五代的最高领导人",
    "flowers_count": 15,
    "sort": 1,
    "display_photo": null,
    "status": 1,
    "story": "习近平在北京出生并长大，是中国开国元老和习仲勋与其第二任夫人齐心的长子，也是首位出生在中华人民共和国成立后的中共最高领导人。习近平在北京接受了中小学教育，1969年，因文化大革命对家庭带来的冲击而被迫中止学业，作为知青前县梁家河村参加劳动与工作，在此期间于1974年加入中国共产党，并在后期担任了梁家河村党支部书记。1975年进入清华大学化工系就读，1979年毕业后先后任国务院办公厅及中央军委办公厅秘书。1982年，离京赴河北省正定县先后任县委副书记、书记，开始在地方任职。1985年赴福建，先后在福建省厦门市、宁德地区、福州市任职，1999年任福建省人民政府省长，成为正部级官员。2002年起，先后任中共浙江省委书记和中共上海市委书记。2007年10月，当选为中共中央政治局常委和中共中央书记处书记，并先后兼任或当选中共中央党校校长、国家副主席、党和国家中央军委副主席等职务。 2012年11月，在中共十八届一中全会当选为中共中央总书记和中共中央军委主席（2017、2022年获得连任），2013年3月当选为中国国家主席和国家中央军委主席（2018、2023年获得连任），成为党和国家最高领导人。2016年10月，在中共十八届六中全会上确立了其领导核心的地位[13]。中国共产党第十五届中央候补委员，第十六届至第二十届中央委员，第十七届至第二十届中央政治局委员、常委，第十八至二十届中央委员会总书记。第九届至第十四届全国人大代表。 习近平第一任妻子是柯玲玲。现任妻子为中国女高音歌唱家彭丽媛，育有一女习明泽。",
    "updated_at": "2023-05-11T14:56:21.000000Z",
    "like_log": [
      {
        "id": 6,
        "example_id": 1,
        "ip": "172.19.0.1",
        "ip_country": "United States",
        "from_city": "重庆",
        "updated_at": "2023-05-11T14:56:21.000000Z",
        "province": "Connecticut",
        "time": "27 minutes ago"
      },
      {
        "id": 5,
        "example_id": 1,
        "ip": "172.19.0.1",
        "ip_country": "United States",
        "from_city": "重庆",
        "updated_at": "2023-05-11T01:17:47.000000Z",
        "province": "Connecticut",
        "time": "14 hours ago"
      },
      {
        "id": 4,
        "example_id": 1,
        "ip": "172.19.0.1",
        "ip_country": "United States",
        "from_city": "New Haven",
        "updated_at": "2023-05-11T01:17:39.000000Z",
        "province": "Connecticut",
        "time": "14 hours ago"
      },
      {
        "id": 3,
        "example_id": 1,
        "ip": "172.19.0.1",
        "ip_country": "United States",
        "from_city": "重庆",
        "updated_at": "2023-05-11T00:51:42.000000Z",
        "province": "Connecticut",
        "time": "14 hours ago"
      },
      {
        "id": 2,
        "example_id": 1,
        "ip": "172.19.0.1",
        "ip_country": "United States",
        "from_city": "New Haven",
        "updated_at": "2023-05-10T14:11:26.000000Z",
        "province": "Connecticut",
        "time": "1 day ago"
      },
      {
        "id": 1,
        "example_id": 1,
        "ip": "172.19.0.1",
        "ip_country": "United States",
        "from_city": "重庆",
        "updated_at": "2023-05-09T14:41:38.000000Z",
        "province": "Connecticut",
        "time": "2 days ago"
      }
    ]
  }

  try {
    const response = await axios.post(
      apihost + '/v1/example/get',
      {},
      {
        timeout: 4000
      }
    )
    if (response.data?.code === 0) {
      pioneer = response.data.data;
    }
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      pioneer,
    },
    revalidate: 60, // Optional: Set a revalidation time (in seconds) to regenerate the page at runtime
  };
}

export default Pi
