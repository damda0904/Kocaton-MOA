const GET_CHATS = 'get_chats';
const AFTER_POST_MESSAGE = 'after_post_message';

export default function chat(state={},action){
    switch(action.type){
        case GET_CHATS:
            return { ...state, chats: action.payload }
        case AFTER_POST_MESSAGE:
        return { ...state, chats: state.chats.concat(action.payload) }
        default:
            return state;
    }
}
