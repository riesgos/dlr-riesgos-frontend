import objectHash from 'object-hash';
import { deleteFile, fileExists, getFileLastChange, pathJoin, readJsonFile, writeJsonFile } from '../utils/files';
import { sleep } from '../utils/async';



export class FileStorage<Properties extends {}> {

    constructor(
        private filePath: string,
        private maxCacheLifetimeMinutes: number
    ) {
        // @TODO: also store props in a database.
        // This way users can query files by only parts of the props-object,
        // and they can restore properties from a hash.
    }

    public async addData(data: any, props: Properties, attempt = 0): Promise<string> {
        const hash = objectHash(props);
        const fullFilePath = pathJoin([this.filePath, hash]);
        if (fileExists(fullFilePath)) console.warn(`FileStorage: file with lineage already exists: `, props);
        const success = await writeJsonFile(fullFilePath, data);
        if (!success) {
            console.error(`Something went wrong when attempting to save file with lineage ${JSON.stringify(props)} under hash ${hash}`);
            // throw Error(`Something went wrong when attempting to save file with lineage ${JSON.stringify(props)} under hash ${hash}`);
            if (attempt < 3) {
                await sleep(100);
                await deleteFile(fullFilePath);
                await this.addData(data, props, attempt+=1);
            }
        }
        return hash;
    }

    public async getDataByKey<T>(key: string): Promise<T | undefined> {
        const fullFilePath = pathJoin([this.filePath, key]);
        try {
            const ageMinutes = (await getFileLastChange(fullFilePath)) / 60.0;
            if (ageMinutes > this.maxCacheLifetimeMinutes) {
                await deleteFile(fullFilePath);
                console.log(`Store: deleted file (too old): ${key}`);
                return undefined;
            }

            const contents = await readJsonFile(fullFilePath);
            console.log(`Store: fetched data from cache: ${key}`);
            return contents;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    public getDataByProperties<T>(props: Properties): Promise<T | undefined> {
        const hash = objectHash(props);
        return this.getDataByKey<T>(hash);
    }
}