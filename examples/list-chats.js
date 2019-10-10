const { 
    authPlatform,
    getAllChatsWithNewMessages,
    approveAllNewChats
} = require('../src/index')

const process = async () => {
    try {
        const userClient = await authPlatform({ username: 'koruja_contato', password: 'krjknbx84902'  })
        
        await approveAllNewChats({ userClient })
        await getAllChatsWithNewMessages({ userClient })
    } catch (error) {
        console.log(error)
    }
}

process()
  