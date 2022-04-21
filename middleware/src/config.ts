import path from 'path';

export const config = {
    port: 8008,
    siteAdmins: [
        'michael.langbein@dlr.de'
    ],
    storeRequestBody: true,
    cacheDir: path.join(__dirname, '..', 'data'),
    tempDir: path.join(__dirname, '..', 'data/tmp'),
};