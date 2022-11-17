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

