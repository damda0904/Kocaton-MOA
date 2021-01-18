import axios from 'axios';

export function getChats(){
    const request = axios.get('/api/chat/getChats')
        .then(response => response.data);
    
    return {
        type: 'get_chats',
        payload: request
    }
}

export function afterPostMessage(data){
    
    return {
        type: 'after_post_message',
        payload: data
    }
}