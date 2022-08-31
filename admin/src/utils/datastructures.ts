import objectHash from 'object-hash';

export class Queue<T> {
    private data: T[] = [];

    constructor() {}

    public enqueue(entry: T) {
        this.data.push(entry);
    }

    public dequeue(): T | undefined {
        const first = this.data.shift();
        return first;
    }
}


export class HashedQueue<T extends {} | null> {
    private data: {hash: string, entry: T}[] = [];

    constructor() {}

    public enqueue(entry: T) {
        const hash = objectHash(entry);
        const existingEntry = this.data.find(e => e.hash === hash);
        if (existingEntry) return;
        this.data.push({hash, entry});
    }

    public dequeue(): {hash: string, entry: T} | undefined {
        const first = this.data.shift();
        return first;
    }
}