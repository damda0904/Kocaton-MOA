import React, { useState, useEffect } from 'react';
import { Card , Col, Row, Pagination, Tag} from 'antd';
import Comment from './VideoDetailPage/Sections/Comment'
import Axios from 'axios'
import moment from 'moment';

function PostPage(props){

  const imageId = props.match.params.imageId
  const [Image, setImage] = useState([]);
  const [CommentLists, setCommentLists] = useState([])
  const [current, setCurrent]=useState(1)

  const startDate = moment(Image.startDate).format('YYYY.MM.DD');
  const endDate = moment(Image.endDate).format('YYYY.MM.DD');
  const [file, setFile]=useState([])
  const [fileName, setFileName]=useState([])
  const imageVariable = {imageId :imageId}

  const fileLength=file.length

  useEffect(()=>{
    Axios.post('/api/image/getImageDetail', imageVariable)
        .then(response => {
            if (response.data.success) {
                setImage(response.data.image)
                console.log("이미지아이디:",imageId)
                setFile(response.data.image.filePath)
                setFileName(response.data.image.fileName)

            } else {
                alert('Failed to get image Info')
            }
        })
  },[])

  const handlePage = (event) => {
    setCurrent(event)
  }
  const updateComment = (newComment) => {
    setCommentLists(CommentLists.concat(newComment))
  }
  const sliceTag = (tag) => {
      const slicedTag = (
          <Tag>{tag}</Tag>
      )
      return (
          <span>{slicedTag}</span>
      )
  }

  if(Image.writer){ //데이터 많으면 동기화 안해줘서 이거 if문 해줘야된대
    const tagChild = Image.tags.map(sliceTag)
    return(
        <div style={{ width : '80%' }}>
        <div style={{ margin:'2rem auto', paddingLeft:'14rem'}}>
            <h1>{Image.title}</h1>
            <h5>{startDate}~{endDate}</h5>
            <br />
            <Row>
                <Col xs={24} md={6}>
                    <Card style={{width : "300px", height : '480px', marginLeft:'2rem'}}>
                        {Image.introduction}
                    </Card>
                </Col>
                <Col>
                    <Card style={{marginLeft: '20%', width:'720px',textAlign:'center',objectFit:'cover'}}>
                        <img src={`http://localhost:5000/${file[current-1]}`}/>
                    </Card><br/>
                </Col>
            </Row>
            <Row>
                <div style={{ marginLeft:'70%' , paddingBottom:'2rem'}}>
                        <Pagination
                        onChange={handlePage}
                        defaultCurrent={1}
                        total={fileLength*10}
                        />
                    </div><br />
                <div style={{width:'120%'}}><hr/></div>
                <Col>
                    <div style={{ marginLeft:'6.5%'}}>
                    <Card style={{width : 950, height:500, border:'white'}}>
                        {Image.description}
                    </Card>
                    </div>
                </Col>
            </Row>
            </div>
            <div style={{width:"125%"}}><hr/></div>
            <div style={{ margin:'2rem auto', paddingLeft:'20rem'}}>
            <Card style={{boder:'2px solid'}}>
                {fileName}
            </Card><br/>
            <Tag>{Image.tags !== '' && (<div>{tagChild}</div>)}</Tag>
            </div>
            <div style={{width:"125%"}}><hr/></div>
        <div style={{margin:'2rem auto', paddingLeft:'20rem'}}>
            <Comment CommentLists={CommentLists} postId={Image._id} refreshFunction={updateComment}/>
        </div>
        </div>
    )}else{
      return(<div>...loading...</div>)
  }
}
export default PostPage;
