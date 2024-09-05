import { Bot , InputFile} from "https://deno.land/x/grammy@v1.29.0/mod.ts";
import { autoRetry } from "https://deno.land/x/grammy_auto_retry@v2.0.2/mod.ts";
import { run } from "https://deno.land/x/grammy_runner@v2.0.3/mod.ts";
import { getRandomFile } from './Capoo.ts';






const bot = new Bot("7490814974:AAFERdZu-8CmQNmLMSagieAnbvuXgJ47AyA"); // <-- 把你的 bot token 放在 "" 之间

bot.api.config.use(autoRetry());


{
    bot.command("start", async (ctx) =>
        await ctx.reply("你好\n" +
        "现在实现的功能：\n" +
        "1.输入/capoo随机获取咖波，就一行代码（\n" +
        "2.输入/todo查看主包画的大饼\n",
            {
                // `reply_parameters` 指定实际的回复哪一条信息。
                reply_parameters: { message_id: ctx.msg.message_id },
            }));
}

bot.command("capoo", async (ctx) => {
    try {
        const randomFilePath = await getRandomFile(); // 等待异步调用

        await ctx.replyWithAnimation(new InputFile(randomFilePath), {
            // `reply_parameters` 指定实际的回复哪一条信息。
            reply_parameters: { message_id: ctx.msg.message_id },
        });
    } catch (_error) {
        // console.error('获取随机文件时出错:', error);
        await ctx.reply(`咖波死了呜呜呜呜\n`); // 错误处理
    }
});



bot.command("capoo", async (ctx) => {
    try {
        const randomFilePath = await getRandomFile(); // 等待异步调用

        await ctx.replyWithAnimation(new InputFile(randomFilePath), {
            // `reply_parameters` 指定实际的回复哪一条信息。
            reply_parameters: { message_id: ctx.msg.message_id },
        });
    } catch (error) {
        // console.error('获取随机文件时出错:', error);
        await ctx.reply(`咖波死了呜呜呜呜\n
        死因：${error.message}\n`); // 错误处理
    }
});



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


// bot.start();
run(bot);