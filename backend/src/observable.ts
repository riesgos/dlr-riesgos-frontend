interface Observer<T> {
    onNext: (val: T) => void,
    onCompleted: () => void,
    onError: (e: Error) => void
}

const nullObserver: Observer<any> = {
    onNext: (val: any) => {},
    onCompleted: () => {},
    onError: (val: any) => {}
}

interface Subscription {
    unsubscribe: () => void;
}

class SimpleSubscription<T> implements Subscription {
    constructor(private observer: Observer<T>) {}
    unsubscribe() {
        this.observer = nullObserver;
    }
}

class Observable<T> {
    constructor(
        private _onSubscribe: (observer: Observer<T>) => Subscription
    ) {}

    subscribe(downstreamObserver: Observer<T>): Subscription {
        return this._onSubscribe(downstreamObserver);
    }

    static of<X>(args: X[]): Observable<X> {
        const obs = new Observable<X>((downstreamObserver: Observer<X>) => {
            console.log(`executing subscription body (in 'of' method)`);
            args.map(arg => downstreamObserver.onNext(arg));
            downstreamObserver.onCompleted();
            return new SimpleSubscription(downstreamObserver);
        });
        return obs;
    }

    public map<Y>(mapFunc: (v: T) => Y): Observable<Y> {
        const obs = new Observable<Y>((downstreamObserver: Observer<Y>) => {
            console.log(`executing subscription body (in 'map' method)`);
            const mappingObserver: Observer<T> = {
                onNext: (v: T) => {
                    const y: Y = mapFunc(v);
                    downstreamObserver.onNext(y);
                },
                onCompleted: () => downstreamObserver.onCompleted(),
                onError: (e) => downstreamObserver.onError(e)
            };
            return this.subscribe(mappingObserver);
        });
        return obs;
    }
}


const source = Observable.of([1, 2, 3, 4, 5]);

const trans = source.map(v => v % 2);

const sink = trans.subscribe({
    onNext: (val) => console.log(val),
    onCompleted: () => {},
    onError: (e) => {}
})