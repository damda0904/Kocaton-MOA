import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, List, Avatar, Tag } from 'antd';
import ChatPage from '../LiveChatPage/ChatPage';
import Subscriber from '../../VideoDetailPage/Sections/Subscriber';
import LiveLike from '../Sections/LiveLike';
import '../BroadCastPage/BroadCastPage.css'
import Axios from 'axios'
import io from 'socket.io-client';


function LiveVideoPage(props) {

    const liveId = props.match.params.liveId;
    const [liveDetail, setLiveDetail] = useState([])

    let peerConnection;
    const config = {
        iceServers: [
            { 
              "urls": "stun:stun.l.google.com:19302",
            },
        ]
    }

    const socket = io.connect("http://localhost:5000");
    const videoRef = useRef();

    useEffect(() => {
        Axios.post('/api/liveVideo/getLiveDetail', { liveId })
            .then(res => {
                if (res.data.success) {
                    setLiveDetail(res.data.liveDetail)
                } else {
                    alert("라이브 정보를 가져오길 실패했습니다.")
                }
            })
    }, [])

    useEffect(() => {
        socket.on("offer", (id, description) => {
            peerConnection = new RTCPeerConnection(config);
            peerConnection
                .setRemoteDescription(description)
                .then(() => peerConnection.createAnswer())
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit("answer", id, peerConnection.localDescription)
                })
            peerConnection.ontrack = e => {
                
                videoRef.current.srcObject = e.streams[0];
                       
                console.log("offer")
            }
            peerConnection.onicecandidate = e => {
                if (e.candidate) {
                    socket.emit("candidate", id, e.candidate)
                }
            }
        })
    }, [socket])

    useEffect(() => {
        socket.on("candidate", (id, candidate) => {
            peerConnection
                .addIceCandidate(new RTCIceCandidate(candidate))
                .catch(e => console.error(e))
        })
        
    }, [socket])

    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("watcher");
        })
    }, [socket])

    useEffect(() => {
        socket.on("broadcaster", () => {
            socket.emit("watcher");
        })
    }, [socket])

    useEffect(() => {
        window.onunload = window.onbeforeunload = () => {
            socket.close();
            peerConnection.close();
        }
    }, [window])

    const forMap = tag => {
        const tagElem = (
            <Tag>{tag}</Tag>
        );
        return (
            <span key={tag} style={{ display: 'inline-block'}}>
                {tagElem}
            </span>
        );
    }

    if (liveDetail.writer) {
        //const suberscribeButton = (liveDetail.writer._id !== localStorage.getItem('userId')) && (<Subscribe userTo={liveDetail.writer._id} userFrom={localStorage.getItem('userId')} />)
        const tagChild = liveDetail.tags.map(forMap);
        const suberscribeButton = (<Subscriber userTo={liveDetail.writer._id} userFrom={localStorage.getItem('userId')} />)
        return (
            <Row gutter={[16, 16]} style={{ margin: '0', padding: '0' }}>
                <Col lg={16} xs={24}>
                <div style={{ width: '100%', height: '140%', padding: '2rem 4rem', paddingRight: 0, marginRight: 0 }}>
                    <video style={{ width: '100%', height: '415px', outline: 'none' }} ref={videoRef} playsInline autoPlay muted controls /> 
                    <div>
                        <div style={{ paddingLeft: '0.2rem', marginTop: '0.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>{liveDetail.title}</div>
                        <div style={{ display: 'flex', paddingRight: '0.2rem', paddingLeft: '0.2rem' }}>
                            <div style={{ flex: '1', color: '#a0a19a' }}>시청자수 0회</div>
                            <LiveLike userId={localStorage.getItem('userId')} liveId={liveId} />
                        </div>
                    </div>
                    <hr style={{ borderBottom: 'none', borderTop: '2px solid lightgray' }} />
                    <List.Item
                            actions={[<Subscriber userTo={liveDetail.writer._id} userFrom={localStorage.getItem('userId')} />]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={liveDetail.writer.image} />}
                                title={liveDetail.writer.name}
                                description={liveDetail.description}
                            />
                    </List.Item>
                    <div>{tagChild}</div>
                    <br />
                    <hr style={{ borderBottom: 'none', borderTop: '2px solid lightgray' }} />
                </div>
                </Col>
                <Col lg={6} xs={24} className='chatBlock'>
                        <ChatPage />
                </Col>
            </Row>
        )
    }   else {
        return (
            <div>...</div>
        )
    }   
}

export default LiveVideoPage
