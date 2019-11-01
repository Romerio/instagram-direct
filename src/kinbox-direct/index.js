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

    async logIn({ username, password }) {
        try {
            if(!username)  throw new Error('username is required')
            if(!password)  throw new Error('password is required')

            const userClient= await authPlatform({ username, password })

            this.userClients[sender] = userClient

            return true
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
                throw new Error('Conta desconectada. Necessário realizar o login.')
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

            if(!this.userClients[sender]) {
                throw new Error('Conta desconectada. Necessário realizar o login.')
            }

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