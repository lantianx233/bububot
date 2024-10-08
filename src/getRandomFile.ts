import { extname, join } from "./deps.ts";

const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".mp4",
    ".mov",
    ".avi",
];

const folderPath = `${Deno.cwd()}/Capoo`;

export async function getMediaFiles(dir: string): Promise<string[]> {
    let mediaFiles: string[] = [];

    for await (const entry of Deno.readDir(dir)) {
        const filePath = join(dir, entry.name);
        const stat = await Deno.stat(filePath);

        if (stat.isDirectory) {
            mediaFiles = mediaFiles.concat(await getMediaFiles(filePath));
        } else {
            const ext = extname(entry.name).toLowerCase();
            if (allowedExtensions.includes(ext)) {
                mediaFiles.push(filePath);
            }
        }
    }

    return mediaFiles;
}

export async function getRandomFile(): Promise<{ filePath: string, fileType: string }> {
    const mediaFiles = await getMediaFiles(folderPath);

    if (mediaFiles.length === 0) {
        throw new Error("文件夹中没有图片或视频文件。");
    }

    const randomFilePath = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];

    // 获取文件扩展名并转换为小写
    const fileType = extname(randomFilePath).toLowerCase();

    return { filePath: randomFilePath, fileType };
}
