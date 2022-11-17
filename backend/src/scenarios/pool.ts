import objectHash from "object-hash";


export type Task = () => Promise<any>;


/**
 * Serves for keeping track of ongoing tasks.
 * Stores ticket-numbers only until they're polled.
 * No caching.
 */
export class ProcessPool {

    private ongoing: string[] = [];
    private completed: {[hash: string]: any} = {};
    private failed: {[hash: string]: any} = {};

    public scheduleTask(key: string, task: Task): { ticket: string } {
        if (this.ongoing.includes(key)) return { ticket: key };
        this.ongoing.push(key);
        task().then(results => {
            this.ongoing = this.ongoing.filter(h => h !== key);
            this.completed[key] = results;
        }).catch(error => {
            this.ongoing = this.ongoing.filter(h => h !== key);
            this.failed[key] = error;
        });
        return { ticket: key };
    }

    poll(ticket: string): { error: string } | { ticket: string } | { results: any } {
        const error = this.failed[ticket];
        if (error) {
            delete this.failed[ticket];
            return {
                // Error objects are not properly stringified by default.
                error: JSON.stringify(error, Object.getOwnPropertyNames(error))
            };
        }

        const data = this.completed[ticket];
        if (data) {
            delete this.completed[ticket];
            return { results: data };
        }
        if (!this.ongoing.includes(ticket)) {
            return { error: `No such ticket: ${ticket}` };
        }
        return { ticket: ticket };
    }
}

