import { autoRetry, Bot, Context, getRandomFile, InputFile } from "./deps.ts";
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
 * 通过 getRandomFile()随机获取文件名
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
            `错误：${error.message}\n`,
            {
                reply_parameters: { message_id: ctx.msg.message_id },
            },
        );
    }
});

/**
 *  通过/push 将信息、图片、文件发送给某个用户或群组（频道）
 *  回复某个要发送的信息
 *  输入 /push [chatId] 以发送
 */
bot.command("push", async (ctx: Context) => {
    const args = ctx.message?.text?.split(" ").slice(1);
    if (!args || args.length < 1) {
        await ctx.reply("请提供目标 chat_id，例如 /push [id]");
        return;
    }

    const targetChatId = args[0];
    const replyMessage = ctx.message?.reply_to_message;

    if (!replyMessage) {
        await ctx.reply("请回复要推送的消息或文件。");
        return;
    }

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
            await ctx.reply("回复的消息类型无法处理。");
            return;
        }

        await ctx.reply("信息已成功推送！", {
            reply_parameters: { message_id: ctx.msg?.message_id as number },
        });
    } catch (error) {
        await ctx.reply(
            `错误：${error.message}\n`,
            {
                reply_parameters: { message_id: ctx.msg?.message_id as number },
            },
        );
    }
});

/**
 * 获取当前chatId
 */
bot.command("id", async (ctx) => {
    try {
        await ctx.reply(ctx.chat.id.toString());
    } catch (error) {
        await ctx.reply(
            `错误：${error.message}\n`,
            {
                reply_parameters: { message_id: ctx.msg.message_id },
            },
        );
    }
});

/**
 * 乱写catch为了不报错退出
 */
bot.catch(async (err) => {
    const ctx = err.ctx;
    await ctx.reply(
        `${err.message}`,
        {
            reply_parameters: { message_id: ctx.msg?.message_id as number },
        },
    );
});
