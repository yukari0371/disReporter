import { Client } from "discord.js-selfbot-v13";
export const client = new Client();

const token = "MTM0NTI4MDAzNDA0MjAxOTg1MA.GF_cCG._r9WgY9wdqIE4vNBX4EtfbobLxGBPbkvfbiSyU";
let running = true;

/** Functions */
import { getPassMesssages } from "./funcs/getPastMessages.js";
import { messageReport } from "./funcs/messageReport.js";
import { violationDetector } from "./funcs/violationDetector.js";
import {
    prompt,
    sleep,
    logger
} from "./utils.js";
import { channel } from "node:diagnostics_channel";

(async() => {
    await client.login(token);
    client.once("ready", async () => {
        logger.info(`logged in as: ${client.user.tag}`);
    });

    // menu
    console.log(`
Select menu
1. Retrieve past violation messages
e. exit
`);
    
    while (running) {
        const select = await prompt("select");
        switch (select) {
            case "1":
                const channelId = await prompt("channelId");
                const result = await getPassMesssages(channelId);
                if (result.success) {
                    for (const msg of result.allMessages) {
                        const isViolation = await violationDetector(msg.content);
                        if (isViolation.success) {
                            logger.info(`Found violation: ${msg.id} | ${msg.content}`);
                            return await messageReport(token, isViolation.type, channelId, msg.id);
                        } else {
                            logger.info(`Not a violation: ${msg.id}`);
                        }
                    }
                } else {
                    logger.error(result.message);
                }
            break;
            case "e":
                logger.info("Exiting...");
                await sleep(3000);
                process.exit(0);
            break;
            default:
                logger.error("Select is invalid.");
    }
    }

    client.on("messageCreate", async (message) => {
        const isViolation = await violationDetector(message.content);
        if (isViolation.success) {
            await messageReport(token, isViolation.type, message.channel.id, message.id);
        }
    });
})();