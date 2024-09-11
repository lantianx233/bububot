import { autoRetry, Bot, Context, InputFile } from "./deps.ts";
import { getRandomFile } from "./getCapoo.ts";

export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");
bot.api.config.use(autoRetry());

bot.command("start", async (ctx) => {
    await ctx.reply("🐳", {
        reply_parameters: { message_id: ctx.msg.message_id },
    });
    await ctx.reply(
        '<a href="https://github.com/lantianx233/bububot">Github页面</a>',
        {
            reply_parameters: { message_id: ctx.msg.message_id },
            parse_mode: "HTML",
        },
    );
});

/**
 * /capoo
 * 通过 getRandomFile()获取文件名
 * 发送对应图片
 */
bot.command("capoo", async (ctx) => {
    try {
        const randomFilePath = await getRandomFile();

        await ctx.replyWithAnimation(new InputFile(randomFilePath), {
            reply_parameters: { message_id: ctx.msg.message_id },
        });
    } catch (error) {
        await ctx.reply(
            `咖波死了呜呜呜呜\n
        死因：${error.message}\n`,
            {
                reply_parameters: { message_id: ctx.msg.message_id },
            },
        );
    }
});

/**
 *  通过/push 将信息、图片、文件发送给某个用户或群组（频道）
 *  先获取用户发送的内容
 *  然后发送给另一个用户
 */
bot.command("push", async (ctx: Context) => {
    const args = ctx.message?.text?.split(" ").slice(1);
    if (!args || args.length < 1) {
        await ctx.reply("请提供目标 chat_id。");
        return;
    }

    const [targetChatId] = args;

    // 检查消息是否包含文件、图片或文本
    if (ctx.message?.reply_to_message) {
        const replyMessage = ctx.message.reply_to_message ?? "";

        try {
            if (replyMessage.text) {
                // 发送文本消息
                await bot.api.sendMessage(targetChatId, replyMessage.text);
            } else if (replyMessage.photo) {
                // 发送图片
                const photoFileId =
                    replyMessage.photo[replyMessage.photo.length - 1].file_id;
                await bot.api.sendPhoto(targetChatId, photoFileId);
            } else if (replyMessage.document) {
                // 发送文件
                const documentFileId = replyMessage.document.file_id;
                await bot.api.sendDocument(targetChatId, documentFileId);
            } else {
                await ctx.reply("无法处理此类型的消息。");
                return;
            }
            await ctx.reply("信息已成功推送！");
        } catch (error) {
            console.error(error);
            await ctx.reply("推送失败，请检查输入信息。");
        }
    } else {
        await ctx.reply("请回复要推送的消息或文件。");
    }
});
/**
 * 获取当前聊天id
 */
bot.command("id", async (ctx: Context) => {
    const chatId = ctx.chat?.id;
    if (chatId) {
        await ctx.reply(`当前聊天的 chat_id 是: ${chatId}`);
    } else {
        await ctx.reply("无法获取 chat_id。");
    }
});

/**
 * 乱写catch为了不报错退出
 */
bot.catch(async (err) => {
    const ctx = err.ctx;
    await ctx.reply(
        `${ctx.message}`,
        {
            reply_parameters: { message_id: ctx.msg?.message_id as number },
        },
    );
});
