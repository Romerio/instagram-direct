const { IgApiClient } = require('instagram-private-api');

exports.loginUser = async ({ username, password }) => {
    try {
        const ig = new IgApiClient();

        ig.state.generateDevice(process.env.IG_USERNAME || username);

        await ig.simulate.preLoginFlow();
        await ig.account.login(process.env.IG_USERNAME || username, process.env.IG_PASSWORD || password);
        process.nextTick(async () => await ig.simulate.postLoginFlow());

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

exports.getAllNewChatMessages = async ({ userClient, lastMessageTimestamp }) => {
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
exports.getAllChatsWithNewMessages = async ({ userClient, timestamp }) => {
    try {
        const inboxFeed = userClient.feed.directInbox();
        const threads = await inboxFeed.items();

        console.log('# thread 0')
        console.log(threads[0])
        console.log('\n#\n')

        const thread = await userClient.entity.directThread(threads[0].thread_id);

        // await thread.markItemSeen(threads[0].last_permanent_item.item_id)
        if(timestamp) {
           // const thread = userClient.entity.directThread(threads[0].thread_id);
        } else {
            return threads
        }
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