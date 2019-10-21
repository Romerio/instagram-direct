const { IgApiClient } = require('instagram-private-api')
const request = require('request').defaults({ encoding: null })
const { readFileSync, writeFileSync } = require('fs')

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

        /*const firstPageOfMessages = chatData.items.filter(messageItem => {
            return messageItem.user_id !== userClient.userData.pk && messageItem.timestamp > chatLastSeen
        })*/

        const firstPageOfMessages = chatData.items.reduce((acc, messageItem) => {
            if(messageItem.user_id !== userClient.userData.pk) {
                acc.messagesFromInviterCounter = acc.messagesFromInviterCounter + 1

                if(messageItem.timestamp > chatLastSeen) {
                    acc.newMessages.push(messageItem)
                }
            }

            return acc
        }, { messagesFromInviterCounter: 0, newMessages: []})

        // Se o número de mensagens novas é menor do que o número total de mensagens do interlocutor, não pega próxima página
        if(firstPageOfMessages.newMessages.length < firstPageOfMessages.messagesFromInviterCounter) {
            return firstPageOfMessages.newMessages
        }

        // Necessário pegar novas páginas:
        let newMessages = [...firstPageOfMessages.newMessages]

        const chatToProcess = await userClient.feed.directThread(chatData);

        let continueLoopCondiction = true
        let currentPage = []

        // skip first page
        await chatToProcess.items()
        
        while(continueLoopCondiction) {
            try {
                currentPage = await chatToProcess.items()
            
                /*const moreNewMessages = currentPage.filter(messageItem => {
                    return messageItem.user_id !== userClient.userData.pk && messageItem.timestamp > chatLastSeen
                })*/

                const moreNewMessages = currentPage.reduce((acc, messageItem) => {
                    if(messageItem.user_id !== userClient.userData.pk) {
                        acc.messagesFromInviterCounter = acc.messagesFromInviterCounter + 1
        
                        if(messageItem.timestamp > chatLastSeen) {
                            acc.newMessages.push(messageItem)
                        }
                    }
        
                    return acc
                }, { messagesFromInviterCounter: 0, newMessages: []})

                if(moreNewMessages.newMessages.length > 0) {
                    newMessages = [
                        ...newMessages,
                        ...moreNewMessages.newMessages
                    ]
                }

                // console.log('## ', moreNewMessages.newMessages.length, moreNewMessages.messagesFromInviterCounter, moreNewMessages.newMessages.length < moreNewMessages.messagesFromInviterCounter)

                if(moreNewMessages.newMessages.length < moreNewMessages.messagesFromInviterCounter) {
                    continueLoopCondiction = false
                }
            } catch (e) {
                continueLoopCondiction = false
            }
        }

        // await chatToProcess.markItemSeen(chatData.last_permanent_item.item_id)

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

                //console.log('## voice_media')
                //console.log(threads[0].items[0].voice_media)
                // baixando imagem do instagram
                /*console.log('## image')
                console.log(threads[0].items[0])
                console.log('\n## image_versions2')
                console.log(threads[0].items[0].media.image_versions2)

                const fileData = await new Promise((resolve, reject) => {
                    request.get(threads[0].items[0].media.image_versions2.candidates[0].url, (error, response, body) => {
                        if (!error && response.statusCode === 200) {        
                            return resolve(body)
                        }
                        return reject(error)
                    })
                })

                writeFileSync("./examples/images/file-teste.jpg", fileData);*/

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

                    const thread = await userClient.entity.directThread(chatItem.thread_id)
                    await thread.markItemSeen(chatItem.last_permanent_item.item_id)
                }

            }
            
        }

        return allNewMessages
    } catch (error) {
        console.log(error)
        throw error
    }
}

const sendNewChatMessage = async ({ userClient, type = 'text', recipient_user_id , content }) => {
    try {
        const thread = userClient.entity.directThread([recipient_user_id.toString()]);

        switch (type) {
            case 'text':
                await thread.broadcastText(content)
                break
            case 'image':
                const base64image = await new Promise((resolve, reject) => {
                    request.get(content, (error, response, body) => {
                        if (!error && response.statusCode === 200) {        
                            return resolve(body)
                        }
                        return reject(error)
                    })
                })
                
                await thread.broadcastPhoto({
                    file: base64image,
                })
                break
            case 'link':
                await thread.broadcastLink(content, [content])
                break
            /*case 'audio':
                await thread.broadcast({
                    video: readFileSync(content),
                    file: readFileSync(content),
                })
                break*/
            default:
                break
        }
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
