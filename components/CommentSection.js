import hostConfig from '../config/host.js'
const {apihost,domain} = hostConfig

import {
  Typography, Avatar, Button, Input, List,
  Card, Row, Col, Dropdown, message,

} from 'antd';

import {HeartFilled, SortDescendingOutlined, UserOutlined } from '@ant-design/icons';


import React, { useState } from 'react';
import axios from 'axios';

const { Title, Paragraph } = Typography;


const CommentSection = ({ PostId, Comments }) => {

  const [messageApi, contextHolder] = message.useMessage();
  const [comments, setComments] = useState(Comments);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const [author, setAuthor] = useState('')

  function getNow() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  //发表评论
  const handleSubmit = async () => {
    if (!value || !author) {
      messageApi.open({
        type: 'error',
        content: '请填写完整',
      })
      return;
    }

    setSubmitting(true)
    //评论
    try {
      const response = await axios.post(apihost+'/v1/post/addComment', {
        postId: PostId,
        author,
        content: value
      }, {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        timeout: 5000
      });


      console.log(response.data)

      if (response.data?.code !== 0) {
        setSubmitting(false)
        // console.log(response.data)
        messageApi.open({
          type: 'error',
          content: response.data?.message,
        })
        return
      }

      const cmt = response.data.data

      setSubmitting(false)
      setValue('')
      setComments([
        cmt,
        ...comments
      ])

      messageApi.open({
        type: 'success',
        content: '发表成功！',
      })
    } catch (error) {
      console.error(error);
    }

  }

  function formatLikes(likes) {
    if (likes >= 10000) {
      const likesInTenThousands = (likes / 10000).toFixed(1);
      return `${likesInTenThousands}W`;
    }
    if (likes >= 1000) {
      const likesInThousands = (likes / 1000).toFixed(1);
      return `${likesInThousands}K`;
    }

    return likes.toString();
  }

  const handleChange = e => {
    setValue(e.target.value);
  }
  const authorChange = e => {
    setAuthor(e.target.value);
  }

  //点赞
  const handleLike = async index => {
    const updatedComments = [...comments];
    const comment = updatedComments[index];

    if (comment.isLiked) {
      // 取消点赞
      comment.like_count -= 1;

    } else {

      // 点赞
      comment.like_count += 1;

    }

    // 切换isLiked状态
    comment.isLiked = !comment.isLiked;
    setComments(updatedComments);

    if (comment.isLiked) {
      //请求点赞
      try {
        const response = await axios.post(apihost+'/v1/post/sendCommentLike', {
          postId: PostId,
          commentId: comment.id
        }, {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          timeout: 7000
        })
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  }


  const sortComments = type => {
    const sortedComments = [...comments];
    if (type === 'hottest') {
      sortedComments.sort((a, b) => b.like_count - a.like_count);
    } else if (type === 'latest') {
      sortedComments.sort(
        (a, b) => new Date(b.posted_at) - new Date(a.posted_at)
      );
    }
    setComments(sortedComments);
  }


  return (
    <div style={{ backgroundColor: 'transparent', margin: '10vh 10vw' }}>
      <Card
        title="发表评论"
        extra={
          <Avatar src="/img/xjp1.png" size="large" alt="头像" />
        }
      >
        <Row>
          <Col span={4}><Input size="large" placeholder="用户名" prefix={<UserOutlined />} onChange={authorChange} value={author} /></Col>
        </Row>
        <Input.TextArea size='large' placeholder='善语结善缘,恶语伤人心' rows={4} onChange={handleChange} value={value} />
        {contextHolder}
        <Button
          htmlType="submit"
          loading={submitting}
          onClick={handleSubmit}
          type="primary"
          style={{ marginTop: '1rem', backgroundColor: '#9a0000' }}
        >
          发送评论
        </Button>
      </Card>

      <List
        dataSource={comments}
        itemLayout="horizontal"
        locale={{
          emptyText: '快来抢首评！'
        }}
        header={
          <div style={{ textAlign: 'right', marginLeft: '2vw' }}>
            <Dropdown
              arrow
              menu={{
                items: [
                  { key: 1, label: '最热', onClick: () => sortComments('hottest') },
                  { key: 2, label: '最新', onClick: () => sortComments('latest') }
                ]
              }
              } trigger={['click']}>
              <SortDescendingOutlined style={{ margin: '3vh auto', fontSize: '24px' }} />
            </Dropdown>
          </div>
        }

        renderItem={(item, index) => (
          <Card
            key={index}
            // style={{ marginBottom: "2vh" }}
            bodyStyle={{ padding: "2vw" }}
          >
            <Row align={"top"} gutter={[-18, 0]}>
              <Col span={2}>
                <div style={{ margin: '1vh 1vw' }}>
                  <Avatar src={item.avatar.replace(domain, "")} alt="头像" size={"large"} />
                </div>
              </Col>
              <Col span={20}>
                <Title level={5} style={{ margin: '0 auto',color:'grey' }}>{item.author}</Title>
                
                <Paragraph style={{fontFamily:'SourceHanSerifSC-Regular, sans-serif',fontSize:'1.1rem'}}>{item.content}</Paragraph>
                
                <div style={{ fontSize: "12px", color: "#999" }}>{item.posted_at}</div>
              </Col>
              <Col span={2}>
                <div style={{ textAlign: "center" }}>
                  {item.isLiked ? (
                    <HeartFilled
                      onClick={() => handleLike(index)}
                      className="heart-animation"
                      style={{ color: "red", fontSize: "24px" }}
                    />
                  ) : (
                    <HeartFilled
                      onClick={() => handleLike(index)}
                      style={{ textAlign: "center", fontSize: "24px", color: 'grey' }}
                    />
                  )}
                  <Paragraph style={{ textAlign: "center" }}>{formatLikes(item.like_count)}</Paragraph>
                </div>
              </Col>
            </Row>
          </Card>
        )}
      />
    </div>
  );
};

export default CommentSection