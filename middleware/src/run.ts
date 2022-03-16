import { FileDb } from './database/file/fileDb';
import { setUpServer } from "./server/server";

async function start() {
    const db = new FileDb('data/db.json');
    await db.init();
    const app = setUpServer(3000, db);
}

start();

