import React, { useEffect } from 'react';


import hostConfig from '../../config/host.js'
const {apihost} = hostConfig


import NavBar from '../../components/NavBar.js';
import VideoPlayer from '../../components/VideoCarousel';
import axios from 'axios';


const Cinema = ({ videos }) => {
  
  useEffect(() => {

    // window.scrollTo({ top: 24 * window.innerHeight / 100, behavior: 'smooth' })

  }, []);


  return (
    <div >
      <NavBar act="5" />

      <VideoPlayer videos={videos} id='Cinema'/>

    </div>
  );
};

export async function getStaticProps() {

  let videos = [
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
  ]

  try {
    const response = await axios.post(
      apihost+'/v1/drama/getList',
      {},
      {
        timeout: 3000
      }
    )
    if (response.data?.code === 0) {
      videos = response.data.data;
    }
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      videos,
    },
    revalidate: 60, // Optional: Set a revalidation time (in seconds) to regenerate the page at runtime
  }
}


export default Cinema;
