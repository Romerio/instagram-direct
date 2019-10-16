const { 
    authPlatform,
    getAllChatsWithNewMessages,
    approveAllNewChats,
    getAllNewMessages
} = require('../src/index')

const process = async () => {
    try {
        const userClient = await authPlatform({ username: 'koruja_contato', password: 'krjknbx84902'  })
        
        await approveAllNewChats({ userClient })
        const chatsWithNewMessage = await getAllChatsWithNewMessages({ userClient })
        const allNewMessages = await getAllNewMessages({ userClient, chatsWithNewMessage })

        console.log('## allNewMessages')
        console.log(allNewMessages)
    } catch (error) {
        console.log(error)
    }
}

process()
  