import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Row, Col, Input, Button, message } from 'antd';
import { Container } from 'react-bootstrap';
import Dropzone from 'react-dropzone';

const { TextArea } = Input;

function Profile() {
    //state
    const [currentUser, setCurrentUser] = useState([]);
    const [editing, setEditing] = useState(false)       //프로필 변경 상태인지 알리는 변수
    const [imageFile, setImageFile] = useState("")      //이미지 파일
    const [src, setSrc] = useState("")   //이미지 소스
    const [nickName, setNickName] = useState("")    //닉네임
    const [content, setContent] = useState("")    //자기소개



    //미리보기
    let profile_preview = ""

    useEffect(() => {
        getMyProfile()
    }, [])

    //데이터 받아오기
    const getMyProfile = () => {
       
        const body = {
            id : localStorage.getItem('userId')
        }

        axios.post('/api/user/getProfile', body)
            .then(res => {
                console.log("findSuccess", res.data.findSuccess)
                if (res.data.findSuccess) {
                    console.log("프로필 res", res.data.User)
                    setSrc(res.data.User.image)
                    setNickName(res.data.User.nickName)
                    setContent(res.data.User.content)  
                    console.log("현재 프로필", nickName, content)
                } 
                else {
                    alert('프로필 정보를 갖고 오는 데 실패했습니다.')
                }
               
            })
            .catch(err => {
                console.log(err.message)
            })
            
            console.log("프로필 정보 받기", nickName, content)
    }

    //변경사항 저장
    const changeEditing = () => {
        if (editing) {

            console.log("content",)

            const body = {
                id: localStorage.getItem('userId'),
                nickName: nickName,
                image: src,
                content: content
            }
            console.log("저장시 찾을 id", body.id)
            axios.post('/api/user/saveProfile', body)
                .then(res => {
                    if (res.data.success) {
                        console.log("save profile")
                        setEditing(false)
                    } else {
                        alert('프로필 수정을 실패했습니다.')
                    }
                })
                .catch(err => {
                    console.log(err.message)
                })

        }
        else { setEditing(true) }
    }


    //프로필 사진 변경
    const onDrop = (file) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", file)

        axios.post('/api/image/uploadFiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    message.success(`이미지 업로드 성공 !`);
                    setImageFile(response.data.filePath)
                } else {
                    message.error(`이미지 업로드 실패 ~`);
                }
            })

    }

    //프로필 사진이 변경될때
    if (imageFile !== null) {
        profile_preview = <img
            class="changeProfile"
            src={src} />
    }

    //프로필 변경 화면
    if (editing === true) {
        return (
            <Container sytle={{ width: "100%" }}>
                <Row justify="center" align="middle">
                    <Col style={{ margin: "0 50px" }}>
                        <Row>
                            {profile_preview}
                        </Row>
                        <Row>
                            {/* <Input
                                type="file"
                                accept="image/jpeg, image/jpg, image/png"
                                onChange={isSelectedImg}
                            /> */}
                            <Dropzone
                                onDrop={onDrop}
                                multiple={true}
                                maxSize={800000000}>
                                {({ getRootProps, getInputProps }) => (

                                    <div style={{ marginLeft: '20px', width: '50px', height: '10px', border: '1px solid lightgray', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        {...getRootProps()}
                                    >
                                        <input {...getInputProps()} />
                                        <Button size='small' type='primary'>이미지 추가</Button>

                                    </div>
                                )}
                            </Dropzone>
                        </Row>
                    </Col>

                    <Col style={{ width: "500px", }}>
                        <Row>
                            <Input
                                type="text"
                                name="name"
                                value={nickName}
                                placeholder="이름"
                                onChange={function (e) {
                                    setNickName(e.target.value)
                                }}
                            />
                        </Row>
                        <Row style={{ margin: "0 0 30px 0" }}>
                            <TextArea
                                showCount maxLength={250}
                                rows={5}
                                cols="100"
                                value={content}
                                placeholder="소개문구"
                                onChange={function (e) {
                                    setContent(e.target.value)
                                }}
                            />
                        </Row>
                        <Row>
                            <Col style={{ margin: "0 10px 0 0" }}>
                                <Button type="primary" onClick={changeEditing}>적용</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>

        );
    }

    return (
        <Container sytle={{ width: "100%" }}>
            <Row justify="center" align="middle">
            <Col style={{ margin: "0 50px" }}>
                    <img
                        src={src}
                        class="Profile"
                    />
                </Col>
                <Col style={{ width: "500px", }}>
                    <Row justify="space-between">
                        <Col>
                            <h2>{nickName}</h2>
                        </Col>
                        <Col>
                            <Button type="primary" onClick={changeEditing}>프로필 수정</Button>
                        </Col>
                    </Row>
                    <Row>
                        <pre style={{ width: "500px", whiteSpace: "pre-wrap" }}>{content}</pre>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default Profile;