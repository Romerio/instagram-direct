const { 
    authPlatform,
    approveAllNewChats,
    getAllChatsWithNewMessages } = require('../src/index')

const process = async () => {
    try {
        const userClient = await authPlatform({ username: 'koruja_contato', password: 'krjknbx84902'  })
        
        // await getAllChatsWithNewMessages({ userClient })
        await approveAllNewChats({ userClient })
    } catch (error) {
        console.log(error)
    }
}

process()
  