const { loginUser, getAllNewChatsByTimestamp } = require('../src/index')

const process = async () => {
    try {
        const userClient = await loginUser({ username: 'koruja_contato', password: 'krjknbx84902'  })
        
        const chats =  await getAllNewChatsByTimestamp({ userClient, timestamp: null})
    } catch (error) {
        console.log(error)
    }
}

process()
  