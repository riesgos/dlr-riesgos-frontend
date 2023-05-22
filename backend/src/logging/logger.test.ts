import { createDirIfNotExists, deleteFile, readTextFile } from "../utils/files";
import { Logger } from "./logger";


const logDir = "./test-data/logger";

beforeAll(async () => {
    await createDirIfNotExists(logDir);
    await deleteFile(`${logDir}/log.txt`);
    await deleteFile(`${logDir}/errors.txt`);
});

afterAll(async () => {});

function externalFunction() {
    console.log("Innocent log");
}


test("Logs are written to file", async () => {

    const logger = new Logger(logDir, [])
    logger.monkeyPatch();

    externalFunction();

    const fileContents = await readTextFile(`${logDir}/log.txt`);
    expect(fileContents.includes("Innocent log"));
});