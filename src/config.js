export default {
  FirebaseConfig: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "fir-chat-2a1fe.firebaseapp.com",
    databaseURL: "https://fir-chat-2a1fe.firebaseio.com",
    projectId: "fir-chat-2a1fe",
    storageBucket: "fir-chat-2a1fe.appspot.com",
    messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID
  },
  actual: "5f4dcc3b5aa765d61d8327deb882cf99",
  FirebaseRef: {
    messageDB: "reactMuiChatMsgDB",
    mediaDB: "reactMuiChatMediaDB",
    storageBucket: "reactMuiChatUploads"
  },
  message: {
    from: "",
    hasMedia: "",
    mediaType: "", //image/video/doc
    downURL: "",
    message: "",
    repliedTo: {
      from: "",
      text: "",
      isMedia: true, //true or false
      mediaType: "",
      downURL: ""
    }
  },
  customColors: {
    wrapperPaper: "#BBDEFB",
    chatboxBar: "#282c34",
    messageBackgroung: "#f5f5f5"
  }
  // textMessage:{

  //     from:"",
  //     message:"",
  //     repliedToText:"",
  // },
  // nontextMessage:{
  //     from:"",
  //     downloadUrl:"",
  //     repliedTo:"",

  // },
};
