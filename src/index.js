const { IgApiClient } = require('instagram-private-api');
const ig = new IgApiClient();

exports.loginUser = async ({ username, password }) => {
    try {
        ig.state.generateDevice(process.env.IG_USERNAME || username);
        await ig.simulate.preLoginFlow();

        const userClient = await ig.account.login(process.env.IG_USERNAME || username, process.env.IG_PASSWORD || password);

        return userClient
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

exports.getAllNewChatMessages = async ({ userClient, lastMessageTimestamp }) => {
    try {
        
    } catch (error) {
        throw error
    }
}

exports.sendNewChatMessage = async ({ userClient, message }) => {
    try {
        const type = message.type
        const content = message.content

    } catch (error) {
        throw error
    }
}

exports.approveAllNewChats = async ({ userClient }) => {
    try {

    } catch (error) {
        throw error
    }
}