const { 
    authPlatform,
    getAllChatsWithNewMessages,
    approveAllNewChats,
    getAllNewMessages,
    sendNewChatMessage
} = require('../src/index')

const process = async () => {
    try {
        const userClient = await authPlatform({ username: 'koruja_contato', password: 'krjknbx84902'  })
        
        await approveAllNewChats({ userClient })
        const chatsWithNewMessage = await getAllChatsWithNewMessages({ userClient })
        const allNewMessages = await getAllNewMessages({ userClient, chatsWithNewMessage })

        
        // Enviando imagem com sucesso
        /*await sendNewChatMessage({ 
            userClient, 
            type: 'image', 
            recipient_user_id: '20719596295', 
            content: 'http://s2.glbimg.com/3sfuZiC5CGOQHoppAVgRpW3GHXE=/s.glbimg.com/jo/g1/f/original/2016/05/11/instagram-logo-g1.jpg' 
        })*/
        
        await sendNewChatMessage({ 
            userClient, 
            type: 'audio', 
            recipient_user_id: '20719596295', 
            content: './examples/audios/ble-ble-ble-teste.mp4' 
        })

        console.log('## allNewMessages', allNewMessages.length)
        console.log(allNewMessages)
    } catch (error) {
        console.log(error)
    }
}

process()
  