import {Bot, InputFile} from "https://deno.land/x/grammy@v1.29.0/mod.ts";
import { autoRetry } from "https://deno.land/x/grammy_auto_retry@v2.0.2/mod.ts";
import { serve } from "https://deno.land/x/oak@v16.1.0/mod.ts";
import { getRandomFile } from './Capoo.ts';





const bot = new Bot("7490814974:AAFERdZu-8CmQNmLMSagieAnbvuXgJ47AyA"); // <-- 把你的 bot token 放在 "" 之间


bot.api.config.use(autoRetry());


//start命令
    bot.command("start", async (ctx) =>
        await ctx.reply("你好\n" +
        "现在实现的功能：\n" +
        "1.输入/capoo随机获取咖波，就一行代码（\n" +
        "2.输入/todo查看主包画的大饼\n",
            {
                // `reply_parameters` 指定实际的回复哪一条信息。
                reply_parameters: { message_id: ctx.msg.message_id },
            }));

//随机获取Capoo图片
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


//大饼
bot.command("todo", async (ctx) => {
    const messageText =
        "//TODO 给bot搞个头像\n" +
        "//TODO 搞个服务器部署\n" +
        "大饼制作中...\n";
    await ctx.reply(messageText,{
        // `reply_parameters` 指定实际的回复哪一条信息。
        reply_parameters: { message_id: ctx.msg.message_id },
    })
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



// 使用 webhook 模式
serve(async (req) => {
    if (req.method === "POST") {
        const update = await req.json();
        await bot.handleUpdate(update); // 处理更新
        return new Response("OK", { status: 200 });
    }
    return new Response("Not Found", { status: 404 });
});

// 设置 webhook
const WEBHOOK_URL = "https://bububot.deno.dev/";
await bot.api.setWebhook(WEBHOOK_URL);



// bot.start(); //长轮询启动bot
