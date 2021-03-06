const {
    authPlatform,
    getAllChatsWithNewMessages,
    approveAllNewChats,
    getAllNewMessages,
    sendNewChatMessage,
    getSession,
    restoreSession
} = require('../instagram-direct')

class KinboxDirect {
    constructor({ getWorkspaceSession, sendMessageToWorkspace }) {
        this.userClients = {}

        this.getWorkspaceSession = getWorkspaceSession
        this.sendMessageToWorkspace = sendMessageToWorkspace
    }

    // #TO-DO: fazer procedimento para baixar mídia da mensage
    async getMediaData({ }) {
        try {
            console.log('#getMediaData')
        } catch (error) {
            throw error
        }
    }

    /**
     * Usado na hora de adicionar o canal / Crud de canal
     *
     */
    async logInAndGetSession({
        username,
        password,
    }) {
        try {
            if (!username) throw new Error('username is required')
            if (!password) throw new Error('password is required')

            const userClient = await authPlatform({ username, password })

            const { cookies, state } = await getSession({ userClient })

            const session = JSON.stringify({ cookies, state })

            this.userClients[userClient.state.userData.pk] = userClient

            return { identifier: userClient.state.userData.pk, session }
        } catch (error) {
            throw error
        }
    }

    async logOutAndRemoveSession({ }) {
        try {
            console.log('#logOutAndRemoveSession')
        } catch (error) {
            throw error
        }
    }

    async verifyIfIsAuthenticated({ sender, workspaceId }) {
        try {
            if (!this.userClients[sender]) { // Restaurar sessão que está no workspacePlatform e salvar no this.userClients
                const session = await this.getWorkspaceSession({ identifier: sender, workspaceId })

                const userClientTOneRestored = await restoreSession(JSON.parse(session))

                if (!userClientTOneRestored) {
                    throw new Error(`Conta para sender ${sender} desconectada. Necessário realizar o login.`)
                }

                this.userClients[sender] = userClientTOneRestored
            }
        } catch (error) {
            throw error
        }
    }

    /**
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

            if (!sender) throw new Error('sender (workspacePlatform identifier) is required')
            if (!recipient) throw new Error('recipient is required')
            if (!content) throw new Error('content is required')
            if (!workspaceId) throw new Error('workspaceId is required')

            await this.verifyIfIsAuthenticated({ sender, workspaceId })

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
                    userClient: this.userClients[sender],
                    type: 'text',
                    recipient_user_id: recipient,
                    content: message,
                })
            }

            return {}
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async saveMessages({ }) {
        try {
            await this.sendMessageToWorkspace({

            })
        } catch (error) {
            throw error
        }
    }
}

module.exports = KinboxDirect
