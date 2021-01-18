import React, { useState } from 'react'
import { Button, Form, Input, DatePicker,message } from 'antd';
import { Link } from 'react-router-dom'
import HashTag from '../HashTag';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

var imgNum = -1;

const Catogory = [
    { value: 0, label: "전시" },
    { value: 0, label: "공연" },
    { value: 0, label: "학술" },
    { value: 0, label: "졸업전시" },
    { value: 0, label: "기타" },
]

function ImageUploadPage(props){
    const user = useSelector(state => state.user);

    const [title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Introduction, setIntroduction] = useState([]);
    const [Categories, setCategories] = useState("전시")
    const [FilePath, setFilePath] = useState([])
    const [FileName, setFileName] = useState([])
    const [dateString, setDateString] = useState("")

    let hashTags = [];

    const handleAddTags = (tags) => {
        hashTags = tags;
    }

    const handleChangeTitle = (event) => {
        setTitle(event.currentTarget.value)
    }

    const handleChangeDecsription = (event) => {
        setDescription(event.currentTarget.value)
    }

    const handleChangeIntroduction = (event) => {
        setIntroduction(event.currentTarget.value)
    }

    const handleChangeTwo = (event) => {
        setCategories(event.currentTarget.value)
    }

    const onDateChange = (date, dateString) => {
        setDateString(dateString);
    }
    const handleETC = (event) => {
        setIntroduction("이미지를 소개해주세요")
    }

    const onSubmit = (event) => {

        event.preventDefault();

        if (user.userData && !user.userData.isAuth) {
            return alert('로그인 먼저 해주세요!')
        }

        if (title === "" || Description === "" ||
            Introduction === "" || FilePath=== ""||
            Categories === ""  ) {
            return alert('모든 내용을 채워주세요!')
        }

        const variables = {
            writer: user.userData._id,
            title: title,
            description: Description,
            introduction: Introduction,
            filePath: FilePath,
            fileName:FileName,
            tags: hashTags,
            category: Categories,
            startDate: new Date(dateString[0]),
            endDate : new Date(dateString[1])
        }

        axios.post('/api/image/uploadImage', variables)
            .then(response => {
                if (response.data.success) {
                    message.success(`이미지 업로드 성공 !`);
                    props.history.push('/')
                } else {
                    message.error(`이미지 업로드 실패 !!`);
                }
            })
    }
    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])

        axios.post('/api/image/uploadFiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    message.success(`이미지 업로드 성공 !`);
                    imgNum+=1;
                    const names = FileName;
                    names.push(response.data.fileName)
                    setFileName(names)
                    const file = FilePath;
                    file.push(response.data.filePath)
                    setFilePath(file)
                } else {
                    message.error(`이미지 업로드 실패 ~`);
                }
            })

    }

    return(
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <Form onSubmit>
            <Input style={{border:'white', marginTop:'4rem'}}
                 size="large"
                 onChange={handleChangeTitle}
                 value={title}
                 placeholder='제목을 쓰세요'
              />
              <br/><br/>
              <RangePicker 
                    onChange={onDateChange}
                />
              <br /><br /><hr /><br />

              <Link to="/image">
                <Button
                  style={{background: '#48bcec', 
                  color: 'white'}} size="small">
                  이미지
                </Button>
              </Link>
              <Link to="/upload">
                <Button
                  size="small">
                  동영상
                </Button>
              </Link>
              <div style={{ margin : '2rem auto'}}>
              
              <select onChange={handleChangeTwo}>
                  {Catogory.map((item, index) => (
                      <option key={index} value={item.label}>{item.label}</option>
                  ))}
              </select>
              </div>

              <div style={{ display: 'flex'}}>
                
                    <Dropzone
                        onDrop={onDrop}
                        multiple={true}
                        maxSize={800000000}>
                        {({ getRootProps, getInputProps }) => (
                            
                            <div style={{ 
                                background: '#48bcec', 
                                color: 'white', 
                                paddingRight: '1rem', 
                                paddingLeft: '1rem', 
                                paddingTop: '0.2rem',
                                paddingBottom: '0.2rem',
                                border: '2px solid #48bcec',
                                cursor: 'pointer'
                            }} 
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <p style={{ marginBottom: '0'}}>이미지 추가</p>

                            </div>
                        )}
                    </Dropzone>
                    <a onClick={handleETC}><div style={{ display:'flex', width:'100%', height:'20px', 
                    paddingTop:'0.5rem'}}>
                        {FileName.length !== 0 && (<div>{FileName.map((name,index )=>(
                            <div key={index}>{name}</div>
                    )
                 )}
            </div>)}</div></a>
              </div>
              <br />
                <label>소개글</label>
                <TextArea
                    onChange={handleChangeIntroduction}
                    value={Introduction}
                    placeholder="이미지를 소개해주세요(900자 제한)"
                />
                <br /><br />
                <hr />
                <br />
                <label>본문</label><br/>
                <textarea style={{ border:'1px solid lightgray',
                width:'700px', height:'400px'}}
                    onChange={handleChangeDecsription}
                    value={Description}
                    placeholder="본문을 작성해주세요"
                />
                <br /><br />
                <HashTag addTags={handleAddTags}/><br/><br/>
                <Button style={{background: '#48bcec', 
                                color: 'white', }} 
                                size="large" onClick={onSubmit}>
                    제출
                </Button>
                <br/><br/>
            </Form>
        </div>
    )
}
export default ImageUploadPage;