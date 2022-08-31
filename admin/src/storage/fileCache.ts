import objectHash from 'object-hash';
import { deleteFile, getFileAge, pathJoin, readJsonFile, readTextFile, writeJsonFile, writeTextFile } from '../utils/files';


export class FileCache {

    constructor(private dataDir: string, private maxCacheAge: number, private verbose = false) {}

    public async getData(key: string) {
        const filePath = pathJoin([this.dataDir, key + '.txt']);
        const fileAge = await getFileAge(filePath);
        if (fileAge < 0) {
            if (this.verbose) console.log(`No cache hit for file ${filePath}`);
            return null;
        } if (fileAge > this.maxCacheAge) {
            if (this.verbose) console.log(`File ${filePath} is too old (${fileAge - this.maxCacheAge} s) - deleting it.`);
            await deleteFile(filePath);
            return null;
        }
        if (this.verbose) console.log(`Cache hit: ${filePath}`);
        return readTextFile(filePath);
    }

    public async storeTextData(key: string, data: string) {
        // const key = objectHash(data); <-- better to let user decide on key
        const filePath = pathJoin([this.dataDir, key + '.txt']);
        return await writeTextFile(filePath, data);
    }

}