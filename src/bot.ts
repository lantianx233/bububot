import { autoRetry, Bot, Context, getRandomFile, InputFile } from "./deps.ts";
export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");

bot.api.config.use(autoRetry());

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
 *  通过/pushto 将信息、图片、文件发送给某个用户或群组（频道）
 *  回复某个要发送的信息
 *  输入 /pushto [chatId] 以发送
 */
bot.command("pushto", async (ctx: Context) => {
    const args = ctx.message?.text?.split(" ").slice(1);
    if (!args || args.length < 1) {
        await ctx.reply("请提供目标 chat_id，例如 /pushto [id]", {
            reply_to_message_id: ctx.message?.message_id as number,
        });
        return;
    }

    const targetChatId = args[0];
    const replyMessage = ctx.message?.reply_to_message;

    if (!replyMessage) {
        await ctx.reply("请回复要推送的消息或文件。", {
            reply_to_message_id: ctx.message?.message_id as number,
        });
        return;
    }

    try {
        await bot.api.forwardMessage(
            targetChatId,
            replyMessage.chat.id,
            replyMessage.message_id,
        );

        await ctx.reply("信息已成功推送！", {
            reply_to_message_id: ctx.message?.message_id as number,
        });
    } catch (error) {
        await ctx.reply(`错误：${error.message}`, {
            reply_to_message_id: ctx.message?.message_id as number,
        });
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


