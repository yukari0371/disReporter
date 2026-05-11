import { client } from "../index.js";

/** Functions */
import {
    logger,
    sleep
} from "../utils.js";

export async function getPassMesssages(channelId) {
    try {
        const channel = await client.channels.fetch(channelId);
        const allMessages = [];
        let lastId;
        while (true) {
            const options = { limit: 100 };
            if (lastId) {
                options.before = lastId;
            }
            const messages = await channel.messages.fetch(options);
            allMessages.push(...messages.values());
            if (messages.size < 100) {
                break;
            }
        await sleep(1500);
        lastId = messages.lastKey();
        }
        return {
            success: true,
            allMessages: allMessages        
        };
    } catch (e) {            
            return {
                success: false,
                message: e.message
        };
    }
}