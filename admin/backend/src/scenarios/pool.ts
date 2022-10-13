import objectHash from "object-hash";


export type Task = () => Promise<any>;

export class ProcessPool {

    private ongoing: string[] = [];
    private completed: {[hash: string]: any} = {};

    public scheduleTask(key: string, task: Task): { ticket: string } {
        if (this.ongoing.includes(key)) return { ticket: key };
        this.ongoing.push(key);
        task().then(results => {
            this.ongoing = this.ongoing.filter(h => h !== key);
            this.completed[key] = results;
        });
        return { ticket: key };
    }

    poll(ticket: string): { error: string } | { ticket: string } | { results: any } {
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

