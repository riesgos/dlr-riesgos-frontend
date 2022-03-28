import * as path from 'path';
import { deleteFile, getFileAge, readJsonFile, writeJsonFile } from '../utils/fileApi';


export class FileCache {

    constructor(private dataDir: string, private maxCacheAge: number) {
    }

    public async getData(server: string, process: string, key: string) {
        const filePath = path.join(this.dataDir, server.replace(':', ''), process.replace(':', ''), key + '.json');
        const fileAge = await getFileAge(filePath);
        if (fileAge < 0) {
            console.log(`No cache hit for file ${filePath}`)
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
        const filePath = path.join(this.dataDir, server.replace(':', ''), process.replace(':', ''), key + '.json');
        return writeJsonFile(filePath, data);
    }

    

}