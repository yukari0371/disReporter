import axios from "axios";

//** Functions */
import { logger } from "../utils.js";

const endpoint = "https://discord.com/api/v9/reporting/message";
const payloads = (channelId, messageId) => [
    {
        // 13歳未満
        "version": "1.0",
        "variant": "8",
        "language": "en",
        "breadcrumbs": [
            7,
            80,
            91,
            127
        ],
        "elements": {},
        "channel_id": channelId,
        "message_id": messageId,
        "name": "message"
    },
    {
        // token貼り
        "version": "1.0",
        "variant": "8",
        "language": "en",
        "breadcrumbs": [
            7,
            10,
            31
        ],
        "elements": {},
        "channel_id": channelId,
        "message_id": messageId,
        "name": "message"
    },
    {
        // steamcommunity
        "version": "1.0",
        "variant": "8",
        "language": "en",
        "breadcrumbs": [
            7,
            80,
            126
        ],
        "elements": {},
        "channel_id": channelId,
        "message_id": messageId,
        "name": "message"
    }
]

// Reporter
export async function messageReport(token, type, channelId, messageId) {
    try {
        const payload = payloads(channelId, messageId)[type];
        const res = await axios.post(endpoint, payload, {
            headers: {
                Authorization: token,
                "Content-Type": "application/json"
            }
        });
        if (res.status == 200 || 204) {
            return logger.success("Reported:", messageId);
        }
        return logger.error(`Status: ${res.status} | ${res.statusText}`);
    } catch (e) {
        if (e.response.status == 429) {
            return logger.error(`Status: ${e.response.status} Rate limit`);
        }
        return logger.error(e.message);
    }
}