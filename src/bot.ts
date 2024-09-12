import {autoRetry, Bot, Context, getRandomFile, InputFile} from "./deps.ts";

export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");

bot.api.config.use(autoRetry());

/**
 * 乱写catch为了不报错退出
 */
bot.catch(async (err) => {
    await bot.api.sendMessage(7248116024, `抓到一只虫：${err.message}\n在：${err.ctx.message}`);
});

/**
 * 私聊复读文本
 */
bot.chatType("private").on("message:text", async (ctx) => {
    if (!ctx.msg.text.startsWith("/")) {
        await ctx.reply(`${ctx.msg.text}`)
    }
});

/**
 * /send [chatid] "内容" 让bot发送信息
 */
bot.command("send", async (ctx: Context) => {
    const args = ctx.message?.text?.split(' ').slice(1);
    if (!args || args.length < 2) {
        await ctx.reply("请提供目标 chat_id和内容，例如：/send [chatid] 我是小猫\n你可以使用/id获取当前chatid。");
        return;
    }
    const [targetChatId, message] = args;
    try {
        await bot.api.sendMessage(targetChatId, message);
        await ctx.reply("信息已成功推送！", {
            reply_to_message_id: ctx.message?.message_id as number,
        });
    } catch (error) {
        await ctx.reply(
            `错误：${error.message}\n`,
            {
                reply_to_message_id: ctx.message?.message_id as number,
            },
        );
    }
})

/**
 * 推销github
 */
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
 * 发送随机咖波图片
 * 通过 getRandomFile()随机获取文件名
 * 发送对应图片
 *
 * 更新了文件类型检测
 */
bot.command("capoo", async (ctx) => {
    try {
        const { filePath, fileType } = await getRandomFile();

        if (fileType === ".gif") {
            await ctx.replyWithAnimation(new InputFile(filePath), {
                reply_parameters: { message_id: ctx.msg.message_id },
            });
        } else if (
            fileType === ".jpg" || fileType === ".jpeg" || fileType === ".png"
        ) {
            await ctx.replyWithPhoto(new InputFile(filePath), {
                reply_parameters: { message_id: ctx.msg.message_id },
            });
        } else if (
            fileType === ".mp4" || fileType === ".mov" || fileType === ".avi"
        ) {
            await ctx.replyWithVideo(new InputFile(filePath), {
                reply_parameters: { message_id: ctx.msg.message_id },
            });
        } else {
            await ctx.reply("咖波抓到了未知的东西！\n", {
                reply_parameters: {message_id: ctx.msg.message_id},
            });
        }
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
 *  输入 /pushto [chatid] 以发送
 */
bot.command("pushto", async (ctx: Context) => {
    const args = ctx.message?.text?.split(" ").slice(1);
    if (!args || args.length < 1) {
        await ctx.reply("请提供目标 chatid，例如 /pushto [chatid]\n你可以使用/id获取当前chatid。", {
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
