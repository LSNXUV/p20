import { useState, useRef, useEffect } from 'react';
import {
  Carousel, Button, Card, Image, ConfigProvider, Space
} from 'antd';
import { 
  LeftOutlined, RightOutlined, 
  PlayCircleOutlined, PauseCircleOutlined 
} from '@ant-design/icons';

import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(
  () => import('react-player'),
  { ssr: false }  // 这将禁止在服务端渲染此组件
)

import hostConfig from '../config/host.js'
const { domain } = hostConfig


/* let videos = [
    {
      id: 1,
      name: '觉醒年代',
      desc: '革命者们英勇奋斗、不懈努力，为了民族独立和人民幸福付出艰辛和牺牲。该剧展示了旧中国社会的黑暗和落后，以及中国共产党的成立和崛起，视角独特、具有重要历史意义。',
      name_img: 'https://p20.ctbu.org/img/drama/juexingniandai.png',
      bg_video: 'https://p20.ctbu.org/video/drama/juexingniandai.mp4',
      bg_img: '',
      watch_url: null,
      status: 1,
      created_at: null,
      updated_at: null
    },
    {
      id: 2,
      name: '亮剑',
      desc: '在东北野战军1945至1949年间艰苦的卓绝抗日和解放战争中，出现了一些典型人物和真实故事，生动再现了中国革命历史的重要篇章',
      name_img: 'https://p20.ctbu.org/img/drama/liangjian.png',
      bg_video: 'https://p20.ctbu.org/video/drama/liangjian.mp4',
      bg_img: '',
      watch_url: null,
      status: 1,
      created_at: null,
      updated_at: null
    },
    {
      id: 4,
      name: '上甘岭',
      desc: '中国人民志愿军在朝鲜战争中英勇抗争，在上甘岭战役中勇猛作战，最终将敌人击退。',
      name_img: 'https://p20.ctbu.org/img/drama/shangganling.png',
      bg_video: 'https://p20.ctbu.org/video/drama/shangganling.mp4',
      bg_img: '',
      watch_url: null,
      status: 1,
      created_at: null,
      updated_at: null
    },
    {
      id: 5,
      name: '人世间',
      desc: `中国自改革开放以来，社会发生巨大变革。中国的历史变革中经历了许多挑战与机遇，展现了一代人的青春与梦想，反映了中国
  改革开放以来巨大的社会变革和人间真情。`,
      name_img: 'https://p20.ctbu.org/img/drama/renshijian.png',
      bg_video: 'https://p20.ctbu.org/video/drama/renshijian.mp4',
      bg_img: '',
      watch_url: null,
      status: 1,
      created_at: null,
      updated_at: null
    }
  ] */


const VideoCarousel = ({ videos }) => {

  const carouselRef = useRef()

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {

  }, []);

  const handlePlayPause = () => {

    setIsPlaying(!isPlaying)
  }

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
    carouselRef.current.prev();
  }

  const handleNext = () => {
    if (activeIndex < videos.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
    carouselRef.current.next();
  }

  const onVideoEnded = () => {
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 0);
  }

  return (
    <div className="video-carousel-container">
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: '#9a0000',
              colorBgContainer: 'rgba(255, 255, 255, 0.8)',
              colorBorder: 'transparent',
              colorPrimaryHover: '#9a0000',
              fontSize: '1.1rem'
            },
            Card: {
              colorBgContainer: 'transparent',
              colorTextHeading: '#ffffff',
              colorTextDescription: '#ffffff',
              // fontFamily:'SourceHanSerifSC-SemiBold, sans-serif',
              boxShadowTertiary: ' 0px 0px 0px 0px rgba(0, 0, 0, 0)'
            }
          }
        }}
      >
        <Button className="carousel-btn prev-btn" onClick={handlePrev} icon={<LeftOutlined />} />
        <Carousel
          ref={carouselRef}
          dots={false}
          className="video-carousel"
          beforeChange={(oldIndex, newIndex) => {
            // console.log(oldIndex,newIndex)
            //暂停掉原来的
            /* setActiveIndex(newIndex)
            setIsPlaying(!isPlaying) */
            setActiveIndex(newIndex)
            setIsPlaying(false);
          }}
          afterChange={(currentIndex) => {
            // console.log(currentIndex)
            //开始播放新的
            setActiveIndex(currentIndex)
            setIsPlaying(true)
          }}
        >
          {videos.map((video, index) => (
            <div key={index} className="carousel-item">
              <ReactPlayer
                // controls
                url={video.bg_video.replace(domain, "")}
                playing={ isPlaying && activeIndex === index}
                onEnded={() => onVideoEnded()}
                width={'100vw'}
                height={'100vh'}
              />
              <Card
                hoverable
                bordered={false}
                className="video-info-card"
                cover={<Image style={{ objectFit: 'contain', maxHeight: '27vh',maxWidth:'25vw' }} preview={false} alt={video.name} src={video.name_img.replace(domain, "")} />}
                onClick={() => {
                }}
              >
                <Card.Meta style={{ fontSize: '1rem', marginBottom: '3vh' }} description={video.desc} />

                <Space wrap size={10}>
                  <Button onClick={() => {
                    window.open(video.watch_url, '_blank')
                  }}
                    style={{ width: '7vw', height: '3vw', color: '#9a0000' }}
                  >播放</Button>
                  <Button onClick={() => {
                    // window.open(video.watch_url, '_blank')
                  }}
                    style={{ width: '7vw', height: '3vw', color: '#fff', backgroundColor: 'rgb(128, 128, 128,0.7)' }}
                  >详情</Button>
                </Space>


              </Card>
              <Button
                style={{ fontSize: '20px' }}
                className="play-pause-btn"
                icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                onClick={handlePlayPause}
                
              />
            </div>
          ))}
        </Carousel>
        <Button className="carousel-btn next-btn" onClick={handleNext} icon={<RightOutlined />} />
      </ConfigProvider>
    </div>
  );
};

export default VideoCarousel;
