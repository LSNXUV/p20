
import axios from "axios";
import {
  Typography, Divider,Spin

} from 'antd';

import hostConfig from '../../config/host.js'
const {apihost} = hostConfig

import NavBar from '../../components/NavBar';
import CommentSection from '../../components/CommentSection';

import styles from '../../styles/news/new.module.css'

import React, { } from 'react';

const { Title, Paragraph, Text } = Typography;


const NewsDetail = ({ newsDetail }) => {
  
  if (!newsDetail) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }
  return (
    <div>
      <NavBar act="3" />
      <div style={{ width: '70%', margin: '0 auto' }}>
        <Title style={{ textAlign: 'center', marginTop: '4vh', marginBottom: '3vh' }}>{newsDetail.title}</Title>
        <Title level={5} style={{ textAlign: 'center', marginTop: '3vh' }}>编辑：{newsDetail.editor}　　来源：{newsDetail.author}</Title>
        <Text style={{ fontSize: '14px', fontWeight: '500' }}>{newsDetail.published_date}</Text>
        
        <Divider dashed
          style={{
            borderColor: '#9a0000',
            margin: '16px 0',
          }}
        />
        {
          newsDetail.content.split('\n').map( (ctx,index) => 
            <Paragraph key={index} className={styles.Paragraph}>
              {ctx}
            </Paragraph>
          )
        }
      </div>

      {newsDetail.comment_status == 1 && <CommentSection PostId={newsDetail.id}  Comments={newsDetail.comment_list}/>}

    </div>
  );
};


export async function getServerSideProps({ params }) {

  const { id } = params;

  let res = {
    title: '习近平：更好把握和运用党的百年奋斗历史经验',
    date: '2023-05-05',
    content: `党中央举办这次专题研讨班，目的是深入研读和领会党的十九届六中全会决议，更好把握和运用党的百年奋斗历史经验，弘扬伟大建党精神，动员全党全国各族人民坚定信心、勇毅前行，为实现党的第二个百年奋斗目标而不懈努力。
    　　`,
  };

  try {
    const response = await axios.post(
      apihost+'/v1/post/getDetail',
      { id },
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        timeout: 4000
      }
    );

    if (response.data && response.data.code === 0) {
        res = response.data?.data
    }
  } catch (error) {
    console.error(`Error fetching news detail: ${error.message}`);
  }

  return {
    props: {
      newsDetail: res ,
    },
  };
}

export default NewsDetail;
