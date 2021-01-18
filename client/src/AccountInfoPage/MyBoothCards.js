import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './MyboothsStyle.css';
import "antd/dist/antd.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import moment from 'moment';
import { Row, Col, Card, Divider, Avatar } from 'antd';

// //날짜를 0000-00-00 이런식으로 필터링 해줄것
function MyBoothCards() {

    //state
    const [booths, setBooths] = useState([]);
    const [video, setVideo] = useState([]);

    //console.log("booth in server");

    let searched = []


    useEffect(() => {
        //console.log("component did mount")
        //console.log("pre booths", booths)

        const body = { id: localStorage.getItem('userId') }

        //검색된 부스 가져오기
        axios.post("/api/image/myBooths", body)
            .then(response => {
                console.log("검색된 부스", response.data.find)
                if (response.data.find) {
                    console.log("response", response)
                    searched = searched.concat(response.data.booth)
                    console.log("searched", searched)

                    if (searched.length !== 0) {
                        console.log("setBooths")
                        setBooths(searched)
                    }
                } else if (!response.data.find) {
                    alert("부스를 조회하는 데 실패했습니다.")
                }



            })
            .catch(err => {
                console.log("error message", err.message)
            })

        //비디오 가져오기
        axios.post('/api/video/getMyVideos', { owner: localStorage.getItem('userId') })
            .then(res => {
                console.log("비디오 가져오기", res)
                if (res.data.success && video.length !== 0) {
                    console.log("비디오 res", res);
                    setVideo(res.data.video)
                    console.log("현재 비디오", video)
                } 
                else if(!res.data.success) {
                    alert("현재 비디오 가져오기를 실패했습니다.")
                }else if(video.length === 0) {
                    alert("현재 비디오 가져오기를 실패했습니다.")
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }, [])

    //현재, 예정, 지난 부스로 구분
    const sortBooths = (sort) => {
        var i = 0;
        var now = new Date();

        console.log("부스들 시간 분류", booths.length)

        if (booths.length === 0) {
            return "err"
        }

        switch (sort) {
            case "current":
                var current = booths.filter((v) => {
                    var start = new Date(v.startDate)
                    var end = new Date(v.endDate)

                    if (start.getTime() < now.getTime()) {
                        if (end.getTime() > now.getTime()) {
                            return v;
                        } else if (end.getTime() === now.getTime()) {
                            return v;
                        }
                    } else if (start.getTime() === now.getTime()) {
                        if (end.getTime() > now.getTime()) {
                            return v;
                        } else if (end.getTime() === now.getTime()) {
                            return v;
                        }
                    }
                })
                console.log(sort, "booths", current)
                return current

            case "past":
                var past = booths.filter((v) => {
                    var start = new Date(v.startDate)
                    var end = new Date(v.endDate)

                    if (end.getTime() < now.getTime()) { return v }
                })
                console.log(sort, "booths", past)
                return past

            case "future":
                var future = booths.filter((v) => {
                    var start = new Date(v.startDate)
                    var end = new Date(v.endDate)

                    if (start.getTime() > now.getTime()) {
                        return v;
                    }
                })
                console.log(sort, "booths", future)
                return future
        }

    }

    //비디오 정렬 및 레이아웃 생성
    const alignVideo = () => {

        console.log("alignVideo 전", video)

        if (video.length === 0) {
            console.log("비디오가 없습니다.")
            return
        }

        video.sort(function (a, b) {
            return a.createAt < b.createAt ? -1 : a.createAt > b.createAt ? 1 : 0;
        })

        console.log("alignVideo", video)


        var renderCards = video.map((video, index) => {

            let minutes = Math.floor(video.duration / 60);
            let seconds = Math.floor(video.duration - minutes * 60);
            return (
                <Col lg={6} md={8} xs={24} key={index}>
                    <div style={{ position: 'relative' }}>
                        <a href={`/video/${video._id}`}>
                            <img style={{ width: '100%' }} src={`http://localhost:5000/${video.thumbnail}`} alt="thumbnail" />
                            <div style={{
                                bottom: 0, right: 0, position: 'absolute', margin: '4px',
                                color: '#fff', backgroundColor: 'rgba(17, 17, 17, 0.8)', opacity: 0.8,
                                padding: '2px 4px', borderRadius: '2px', letterSpacing: '0.5px', fontSize: '12px',
                                fontWeight: '500', lineHeight: '12px'
                            }}
                            >
                                <span>{minutes} : {seconds}</span>
                            </div>
                        </a>
                    </div>
                    <br />
                    <Card.Meta
                        avatar={<Avatar src={video.writer.image} />}
                        title={video.title}
                    />
                    <span>{video.writer.name}</span><br />
                    <span style={{ marginLeft: '3rem' }}>{video.views} views</span> - <span>{moment(video.createdAt).format("MMM Do YY")}</span>
                </Col>

            )
        })

        return renderCards
    }

    //부스 레이아웃 잡기
    const boothsLayout = (sort) => {
        var i = 0;
        var boothCards = [];

        const _booths = sortBooths(sort)

        console.log(sort, _booths)

        if (_booths === "err") {
            return
        }

        while (i < _booths.length) {
            var start = moment(_booths[i].startDate).format("YYYY-MM-DD")
            var end = moment(_booths[i].endDate).format("YYYY-MM-DD")

            if (_booths.length - i > 3) {

                boothCards.push(
                    <Row justify="space-around" gutter={[0, 80]}>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i].title} src={_booths[i].src} class="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i].title}</p>
                                <p>{start} ~ {end}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 1].title} src={_booths[i + 1].src} class="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 1].title}</p>
                                <p>{start} ~ {end}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 2].title} src={_booths[i + 2].src} class="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 2].title}</p>
                                <p>{start} ~ {end}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 3].title} src={_booths[i + 3].src} class="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 3].title}</p>
                                <p>{start} ~ {end}</p>
                            </Card>
                        </Col>
                    </Row>
                )
            }
            else if (_booths.length - i === 3) {
                boothCards.push(
                    <Row justify="space-around" gutter={[0, 80]}>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i].title} src={_booths[i].src} class="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i].title}</p>
                                <p>{start} ~ {end}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 1].title} src={_booths[i + 1].src} class="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 1].title}</p>
                                <p>{start} ~ {end}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 2].title} src={_booths[i + 2].src} class="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 2].title}</p>
                                <p>{start} ~ {end}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card bordered={false} style={{ width: 200 }} />
                        </Col>
                    </Row>
                )
            }
            else if (_booths.length - i === 2) {
                boothCards.push(
                    <Row justify="space-around" gutter={[0, 80]}>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i].title} src={_booths[i].src} class="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i].title}</p>
                                <p>{start} ~ {end}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 1].title} src={_booths[i + 1].src} class="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 1].title}</p>
                                <p>{start} ~ {end}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card bordered={false} style={{ width: 200 }} />
                        </Col>
                        <Col>
                            <Card bordered={false} style={{ width: 200 }} />
                        </Col>
                    </Row>
                )
            }
            else if (_booths.length - i === 1) {
                boothCards.push(
                    <Row justify="space-around" gutter={[0, 80]}>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i].title} src={_booths[i].src} class="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i].title}</p>
                                <p>{start} ~ {end}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card bordered={false} style={{ width: 200 }} />
                        </Col>
                        <Col>
                            <Card bordered={false} style={{ width: 200 }} />
                        </Col>
                        <Col>
                            <Card bordered={false} style={{ width: 200 }} />
                        </Col>
                    </Row>
                )
            }
            i = i + 4;
        };
        return boothCards;
    }

    return (
        <div>
            <Divider style={{ margin: "50px 0 70px 0" }}>비디오</Divider>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <div style={{ width: "1200px" }}>
                    {alignVideo()}
                </div>
            </div>
            <Divider style={{ margin: "50px 0 70px 0" }}>현재 아트</Divider>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <div style={{ width: "1200px" }}>
                    {boothsLayout("current")}
                </div>
            </div>

            <Divider style={{ margin: "50px 0 70px 0" }}>예정 아트</Divider>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <div style={{ width: "1200px" }}>
                    {boothsLayout("future")}
                </div>
            </div>
            <Divider style={{ margin: "50px 0 70px 0" }}>지난 아트</Divider>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <div style={{ width: "1200px" }}>
                    {boothsLayout("past")}
                </div>
            </div>
        </div>
    )
}

export default MyBoothCards;