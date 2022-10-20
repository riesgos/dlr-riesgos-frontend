import { FileStorage } from './fileStorage';
import objectHash from 'object-hash';
import { deleteFile, fileExists } from '../utils/files';


const cacheDir = "./test-data/cache/cache";

beforeAll(async () => {
    await deleteFile(cacheDir);
});

afterAll(async () => {
    await deleteFile(cacheDir);
});



interface Props {
    id: string,
    inputs: string[]
}

const requestData = {
    value: 'someData'
};

const requestProps: Props = {
    id: 'someDatum',
    inputs: ['someInput']
}

test('testing cache', async () => {
    const cache = new FileStorage<Props>(cacheDir);
    
    const key = await cache.addData(requestData, requestProps);
    expect(key).toBeTruthy();

    const retrieved = await cache.getDataByKey(key);
    expect(retrieved).toBeTruthy();
    expect(retrieved).toEqual(requestData);

    const retrieved2 = await cache.getDataByProperties(requestProps);
    expect(retrieved2).toBeTruthy();
    expect(retrieved2).toEqual(requestData);

});