import { HttpClient } from './http_client';


describe('HttpClient test suite', () => {
    const host = 'https://jsonplaceholder.typicode.com';
    const client = new HttpClient();

    it('GET should work', (done) => {
        client.get(`${host}/todos/1`).subscribe((results) => {
            expect(results).toBeTruthy();
            expect(JSON.parse(results).userId).toEqual(1);
            done();
        });
    })

    it('POST should work', (done) => {
        client.post(`${host}/posts`, JSON.stringify({
            title: 'foo',
            body: 'bar',
            userId: 1
        }), {
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            responseType: 'text'
        }).subscribe((results) => {
            expect(results).toBeTruthy();
            expect(JSON.parse(results).title).toEqual('foo');
            done();
        })
    });
})