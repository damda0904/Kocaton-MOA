import React, { useState } from 'react'
import { Form, Input, Button } from 'antd';
import Dropzone from 'react-dropzone';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import HashTag from '../../HashTag';

const { TextArea } = Input;

function BroadCastForm(props) {

    const user = useSelector(state => state.user);
    const [videoTitle, setVideoTitle] = useState('');
    const [description, setDescription] = useState('');
    const [ThumbnailPath, setThumbnailPath] = useState('');
    const [fileName, setFileName] = useState('');
    let hashTags = [];

    const onTitleChange = e => {
        setVideoTitle(e.currentTarget.value)
    }

    const onDescriptionChange = e => {
        setDescription(e.currentTarget.value)
    }

    const handleAddTags = (tags) => {
        hashTags = tags;
        console.log('updatepage')
        console.log(hashTags)
    }

    const onDrop = files => {
        let formData = new FormData();
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append('file', files[0])

        Axios.post('/api/liveVideo/uploadfiles', formData, config)
            .then(res => {
                if (res.data.success) {
                    setThumbnailPath(res.data.url);
                    setFileName(res.data.fileName)
                } else {
                    alert("썸네일 업로드 실패")
                }
            })
    }

    const onSubmit = e => {
        e.preventDefault();

        const variable = {
            writer: user.userData._id,
            title: videoTitle,
            description: description,
            thumbnail: ThumbnailPath,
            tags: hashTags
        }

        Axios.post('/api/liveVideo/uploadLiveInfo', variable)
            .then(res => {
                if (res.data.success) {
                    alert("라이브 페이지로 이동합니다.")
                    props.history.push(`/broadcast/${localStorage.getItem('userId')}`)
                } else {
                    alert("라이브 준비에 실패 했습니다.")
                }
            })
    }

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <Form onSubmit={onSubmit}>
                <Input
                    value={videoTitle}
                    onChange={onTitleChange}
                    placeholder='제목을 쓰세요'
                    style={{ borderStyle: 'none', borderBottom: '1px solid #cdcec9'}}
                />
                <div style={{ display: 'flex', width: '100%', marginTop: '2rem' }}>
                    <Dropzone   
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={800000000}
                    >
                        {({ getRootProps, getInputProps}) => (
                            <div 
                                style={{ 
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
                                <p style={{ marginBottom: '0'}}>썸네일 추가</p>
                            </div>
                        )}
                    </Dropzone>
                    <div style={{ flex: '1', border: '2px solid #cdcec9' }}>
                        { fileName &&
                            (fileName)
                        }
                    </div>
                </div>
                
                <div>
                    <Dropzone   
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={800000000}
                    >
                        {({ getRootProps, getInputProps}) => (
                            <div 
                                style={{ 
                                    display: 'flex', width: '100%', height: '350px', border: '2px solid #cdcec9', marginTop: '1rem', justifyContent: 'center', alignItems: 'center'
                                }} 
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                    {
                                    ThumbnailPath &&
                                        <img src={`http://localhost:5000/${ThumbnailPath}`} alt="thumbnail" />
                                    }
                            </div>
                        )}
                    </Dropzone>
                </div>

                <br />
                <br />
                <hr />
                <br />
                <br />
                <TextArea
                    value={description}
                    onChange={onDescriptionChange}
                    placeholder='영상 소개'
                    style={{ height: '200px', border: '2px solid #cdcec9' }}
                />
                <br />
                <br />
                <HashTag addTags={handleAddTags} />
                <br />
                <br />
                <Button type="primary" style={{ background: '#48bcec'}} size="large" onClick={onSubmit}>
                    라이브 시작
                </Button>
            </Form>
            <br />
            <br />
        </div>
    )
}

export default BroadCastForm
