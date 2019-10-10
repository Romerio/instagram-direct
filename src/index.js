const { IgApiClient } = require('instagram-private-api');
const asyncLib = require('async')
const promisify = require('util').promisify

const approveAllNewChats = async ({ userClient }) => {
    try {
        //console.log('# approveAllNewChats')
        const directPending = userClient.feed.directPending()
        //console.log('- directPending')
        //console.log(directPending)

        const items = await directPending.items()
        //console.log('- items')
        //console.log(items) // Conversas

        const thread_ids = items.map(item => item.thread_id)
        //console.log('- thread_ids')
        //console.log(thread_ids)

        await userClient.directThread.approveMultiple(thread_ids)

        console.log('# approveAllNewChats')
    } catch (error) {
        throw error
    }
}

exports.approveAllNewChats = approveAllNewChats

/**
 * userClient has userData now
 */
exports.authPlatform = async ({ username, password }) => {
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

exports.getChatWithNewMessages = async ({ userClient, lastMessageTimestamp }) => {
    try {
        
    } catch (error) {
        throw error
    }
}

/**
 * Search all chats with new messages
 * and, for each chat, fetch all new messages
 */

exports.getAllNewChatMessages = async ({ userClient, thread }) => {
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

/**
 * Buscar chats com novas mensagens
 * 
 */
exports.getAllChatsWithNewMessages = async ({ userClient }) => {
    try {
        console.log('## getAllChatsWithNewMessages')
        const inboxFeed = await userClient.feed.directInbox()
        let threads = null
        
        let chatsWithNewMessage = []
        let continueLoopCondiction = true

        while(continueLoopCondiction) {
            try {
                console.log('# começou a processar os chats')
                threads = await inboxFeed.items()
    
                const moreChatsWithNewMessage = threads.filter(chatItem => {
                    if(!chatItem.last_seen_at[userClient.userData.pk]) return true

                    const chatLastSeen = chatItem.last_seen_at[userClient.userData.pk].timestamp
    
                    return chatItem.last_permanent_item.timestamp > chatLastSeen
                })
    
                chatsWithNewMessage = moreChatsWithNewMessage.length > 0 
                    ? moreChatsWithNewMessage.filter(chatItem => {
                        return !chatItem.muted && !chatItem.is_group && !chatItem.archived
                    }).map(threadItem => {
                        return {
                            thread_id: threadItem.thread_id,
                            items: threadItem.items,
                            read_state: threadItem.read_state,
                            inviter: threadItem.inviter,
                            last_seen_at: threadItem.last_seen_at,
                            last_permanent_item:  threadItem.last_permanent_item
                        }
                    })
                    : chatsWithNewMessage
        
                if(moreChatsWithNewMessage.length >= 10) {
                    console.log(' - próxima página')
                } else {
                    console.log(' - não chama próxima página')
                    continueLoopCondiction = false
                }
            } catch (e) {
                console.log(e)
                continueLoopCondiction = false
            }
        }

        if(chatsWithNewMessage.length > 0) {
            // Buscar as novas mensagens de cada chat com nova mensagem
            console.log('# Tem chat com nova mensagem')
            console.log(chatsWithNewMessage)

            const thread = await userClient.entity.directThread(chatsWithNewMessage[0].thread_id)
            //setTimeout(async () => {
            await thread.markItemSeen(chatsWithNewMessage[0].last_permanent_item.item_id)
            // }, 5000)
        } else {
            // Provavelmente pegar a primeira mensagem de cada chat
            console.log('# Não tem chat com nova mensagem')
        }

        return chatsWithNewMessage
    } catch (error) {
        console.log(error)
        return []
    }
}

exports.getAllChatsWithNewMessages2 = ({ userClient }) => {
    try {
        console.log('## getAllChatsWithNewMessages')
        let inboxFeed = null
        let threads = null
        
        let chatsWithNewMessage = []
        const stopLoopFlag = true
        const continueLoopFlag = false
    
        asyncLib.doUntil(async (callbackFlow, callbackFlow2) => {
            try {
                console.log(callbackFlow, callbackFlow2)
                console.log('# começou a processar os chats')
    
                if(!inboxFeed) inboxFeed = await userClient.feed.directInbox()
                threads = await inboxFeed.items()
    
                const moreChatsWithNewMessage = threads.filter(chatItem => {
                    const chatLastSeen = chatItem.last_seen_at[userClient.userData.pk].timestamp
        
                    return chatItem.last_permanent_item.timestamp > chatLastSeen
                })
    
                console.log('# 0')
                chatsWithNewMessage = moreChatsWithNewMessage.length > 0 
                    ? moreChatsWithNewMessage.map(threadItem => {
                        return {
                            thread_id: threadItem.thread_id,
                            items: threadItem.items,
                            read_state: threadItem.read_state,
                            inviter: threadItem.inviter,
                            last_seen_at: threadItem.last_seen_at,
                            last_permanent_item:  threadItem.last_permanent_item
                        }
                    })
                    : chatsWithNewMessage
    
                console.log('# 1')
    
                if(moreChatsWithNewMessage.length >= 10) {
                    console.log('# próxima página')
                    return callbackFlow(null, continueLoopFlag)
                }
    
                console.log('# 2')
    
                return callbackFlow(null, stopLoopFlag)
            } catch (e) {
                console.log(e)
                return callbackFlow(null, stopLoopFlag)
            }
        }, 
        loopFlagTest => loopFlagTest,
        () => {
            console.log('# terminou de processar os chats')
    
            /*if(chatsWithNewMessage[0]) {
                const thread = await userClient.entity.directThread(chatsWithNewMessage[0].thread_id)
    
                setTimeout(async () => {
                    // await thread.markItemSeen(chatsWithNewMessage[0].last_permanent_item.item_id)
                }, 5000)
            }*/
    
            if(chatsWithNewMessage.length > 0) {
                // Buscar as novas mensagens de cada chat com nova mensagem
                console.log('# Tem chat com nova mensagem')
                console.log(chatsWithNewMessage)
                // const thread = userClient.entity.directThread(threads[0].thread_id);
            } else {
                // Provavelmente pegar a primeira mensagem de cada chat
                console.log('# Não tem chat com nova mensagem')
            }
    
            // return callback(null)
        })
    } catch (error) {
        throw error
    }
}

// exports.getAllChatsWithNewMessages = getAllChatsWithNewMessages // promisify(getAllChatsWithNewMessages)
    
exports.sendNewChatMessage = async ({ userClient, type, content }) => {
    try {

    } catch (error) {
        throw error
    }
}