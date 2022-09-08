export interface EventSubscription extends Pick<InternalEventSubscription, 'unsubscribe'> {
}
export interface EventObservable<T> extends Pick<EventSubject<T>, 'subscribe'> {
}
/**
 * Subscription returned from EventSubject.
 * Enables subscriber to un-subscribe from source.
 */
declare class InternalEventSubscription {
    fn: (value: any) => void;
    private subscriptions;
    constructor(fn: (value: any) => void, subscriptions: InternalEventSubscription[]);
    /** Use during disconnectedCallback to stop receiving events */
    unsubscribe(): void;
}
/**
 * Basic Subject implementing Observer style pattern.
 * Use to trigger and communicate outgoing async updates.
 *
 * Used as a lightweight alternative to rxjs style subject.
 * RxJS pulls in too much code for our performance standards
 * and would require additional peer dependencies for the
 * host application to take on.
 *
 * @internal
 */
export declare class EventSubject<T> {
    private subscriptions;
    /** Subscribe to receive event value updates */
    subscribe(fn: (value: T) => void): EventSubscription;
    /** Use to trigger and send an event to all active subscribers */
    emit(value: T): void;
    /** Cast Subject to Observable subtype to prevent access to `emit` */
    toEventObservable(): EventObservable<T>;
}
export {};
