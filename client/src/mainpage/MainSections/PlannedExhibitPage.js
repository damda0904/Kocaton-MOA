import React, { useState, useEffect } from 'react'
import { Row, Col, Card } from 'antd';
import Axios from 'axios';
import '../Mainpage.css';
import './PlannedExhibitPage.css';

function PlannedExhibitPage() {

    const [plannedVideo, setPlannedVideo] = useState([]);

    useEffect(() => {
        
        Axios.get('/api/video/getPlannedVidoes')
            .then(res => {
                if (res.data.success) {
                    console.log(res.data);
                    setPlannedVideo(res.data.videos)
                } else {
                    alert("예정 전시 비디오 가져오기를 실패했습니다.")
                }
        })

    }, [])

    const plannedRenderCards = plannedVideo.map((video, index) => {

        return (
            <Col lg={6} md={8} xs={24} key={index}>
                <a href={`/video/${video._id}`}>
                <Card
                    hoverable
                    style={{ width: 200, borderBottom: "1px solid black" }}
                    cover={<img alt={video.title} src={`http://localhost:5000/${video.thumbnail}`} className="Preview" />}
                    bordered={false}
                >
                    <p>{video.title}</p>
                    <p>{`${video.startDateString} ~ ${video.endDateString}`}</p>
                </Card>
                </a>
            </Col>
            
        ) 
    })

    return (
        <>
            <div className="moalook" >
                <p>예정전시</p>
            </div>
            <div style={{ width: '85%', margin: '3rem auto', paddingBottom: '3rem' }}>
                <Row gutter={[32, 16]}>
                    {plannedRenderCards}
                </Row>
            </div>
        </>
    )
}

export default PlannedExhibitPage
