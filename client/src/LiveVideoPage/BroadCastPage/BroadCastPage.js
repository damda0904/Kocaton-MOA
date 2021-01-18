import React, { useEffect, useState, useRef } from 'react';
import { Row, Col, List, Avatar, Skeleton, Tag, Button } from 'antd';
import ChatPage from '../LiveChatPage/ChatPage';
import Subscriber from '../../VideoDetailPage/Sections/Subscriber';
import LiveLike from '../Sections/LiveLike';
import './BroadCastPage.css';
import Axios from 'axios';
import io from 'socket.io-client';

function BroadCastPage(props) {

    let broadcasterId = localStorage.getItem('userId');
    const [liveDetail, setLiveDetail] = useState([])

    const [peerConnections, setPeerConnections] = useState({});
    const [stream, setStream] = useState();
    const [numberOfViewers, setNumberOfViewers] = useState(0);

    const config = {
        iceServers: [
          {
            urls: ["stun:stun.l.google.com:19302"],
          },
        ],
    };

    const socket = io.connect("http://localhost:5000");
    const videoRef = useRef();

    useEffect(() => {
        Axios.post('/api/liveVideo/getLiveDetailByBroadcaster', { broadcasterId })
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.liveDetail)
                    setLiveDetail(res.data.liveDetail)
                } else {
                    alert("라이브 정보를 가져오길 실패했습니다.")
                }
            })
    }, [])

    useEffect(() => {
        socket.on("watcher", (id) => {
            const peerConnection = new RTCPeerConnection(config);
            setPeerConnections(peerConnections[id] = peerConnection);
            console.log(peerConnections);

            let stream = videoRef.current.srcObject;
            stream
                .getTracks()
                .forEach((track) => peerConnection.addTrack(track, stream));

            peerConnection.onicecandidate = e => {
                if (e.candidate) {
                    socket.emit("candidate", id, e.candidate);
                }
            }

            peerConnection
                .createOffer()
                .then((sdp) => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit("offer", id, peerConnection.localDescription);
                })

            setNumberOfViewers(Object.keys(peerConnections).length)
        })

    }, [socket])

    useEffect(() => {
        socket.on("answer", (id, description) => {
            peerConnections[id].setRemoteDescription(description);
        })
    }, [socket])

    useEffect(() => {
        socket.on("candidate", (id, candidate) => {
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        })
    }, [socket])

    useEffect(() => {
        socket.on("disconnectPeer", (id) => {
            peerConnections[id].close();
            delete peerConnections[id];
            setNumberOfViewers(Object.keys(peerConnections).length);
        })
    }, [])

    useEffect(() => {
        window.onunload = window.onbeforeunload = () => {
            socket.close();
        }
    }, [window])

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            
            videoRef.current.srcObject = stream;
            socket.emit("broadcaster");
        })

    }, [])

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

    const handleLiveClose = () => {
        Axios.post('/api/liveVideo/removeLiveData', { broadcasterId })
        .then(res => {
            if (res.data.success) {
                alert("라이브가 종료되었습니다.")
                window.location.href='/'
                

            } else {
                alert("라이브 종료를 실패했습니다. ")
            }
        })
    }

    if (liveDetail.writer) {
        // const suberscribeButton = (<Subscribe userTo={liveDetail.writer._id} userFrom={localStorage.getItem('userId')} />)
        const tagChild = liveDetail.tags.map(forMap);
        return (
            <Row gutter={[16, 16]} style={{ margin: '0', padding: '0' }}>
                <Col lg={16} xs={24}>
                    <div style={{ width: '100%', height: '140%', padding: '2rem 4rem', paddingRight: 0, marginRight: 0 }}>
                        <video style={{ width: '100%', height: '415px', outline: 'none' }} ref={videoRef} playsInline autoPlay muted controls />
                        <div>
                            <div style={{ paddingLeft: '0.2rem', marginTop: '0.5rem', marginBottom: '0.5rem', fontSize: '1.3rem' }}>{liveDetail.title}</div>
                            <div style={{ display: 'flex', paddingRight: '0.2rem', paddingLeft: '0.2rem' }}>
                                <div style={{ flex: '1', color: '#a0a19a' }}>시청자수 0회</div>
                                <LiveLike userId={localStorage.getItem('userId')} liveId={liveDetail._id} />
                            </div>
                        </div>
                        <hr style={{ borderBottom: 'none', borderTop: '2px solid lightgray' }} />
                        
                        <List.Item
                            actions={[
                                <Subscriber userTo={liveDetail.writer._id} userFrom={localStorage.getItem('userId')} />,
                                <Button 
                                    style={{ backgroundColor: '#48bcec', borderRadius: '4px',
                                        color: 'white', padding: '5px 16px', borderStyle: 'none', paddingBottom: '7px',
                                        fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase', cursor: 'pointer' }}
                                        onClick={handleLiveClose}>
                                        라이브 종료
                                </Button>
                                    ]}
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
    } else {
        return (
            <Row gutter={[16, 16]} style={{ width: '1263px'}}>
                <Col lg={16} xs={24}>
                    <div style={{ width: '100%', height: '140%', padding: '2rem 4rem', paddingRight: 0, marginRight: 0 }}>
                        <video style={{ width: '100%', height: '415px', outline: 'none' }} ref={videoRef} playsInline autoPlay muted controls />
                        <Skeleton avatar paragraph={{ rows: 4 }} />
                    </div>
                </Col>
                <Col lg={6} xs={24} className='chatBlock'>
                    <ChatPage />
                </Col>
            </Row>
        )
    }

}

export default BroadCastPage