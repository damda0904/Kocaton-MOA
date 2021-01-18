import React, {useEffect, useState} from 'react'
import axios from 'axios'

function Subscriber(props) {
    const userTo = props.userTo
    const userFrom = props.userFrom
    const [ SubscribeNumber, setSubscribeNumber] = useState(0)
    const [ Subscribed, setSubscribed] = useState(false)

    const onSubscribe = ( ) => {

        let subscribeVariables = {
                userTo : userTo,
                userFrom : userFrom
        }

        if(Subscribed) {
            //when we are already subscribed 
            axios.post('/api/subscribe/unSubscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success){ 
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('Failed to unsubscribe')
                    }
                })

        } else {
            // when we are not subscribed yet
            
            axios.post('/api/subscribe/subscribe', subscribeVariables)
                .then(response => {
                    if(response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('Failed to subscribe')
                    }
                })
        }

    }


    useEffect(() => {

        const subscribeNumberVariables = { userTo: userTo, userFrom: userFrom }
        axios.post('/api/subscribe/subscribeNumber', subscribeNumberVariables)
            .then(response => {
                if (response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                } else {
                    alert('Failed to get subscriber Number')
                }
            })

        axios.post('/api/subscribe/subscribed', subscribeNumberVariables)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subcribed)
                } else {
                    alert('Failed to get Subscribed Information')
                }
            })

    }, [])

    return (
        <div>
            <button onClick={onSubscribe}
                    style={{ backgroundColor:`${Subscribed ? '#AAAAAA' : '#48bcec'}`, borderRadius: '4px',
                    color: 'white', padding: '5px 16px', borderStyle: 'none',
                    fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase', cursor: 'pointer' }}
                    >
                        {Subscribed ? '구독중' : '구독'}
                    </button>
        </div>
    )
}

export default Subscriber
