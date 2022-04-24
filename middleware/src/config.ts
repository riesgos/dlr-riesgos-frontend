import path from 'path';

export const config = {
    port: 8008,
    useCache: false,
    siteAdmins: [
        'michael.langbein@dlr.de'
    ],
    sourceEmail: 'errormessages@riesgos.com',
    storeRequestBody: true,
    cacheDir: path.join(__dirname, '..', 'data'),
    tempDir: path.join(__dirname, '..', 'data/tmp'),
};