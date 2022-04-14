import { readFile, writeFile, unlink, stat, mkdir, appendFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';


export async function readTextFile(filePath: string) {
    const contents = await readFile(filePath, {encoding: 'utf-8', flag: 'r'});
    return contents;
}

export async function writeTextFile(filePath: string, data: string) {
    const dir = filePath.substring(0, filePath.lastIndexOf(path.sep));
    await createDirIfNotExists(dir);
    await writeFile(filePath, data);
    return true;
}

export async function appendTextFile(filePath: string, data: string) {
    const dir = filePath.substring(0, filePath.lastIndexOf(path.sep));
    await createDirIfNotExists(dir);
    await appendFile(filePath, data);
    return true;
}

export async function deleteFile(filePath: string) {
    return await unlink(filePath);
}

export async function getFileAge(filePath: string): Promise<number> {
    try {
        const statistics = await stat(filePath);
        const lastChange = statistics.ctime;
        const currentTime = new Date();
        const secondsSinceChange = (currentTime.getTime() - lastChange.getTime()) / 1000;
        return secondsSinceChange;
    } catch (e) {
        return -1;
    }
}

export async function createDirIfNotExists(dir: string) {
    if (!existsSync(dir)) {
        await mkdir(dir, {recursive: true});
    }
    return true;
}


export async function writeJsonFile(filePath: string, data: any) {
    return writeTextFile(filePath, JSON.stringify(data));
}

export async function appendJsonFile(filePath: string, data: any) {
    return appendTextFile(filePath, JSON.stringify(data));
}

export async function readJsonFile(filePath: string) {
    const content = await readTextFile(filePath);
    return JSON.parse(content);
}



