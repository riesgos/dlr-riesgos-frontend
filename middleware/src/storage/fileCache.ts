import * as path from 'path';
import { deleteFile, getFileAge, readJsonFile, writeJsonFile } from '../utils/fileApi';


export class FileCache {

    constructor(private dataDir: string, private maxCacheAge: number) {
    }

    public async getData(server: string, process: string, key: string) {
        const filePath = this.createFilePath(server, process, key);
        const fileAge = await getFileAge(filePath);
        if (fileAge < 0) {
            console.log(`No cache hit for file ${filePath}`);
            return null;
        } if (fileAge > this.maxCacheAge) {
            console.log(`File ${filePath} is too old (${fileAge - this.maxCacheAge} s) - deleting it.`);
            await deleteFile(filePath);
            return null;
        }
        console.log(`Cache hit: ${filePath}`);
        return readJsonFile(filePath);
    }

    public async storeData(server: string, process: string, key: string, data: any) {
        const filePath = this.createFilePath(server, process, key);
        return writeJsonFile(filePath, data);
    }

    private createFilePath(serverName: string, processName: string, key: string) {
        return path.join(this.dataDir, serverName.replace(/:/g, ''), processName.replace(/:/g, ''), key + '.json');
    }

}