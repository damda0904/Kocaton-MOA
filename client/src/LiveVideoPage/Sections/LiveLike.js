import React, { useEffect, useState } from 'react'
import { Tooltip } from 'antd'
import { LikeOutlined, LikeFilled } from '@ant-design/icons'
import Axios from 'axios'

function LiveLike(props) {

    const [Likes, setLikes] = useState(0)
    const [LikeAction, setLikeAction] = useState(null)

    let variable = { videoId: props.liveId, userId: props.userId }

    useEffect(() => {
        Axios.post('/api/like/getLiveLikes', variable)
            .then(res => {
                if (res.data.success) {
                    // 얼마나 많은 좋아요를 받았는지
                    setLikes(res.data.likes.length)
                    // 내가 이미 좋아요를 눌렀는지
                    res.data.likes.map(like => {
                        if (like.userId === props.userId) {
                            setLikeAction('liked')
                        } 
                    })
                } else {
                    alert("좋아요 정보를 가져오지 못 했습니다.")
                }
            })
    }, [Likes, LikeAction])

    const handleLikeUpdate  = (option) => {
        if (option === 'plus') {
            Axios.post('/api/like/insertLiveLikes', variable)
            .then(res => {
                if (res.data.success) {
                    setLikes(Likes + 1)
                    setLikeAction('liked')
                } else {
                    alert("좋아요를 업데이트하지 못 했습니다. ")
                }
            })
        } else {
            Axios.post('/api/like/deleteLiveLikes', variable)
                .then(res => {
                    if (res.data.success) {
                        setLikes(Likes - 1)
                        setLikeAction(null)
                    } else {
                        alert("좋아요를 취소하지 못 했습니다. ")
                    }
                })
        }
        
    }

    return (
        <div>
            <span key="comment-basic-like">
                {
                    LikeAction === 'liked' 
                    ?   (<Tooltip title="Canceled">
                            <LikeFilled style={{ cursor: 'pointer', fontSize: '1.1rem', color: 'gray' }} onClick={() => handleLikeUpdate('minus')} />
                        </Tooltip>)
                    :   (<Tooltip title="Like">
                            <LikeOutlined style={{ cursor: 'pointer', fontSize: '1.1rem', color: 'gray' }} onClick={() => handleLikeUpdate('plus')} />
                        </Tooltip>)
                }
                {console.log(Likes)}
                <span style={{ paddingLeft: '8px', cursor: 'auto', fontSize: '1.1rem', color: 'gray' }}>{Likes}</span>
            </span>
        </div>
    )
}

export default LiveLike
