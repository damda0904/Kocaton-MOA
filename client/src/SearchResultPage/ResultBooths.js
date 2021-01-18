import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Divider, Avatar } from 'antd';
import axios from 'axios';
import moment from 'moment';
import "antd/dist/antd.css";

const { Meta } = Card;


function ResultBooths(props) {

    //state
    const [Booths, setBooths] = useState([]);
    const [Video, setVideo] = useState([]);
    const [VideoIndex, setVideoIndex] = useState(0)

    let searched = []
    let videoSearched = []

    useEffect(() => {

        let body = {
            query: props.queryText
        }
        console.log("resultBooth 검색어", props.queryText)

        //검색된 이미지 카드(부스) 가져오기
        axios.post("/api/image/search", body)
            .then(response => {
                if (response.data.find) {
                    searched = searched.concat(response.data.image)
                    //console.log("현재 이미지 카드", searched)
                    setBooths(searched)
                    console.log("이미지 카드 in state", Booths)
                } else {
                    alert("게시물 가져오기를 실패했습니다")
                }

            })
            .catch(err => {
                console.log("에러 이미지", err.response)
            })

        //비디오 가져오기
        axios.post('/api/video/search', body)
            .then(res => {
                if (res.data.success) {
                    //console.log("현재 비디오", res.data);
                    videoSearched = videoSearched.concat(res.data.video)
                    setVideo(videoSearched)
                    setVideoIndex(videoSearched.length)
                    console.log("비디오 state", Video)
                } else {
                    alert("비디오 가져오기를 실패했습니다.")
                    setVideoIndex(0)
                }
            })
            .catch(err => {
                console.log("에러 비디오", err.response)
                setVideoIndex(0)
            })

    }, [props.alignType, props.queryText])


    //현재, 예정, 지난 부스로 구분
    const sortBooths = (sort) => {
        var i = 0;
        var now = new Date();

        //console.log("부스 state 상태", Booths)
        //console.log("sort", sort)

        if (Booths.length === 0) {
            return "err"
        }

        switch (sort) {
            case "current":
                var current = Booths.filter((v) => {
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
                //console.log(sort, "booths", current)
                return current

            case "past":
                var past = Booths.filter((v) => {
                    var start = new Date(v.startDate)
                    var end = new Date(v.endDate)

                    if (end.getTime() < now.getTime()) { return v }
                })
                //console.log(sort, "booths", past)
                return past

            case "future":
                var future = Booths.filter((v) => {
                    var start = new Date(v.startDate)

                    if (start.getTime() > now.getTime()) {
                        return v;
                    }
                })
                //console.log(sort, "booths", future)
                return future
        }

    }

    //비디오 정렬 및 레이아웃 생성
    const alignVideo = () => {
        if (VideoIndex === 0) {
            return
        }

        switch (props.alignType) {
            case "date":
                Video.sort(function (a, b) {
                    return a.createAt < b.createAt ? -1 : a.createAt > b.createAt ? 1 : 0;
                })
                break;
            case "name":
                Video.sort(function (a, b) {
                    return a.title < b.title ? -1 : a > b ? 1 : 0;
                })
                break;
        }

        console.log("렌더카드 전 비디오 state", Video)

        const renderCards = Video.map((video, index) => {
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

        //console.log("renderCards", renderCards)

        return renderCards
    }

    //부스 정렬
    const alignBooths = (booths) => {
        //console.log("align Booths", booths)
        if (booths === "err") { return "err" }

        //console.log("change Align", props.alignType)

        switch (props.alignType) {

            case "date":
                booths.sort(function (a, b) {
                    let aDate = new Date(a.boothStart)
                    let bDate = new Date(b.boothStart)

                    return aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
                })
                break;
            case "name":
                booths.sort(function (a, b) {
                    return a.title < b.title ? -1 : a > b ? 1 : 0;
                })
                break;
        }
        return booths
    }

    //부스 레이아웃 잡기
    const boothsLayout = (sort) => {
        var i = 0;
        var boothCards = [];
        var _booths = [];

        //console.log("sort: ", sort)

        if (sort === "current") {
            var tmp = sortBooths(sort)
            _booths = alignBooths(tmp)
        } else if (sort === "future") {
            var tmp = sortBooths(sort)
            _booths = alignBooths(tmp)
        } else {
            var tmp = sortBooths(sort)
            _booths = alignBooths(tmp)
        }


        console.log("_booths", _booths)

        if (_booths === "err") {
            return
        }

        while (i < _booths.length) {

            if (_booths.length - i > 3) {

                boothCards.push(
                    <Row justify="space-around" gutter={[0, 80]}>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i].title} src={_booths[i].src} className="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i].title}</p>
                                <p style={{ fontSize: "10px" }}>{moment(_booths[i].startDate).format("YYYY-MM-DD")} ~ {moment(_booths[i].endDate).format("YYYY-MM-DD")}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 1].title} src={_booths[i + 1].src} className="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 1].title}</p>
                                <p style={{ fontSize: "10px" }}>{moment(_booths[i + 1].startDate).format("YYYY-MM-DD")} ~ {moment(_booths[i + 1].endDate).format("YYYY-MM-DD")}</p>


                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 2].title} src={_booths[i + 2].src} className="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 2].title}</p>
                                <p style={{ fontSize: "10px" }}>{moment(_booths[i + 2].startDate).format("YYYY-MM-DD")} ~ {moment(_booths[i + 2].endDate).format("YYYY-MM-DD")}</p>


                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 3].title} src={_booths[i + 3].src} className="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 3].title}</p>
                                <p style={{ fontSize: "10px" }}>{moment(_booths[i + 3].startDate).format("YYYY-MM-DD")} ~ {moment(_booths[i + 3].endDate).format("YYYY-MM-DD")}</p>


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
                                cover={<img alt={_booths[i].title} src={_booths[i].src} className="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i].title}</p>
                                <p style={{ fontSize: "10px" }}>{moment(_booths[i].startDate).format("YYYY-MM-DD")} ~ {moment(_booths[i].endDate).format("YYYY-MM-DD")}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 1].title} src={_booths[i + 1].src} className="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 1].title}</p>
                                <p style={{ fontSize: "10px" }}>{moment(_booths[i + 1].startDate).format("YYYY-MM-DD")} ~ {moment(_booths[i + 1].endDate).format("YYYY-MM-DD")}</p>


                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 2].title} src={_booths[i + 2].src} className="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 2].title}</p>
                                <p style={{ fontSize: "10px" }}>{moment(_booths[i + 2].startDate).format("YYYY-MM-DD")} ~ {moment(_booths[i + 2].endDate).format("YYYY-MM-DD")}</p>


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
                                cover={<img alt={_booths[i].title} src={_booths[i].src} className="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i].title}</p>
                                <p style={{ fontSize: "10px" }}>{moment(_booths[i].startDate).format("YYYY-MM-DD")} ~ {moment(_booths[i].endDate).format("YYYY-MM-DD")}</p>
                            </Card>
                        </Col>
                        <Col>
                            <Card
                                hoverable
                                style={{ width: 200, borderBottom: "1px solid black" }}
                                cover={<img alt={_booths[i + 1].title} src={_booths[i + 1].src} className="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i + 1].title}</p>
                                <p style={{ fontSize: "10px" }}>{moment(_booths[i + 1].startDate).format("YYYY-MM-DD")} ~ {moment(_booths[i + 1].endDate).format("YYYY-MM-DD")}</p>


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
                                cover={<img alt={_booths[i].title} src={_booths[i].src} className="Preview" />}
                                bordered={false}
                            >
                                <p>{_booths[i].title}</p>
                                <p style={{ fontSize: "10px" }}>{moment(_booths[i].startDate).format("YYYY-MM-DD")} ~ {moment(_booths[i].endDate).format("YYYY-MM-DD")}</p>
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

    if (props.queryText === "") {
        return (
            <div>
                <h1 className="searchNothing">검색어가 없네요!</h1>
            </div>
        )
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


export default ResultBooths;