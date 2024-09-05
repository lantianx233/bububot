import { Bot } from "https://deno.land/x/grammy@v1.29.0/mod.ts";

const bot = new Bot(Deno.env.get("7490814974:AAFERdZu-8CmQNmLMSagieAnbvuXgJ47AyA")!);



// 设置 webhook
const WEBHOOK_URL = "https://bububot.deno.dev/";
await bot.api.setWebhook(WEBHOOK_URL);