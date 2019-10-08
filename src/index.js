const { IgApiClient } = require('instagram-private-api');

const approveAllNewChats = async ({ userClient }) => {
    try {
        console.log('# approveAllNewChats')
        const pendingFeed = await userClient.feed.directPending();

        const items = await pendingFeed.items();

        console.log(items)
        console.log('#')
        console.log(pendingFeed.approveMultiple)
        console.log(items.approveMultiple)
        console.log(userClient.entity.approveMultiple)
        console.log(userClient.feed.approveMultiple)

    } catch (error) {
        throw error
    }
}

exports.approveAllNewChats = approveAllNewChats

exports.authPlatform = async ({ username, password }) => {
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
        await approveAllNewChats({ userClient })

        const inboxFeed = userClient.feed.directInbox();
        const threads = await inboxFeed.items();

        const hasChatWithNewMessage = threads.find(item => {
            return parseInt(item.read_state, 10) === 1
        })

        console.log('# thread 0')
        console.log(threads[0])
        console.log('\n#\n')

        const thread = await userClient.entity.directThread(threads[0].thread_id);

        console.log(thread.approveMultiple)
        console.log(userClient.entity.approveMultiple)
        console.log(threads[0].approveMultiple)
        console.log(inboxFeed.approveMultiple)

        // await thread.markItemSeen(threads[0].last_permanent_item.item_id)
        if(hasChatWithNewMessage) {
            console.log('# Tem chat com nova mensagem')
           // const thread = userClient.entity.directThread(threads[0].thread_id);
        } else {
            console.log('# Não tem chat com nova mensagem')

            return threads
        }
    } catch (error) {
        throw error
    }
}

exports.sendNewChatMessage = async ({ userClient, type, content }) => {
    try {

    } catch (error) {
        throw error
    }
}