const {
    authPlatform,
    getAllChatsWithNewMessages,
    approveAllNewChats,
    getAllNewMessages,
    sendNewChatMessage
} = require('../instagram-direct')

class KinboxDirect {
    constructor() {
        this.userClients = {}
    }

    async logIn({}) {
        try {
            
        } catch (error) {
            throw error
        }
    }

    async logOut({}) {
        try {
            
        } catch (error) {
            throw error
        }
    }

    async verifyIfIsAuthenticated({ sender }) {
        try {
            if(!this.userClients[sender]) {
                const workspacePlatform = await get({ identifier: sender })

                this.userClients[sender] = await authPlatform({ username, password })
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Verificar se o identifier está no this.userClients
     * Se não estiver, loga e associa o identifier
     * Se estiver, pega o userClient pela referência do identifier
     * 
     */
    async sendMessage({ 
        workspaceId = null,
        sender = null, // identifier do workspacePlatform
        recipient = null,
        hash = null,
        content = null,
        extraData = null,
        operator = null,
     }) {
        try {
            const obj = typeof content === 'object' ? content : JSON.parse(content)

            if(!sender)  throw new Error('sender (workspacePlatform identifier) is required')
            if(!recipient)  throw new Error('recipient is required')
            if(!content)  throw new Error('content is required')
            if(!workspaceId)  throw new Error('workspaceId is required')

            const message = obj.reduce((text, word) => {
                try {
                    if (word.insert.video) {
                        text = `${text} ${word.insert.video}`
                    }

                    if (word.insert.media_video) {
                        text = `${text} ${word.insert.media_video}`
                    }

                    if (word.insert.image) {
                        text = `${text} ${word.insert.image}`
                    }
                    if (word.insert.audio) {
                        text = `${text} ${word.insert.audio}`
                    }
                    if (word.insert.file) {
                        text = `${text} ${word.insert.file}`
                    }

                    if (!word.insert.video && !word.insert.image && !word.insert.audio && !word.insert.file) {
                        text = `${text} ${word.insert}`
                    }

                    return text.trim()
                } catch (e) {
                    throw e
                }
            }, '')

            if (process.env.NODE_ENV !== 'test') {
                await sendNewChatMessage({
                    userClient: null,
                    type: 'text', 
                    recipient_user_id , 
                    content: message,
                })
            }

            return {}
        } catch (error) {
            throw error
        }
    }

    async saveMessages({}) {
        try {
            
        } catch (error) {
            throw error
        }
    }
}

module.exports = new KinboxDirect()