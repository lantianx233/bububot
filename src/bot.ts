import {Bot, InputFile} from "https://deno.land/x/grammy@v1.29.0/mod.ts";
import { autoRetry } from "https://deno.land/x/grammy_auto_retry@v2.0.2/mod.ts";
import { getRandomFile } from './getCapoo.ts';

export const bot = new Bot(Deno.env.get("BOT_TOKEN") || "");
bot.api.config.use(autoRetry());

//start命令
    bot.command("start", async (ctx) =>
        await ctx.reply("放到github上了\n" +
            "https://github.com/lantianx233/bububot\n" +
            "欢迎搞破坏🐳\n",
            {
                // `reply_parameters` 指定实际的回复哪一条信息。
                reply_parameters: { message_id: ctx.msg.message_id },
            }));

//随机获取Capoo图片
bot.command("capoo", async (ctx) => {
    try {
        const randomFilePath = await getRandomFile();

        await ctx.replyWithAnimation(new InputFile(randomFilePath), {
            reply_parameters: { message_id: ctx.msg.message_id },
        });
    } catch (error) {
        // console.error('获取随机文件时出错:', error);
        await ctx.reply(`咖波死了呜呜呜呜\n
        死因：${error.message}\n`,
            {
            reply_parameters: { message_id: ctx.msg.message_id },
        });
    }
});


//捕捉错误信息 防止报错退出
bot.catch((err) => {
    console.error('Error occurred:', err);
    err.ctx.reply(`An error occurred: ${err.message}`).then(() => {
        // 这里可以继续处理回复成功后的逻辑
        console.log('Error message sent successfully.');
    }).catch(err => {
        // 处理发送消息时可能发生的错误
        console.error('Failed to send error message:', err);
    });
});