const { IgApiClient } = require('instagram-private-api');

const approveAllNewChats = async ({ userClient }) => {
    try {
        const directPending = userClient.feed.directPending()
        const items = await directPending.items()

        const thread_ids = items.map(item => item.thread_id)

        await userClient.directThread.approveMultiple(thread_ids)
    } catch (error) {
        throw error
    }
}

/**
 * userClient has userData now
 */
const authPlatform = async ({ username, password }) => {
    try {
        const ig = new IgApiClient();

        ig.state.generateDevice(process.env.IG_USERNAME || username);

        await ig.simulate.preLoginFlow();
        const loggedUser = await ig.account.login(process.env.IG_USERNAME || username, process.env.IG_PASSWORD || password);
        process.nextTick(async () => await ig.simulate.postLoginFlow());

        ig.userData = {
            pk: loggedUser.pk
        }

        return ig
    } catch (error) {
        throw error
    }
}

/**
 * Search all chats with new messages
 * and, for each chat, fetch all new messages
 */

const getAllNewChatMessages = async ({ userClient, chatData }) => {
    try {
        if(!chatData || !chatData.thread_id) return []

        const chatLastSeen = chatData.last_seen_at[userClient.userData.pk] ? chatData.last_seen_at[userClient.userData.pk].timestamp : null

        // Esse chat nunca foi processado antes, não tem referência de última mensagem que pegou
        // Retorna apenas a última mensagem da conversa
        if(!chatLastSeen) {
            return [chatData.items[0]]
        }

        const firstPageOfMessages = chatData.items.filter(messageItem => {
            return messageItem.user_id !== userClient.userData.pk && messageItem.timestamp > chatLastSeen
        })

        // Nem todas as mensagens da primeira página são novas, então não precisa pegar próxima página
        if(firstPageOfMessages.length < 10) {
            return firstPageOfMessages
        }

        // Necessário pegar novas páginas:
        let newMessages = [...firstPageOfMessages]

        const chatToProcess = await userClient.feed.directThread(chatData);

        let continueLoopCondiction = true
        let currentPage = []

        // skip first page
        await chatToProcess.items()
        
        while(continueLoopCondiction) {
            try {
                currentPage = await chatToProcess.items()
            
                const moreNewMessages = currentPage.filter(messageItem => {
                    return messageItem.user_id !== userClient.userData.pk && messageItem.timestamp > chatLastSeen
                })

                if(moreNewMessages.length > 0) {
                    newMessages = [
                        ...newMessages,
                        ...moreNewMessages
                    ]
                }

                if(moreNewMessages.length < 10) {
                    continueLoopCondiction = false
                }
            } catch (e) {
                continueLoopCondiction = false
            }
        }

        await chatToProcess.markItemSeen(chatData.last_permanent_item.item_id)

        return newMessages
    } catch (error) {
        console.log(error)
        return []
    }
}

/**
 * Buscar chats com novas mensagens
 * se não existir last_seen_at[userClient.userData.pk]: pegar a última mensagem do chat
 * 
 */

 const getAllChatsWithNewMessages = async ({ userClient }) => {
    try {
        const inboxFeed = await userClient.feed.directInbox()
        let threads = null
        
        let chatsWithNewMessage = []
        let continueLoopCondiction = true

        while(continueLoopCondiction) {
            try {
                threads = await inboxFeed.items()
    
                const moreChatsWithNewMessage = threads.filter(chatItem => {
                    if(!chatItem.last_seen_at[userClient.userData.pk]) return true

                    const chatLastSeen = chatItem.last_seen_at[userClient.userData.pk].timestamp
    
                    return chatItem.last_permanent_item.timestamp > chatLastSeen
                })

                chatsWithNewMessage = moreChatsWithNewMessage.length > 0 
                    ? [
                        ...moreChatsWithNewMessage.reduce((acc, chatItem) => {
                            if(!chatItem.muted && !chatItem.is_group && !chatItem.archived) {
                                acc.push({
                                    thread_id: chatItem.thread_id,
                                    items: chatItem.items,
                                    read_state: chatItem.read_state,
                                    inviter: chatItem.inviter,
                                    last_seen_at: chatItem.last_seen_at,
                                    last_permanent_item:  chatItem.last_permanent_item
                                })
                            }

                            return acc
                        }, chatsWithNewMessage)
                      ]
                    : chatsWithNewMessage
        
                if(moreChatsWithNewMessage.length < 10) {
                    continueLoopCondiction = false
                }
            } catch (e) {
                continueLoopCondiction = false
            }
        }

        return chatsWithNewMessage
    } catch (error) {
        console.log(error)
        return []
    }
}

const getAllNewMessages = async ({ userClient, chatsWithNewMessage }) => {
    try {
        let allNewMessages = []

        if(chatsWithNewMessage.length > 0) {
            for (const chatItem of chatsWithNewMessage) {
                const newMessages = await getAllNewChatMessages({ userClient, chatData: chatItem })

                if(newMessages.length > 0) {
                    allNewMessages = [
                        ...allNewMessages,
                        ...newMessages.map(messagemItem => {
                            messagemItem.username = chatItem.inviter.username

                            return messagemItem
                        })
                    ]
                }

            }
        }

        return allNewMessages
    } catch (error) {
        console.log(error)
        throw error
    }
}

const sendNewChatMessage = async ({ userClient, type, content }) => {
    try {
        const inboxFeed = ig.feed.directInbox();
        const threads = await inboxFeed.items();
        
        await thread.broadcastPhoto({
            file: readFileSync('./tools/images/original.jpg'),
        });
    } catch (error) {
        throw error
    }
}

exports.getAllNewMessages = getAllNewMessages
exports.authPlatform = authPlatform
exports.approveAllNewChats = approveAllNewChats
exports.getAllNewChatMessages = getAllNewChatMessages
exports.getAllChatsWithNewMessages = getAllChatsWithNewMessages
exports.sendNewChatMessage = sendNewChatMessage
