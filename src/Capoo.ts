// 导入 Deno 内置的路径模块
import { join, extname } from 'https://deno.land/std@0.181.0/path/mod.ts';

// 定义允许的文件扩展名
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.mov', '.avi'];

// 定义文件夹路径
const folderPath = '../Capoo';  // 请将 'your-folder-path' 替换为您的主文件夹路径

// 递归函数，用于获取文件夹中的所有媒体文件
export async function getMediaFiles(dir: string): Promise<string[]> {
    let mediaFiles: string[] = [];

    // 读取目录中的所有文件和文件夹
    for await (const entry of Deno.readDir(dir)) {
        const filePath = join(dir, entry.name);
        const stat = await Deno.stat(filePath);

        if (stat.isDirectory) {
            // 如果是文件夹，递归调用
            mediaFiles = mediaFiles.concat(await getMediaFiles(filePath));
        } else {
            // 如果是文件，检查扩展名
            const ext = extname(entry.name).toLowerCase();
            if (allowedExtensions.includes(ext)) {
                mediaFiles.push(filePath);
            }
        }
    }

    return mediaFiles;
}

// 导出函数用于随机选择文件
export async function getRandomFile(): Promise<string> {
    // 获取所有媒体文件
    const mediaFiles = await getMediaFiles(folderPath);

    // 确保有文件可用
    if (mediaFiles.length === 0) {
        throw new Error('文件夹中没有图片或视频文件。');
    }

    // 随机选择一个文件
    const randomFile = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];
    return randomFile; // 返回完整路径
}
