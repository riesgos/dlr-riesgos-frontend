import { FileStorage } from './fileStorage';
import objectHash from 'object-hash';
import { deleteFile, fileExists } from '../utils/files';


const storeDir = "./test-data/store/store";

beforeAll(async () => {
    await deleteFile(storeDir);
});

afterAll(async () => {
    await deleteFile(storeDir);
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
    const cache = new FileStorage<Props>(storeDir, 60);
    
    const key = await cache.addData(requestData, requestProps);
    expect(key).toBeTruthy();

    const retrieved = await cache.getDataByKey(key);
    expect(retrieved).toBeTruthy();
    expect(retrieved).toEqual(requestData);

    const retrieved2 = await cache.getDataByProperties(requestProps);
    expect(retrieved2).toBeTruthy();
    expect(retrieved2).toEqual(requestData);

});