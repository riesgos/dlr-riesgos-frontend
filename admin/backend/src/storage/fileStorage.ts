import objectHash from 'object-hash';
import { pathJoin, readJsonFile, writeJsonFile } from '../utils/files';



export class FileStorage<Properties extends {}> {

    constructor(private filePath: string) {
        // @TODO: also store props in a database.
        // This way users can query files by only parts of the props-object,
        // and they can restore properties from a hash.
    }

    public async addData(data: any, props: Properties): Promise<string> {
        const hash = objectHash(props);
        const fullFilePath = pathJoin([this.filePath, hash]);
        const success = await writeJsonFile(fullFilePath, data);
        return hash;
    }

    public async getDataByKey<T>(key: string): Promise<T | undefined> {
        const fullFilePath = pathJoin([this.filePath, key]);
        try {
            const contents = await readJsonFile(fullFilePath);
            return contents;
        } catch (error) {
            return undefined;
        }
    }

    public getDataByProperties<T>(props: Properties): Promise<T | undefined> {
        const hash = objectHash(props);
        return this.getDataByKey<T>(hash);
    }
}