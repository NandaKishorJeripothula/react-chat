//The Initial State 
const initialState = {
    chatCleared: false,
    //As no user logged in,its empty
    session: {},
    // session: { userName: "Nandu", uChar: "N" },
    reply: {},
    lastSeen_n: null,
    lastSeen_b: null,
    // reply:{
    //     from: "null",
    //     text: "null",
    //      url:"null"
    // }
    /**
     *  message.repliedTo = (props.reply.isMedia) ?
        {
          from: props.reply.from,
          isMedia: true,
          mediaType: props.reply.mediaType,
          downURL: props.reply.url
        }
        : {
          from: props.reply.from,
          text: props.reply.text,
        }
     */
}
export default function reducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_SESSION':
            return {
                ...state, session: action.session
            }
        case 'RESET_STATE':
            return {
                ...initialState
            }
        case 'SET_REPLY':
            // console.log(action.reply);
            return {
                ...state, reply: action.reply
            }
        case 'RESET_REPLY':
            return {
                ...state, reply: {}
            }
        case 'DATA_CLEARED':
            return {
                ...state, chatCleared: true
            }
        case 'RELOADED':
            return {
                ...state, chatCleared: false
            }
        case 'N_LASTSEEN':
            return {
                ...state, lastSeen_n: action.nStatus
            }
        case 'B_LASTSEEN':
            return {
                ...state, lastSeen_b: action.bStatus
            }
        default:
    }
    return state;
}