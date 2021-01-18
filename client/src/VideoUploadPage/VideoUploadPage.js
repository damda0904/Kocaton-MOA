import React, { useState } from 'react'
import { Button, Form, message, Input, DatePicker } from 'antd'
import { Link } from 'react-router-dom'
import Dropzone from 'react-dropzone';
import HashTag from '../HashTag';
import axios from 'axios';
import { useSelector } from "react-redux";

const { TextArea } = Input;
const { RangePicker } = DatePicker;

const Catogory = [
    { value: 0, label: "전시" },
    { value: 1, label: "공연" },
    { value: 2, label: "학술" },
    { value: 3, label: "졸업전시" },
    { value: 4, label: "기타" },
]

function VideoUploadPage(props){
    const user = useSelector(state => state.user);

    const [title, setTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Categories, setCategories] = useState("전시")
    const [FilePath, setFilePath] = useState("")
    const [FileName, setFileName] = useState("")
    const [Duration, setDuration] = useState("")
    const [Thumbnail, setThumbnail] = useState("")
    const [StartDate, setStartDate] = useState("")
    const [EndDate, setEndDate] = useState("")
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

    const handleChangeTwo = (event) => {
        setCategories(event.currentTarget.value)
    }

    const onDateChange = (date, dateString) => {
        setDateString(dateString);
    }
    const onSubmit = (event) => {

        event.preventDefault();

        if (user.userData && !user.userData.isAuth) {
            return alert('로그인 먼저 해주세요!')
        }

        if (title === "" || Description === "" ||
            Categories === "" || FilePath === "" ||
            Duration === "" || Thumbnail === "") {
            return alert('모든 내용을 채워주세요!')
        }

        const variables = {
            writer: user.userData._id,
            title: title,
            description: Description,
            filePath: FilePath,
            category: Categories,
            duration: Duration,
            thumbnail: Thumbnail,
            startDate: StartDate,
            endDate: EndDate,
            tags:hashTags
        }

        axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success) {
                    message.success('성공적으로 업로드했습니다.')
                    setTimeout(()=>{
                        props.history.push('/')
                    }, 3000);
                    
                } else {
                    message.error('업로드를 실패했습니다.')
                }
            })

    }

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        console.log(files)
        formData.append("file", files[0])

        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    alert('비디오 업로드 성공')
                    let variable = {
                        filePath: response.data.filePath,
                        fileName: response.data.fileName
                    }
                    setFileName(response.data.fileName);
                    setFilePath(response.data.filePath)

                    //gerenate thumbnail with this filepath !

                    axios.post('/api/video/thumbnail', variable)
                        .then(response => {
                            if (response.data.success) {
                                setDuration(response.data.fileDuration)
                                setThumbnail(response.data.thumbsFilePath)
                            } else {
                                alert('썸네일 생성을 실패했습니다.');
                            }
                        })


                } else {
                    alert('비디오 업로드를 실패했습니다.')
                }
            })

    }
    return(
        <div style={{ maxWidth: '700px', margin: '2rem auto'}}>
            <Form onSubmit={onSubmit}>
              <Input style={{border:'white', marginTop:'4rem'}}
                 size="large"
                 onChange={handleChangeTitle}
                 value={title}
                 placeholder='제목을 쓰세요'
              />
              <br /><br />
              <RangePicker 
                    onChange={onDateChange}
                />
              <br /><br /><hr /><br />
              <Link to="/image">
                <Button
                  size="small">
                  이미지
                </Button>
              </Link>
              <Link to="/upload">
                <Button
                  style={{background: '#48bcec', 
                  color: 'white', }} size="small">
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
              <div style={{ display: 'flex' }}>
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
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
                                <p style={{ marginBottom: '0'}}>동영상 추가</p>
                            </div>
                        )}
                    </Dropzone>
                </div>
                <div>
                    {FileName !== '' && (<div>{FileName}</div>)}
                </div><br/>
                {Thumbnail !== "" &&
                        <div>
                            <img src={`http://localhost:5000/${Thumbnail}`} alt="haha" />
                        </div>
                    }
              <br />

                <label>본문</label>
                <TextArea
                    onChange={handleChangeDecsription}
                    value={Description}
                    placeholder="영상에 대해 소개해주세요"
                />
                <br /><br />
                <HashTag addTags={handleAddTags}/><br/><br/>
                <Button style={{background: '#48bcec', 
                                color: 'white', }} 
                                size="large" 
                                onClick={onSubmit}>
                    제출
                </Button>
            </Form>
        </div>
    )
}
export default VideoUploadPage;