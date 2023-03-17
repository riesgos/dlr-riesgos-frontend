import objectHash from "object-hash";


export type Task = () => Promise<any>;
interface PoolEntry {
    key: string,
    data?: any,
    startedTime: Date,
    completedTime?: Date,
    failedTime?: Date,
    error?: any
}


/**
 * Serves for keeping track of ongoing tasks.
 * Stores ticket-numbers only until they're polled.
 * No caching.
 */
export class ProcessPool {

    private entries: PoolEntry[] = [];

    public scheduleTask(key: string, task: Task): { ticket: string } {
        if (this.getOngoing().find(e => e.key === key)) return { ticket: key };
        this.addNewEntry(key);
        task().then(results => {
            this.setCompleted(key, results);
        }).catch(error => {
            console.error(`An error occured while trying to execute task ${key}: `);
            console.error(error);
            this.setFailed(key, error);
        });
        return { ticket: key };
    }

    poll(ticket: string): { error: string } | { ticket: string } | { results: any } {
        this.cleanOlderThan(24*60*60, 3*24*60*60);

        const entry = this.getEntry(ticket);

        const error = entry.error;
        if (error) {
            return {
                // Error objects are not properly stringified by default.
                error: JSON.stringify(error, Object.getOwnPropertyNames(error))
            };
        }

        const data = entry.data;
        if (data) {
            return { results: data };
        }

        return { ticket: ticket };
    }

    public cleanOlderThan(maxAgeSeconds: number, abandonedAgeSeconds?: number) {
        const currentTime = new Date().getTime();
        for (const entry of this.entries) {

            if (entry.completedTime) {
                const deltaSecs = (currentTime - entry.completedTime.getTime()) / 1000;
                if (deltaSecs > maxAgeSeconds) {
                    console.log(`Cleaning entry: ${entry.key} because completed ${deltaSecs} seconds ago.`);
                    this.removeEntry(entry.key);
                }
            }

            if (entry.failedTime) {
                const deltaSecs = (currentTime - entry.failedTime.getTime()) / 1000;
                if (deltaSecs > maxAgeSeconds) {
                    console.log(`Cleaning entry: ${entry.key} because failed ${deltaSecs} seconds ago.`);
                    this.removeEntry(entry.key);
                }
            }

            // Additionally, removing entries that have been started but never finished in, say, a few days?
            if (abandonedAgeSeconds) {
                if (!entry.completedTime && !entry.failedTime) {
                    const deltaSecs = (currentTime - entry.startedTime.getTime()) / 1000;
                    if (deltaSecs > abandonedAgeSeconds) {
                        console.log(`Cleaning entry: ${entry.key} because unfinished since ${deltaSecs} seconds.`);
                        this.removeEntry(entry.key);
                    }   
                }
            }
        }
    }

    private setCompleted(key: string, data: any): PoolEntry {
        const entry = this.getEntry(key);
        entry.completedTime = new Date();
        entry.data = data;
        return entry;
    }

    private setFailed(key: string, error: any): PoolEntry {
        const entry = this.getEntry(key);
        entry.error = error;
        entry.failedTime = new Date();
        return entry;
    }

    private addNewEntry(key: string): PoolEntry {
        const entry: PoolEntry = {
            key: key,
            startedTime: new Date(),
        };
        this.entries.push(entry);
        return entry;
    }

    private removeEntry(key: string) {
        this.entries = this.entries.filter(e => e.key !== key);
    }

    private getEntry(key: string): PoolEntry {
        const entry = this.entries.find(e => e.key === key);
        if (!entry) throw new Error(`No such entry in pool: ${key}`);
        return entry;
    }

    private getOngoing(): PoolEntry[] {
        return this.entries.filter(e => !e.completedTime && !e.error);
    }

    private getFailed(): PoolEntry[] {
        return this.entries.filter(e => e.error);
    }

    private getCompleted(): PoolEntry[] {
        return this.entries.filter(e => e.completedTime);
    }
}

