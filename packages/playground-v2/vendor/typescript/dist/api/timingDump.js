import { nodeProcess } from "./nodeProcess.js";
import { combineTimingInfo, } from "./timing.js";
/** One final snapshot per client, written before its connection is closed. */
export class TimingDump {
    instanceId = nodeProcess().getBuiltinModule("node:crypto").randomUUID();
    startedAt = new Date().toISOString();
    directory;
    mode;
    transport;
    static fromEnvironment(mode, transport) {
        const process = nodeProcess();
        const directory = process.env.TS_API_TIMING_DIR;
        return directory ? new TimingDump(process.getBuiltinModule("node:path").resolve(directory), mode, transport) : undefined;
    }
    constructor(directory, mode, transport) {
        this.directory = directory;
        this.mode = mode;
        this.transport = transport;
    }
    write(client, server, serverTimingError) {
        const process = nodeProcess();
        const { mkdirSync, writeFileSync } = process.getBuiltinModule("node:fs");
        const { join } = process.getBuiltinModule("node:path");
        const snapshot = {
            schemaVersion: 1,
            instanceId: this.instanceId,
            pid: process.pid,
            mode: this.mode,
            transport: this.transport,
            startedAt: this.startedAt,
            closedAt: new Date().toISOString(),
            timing: server ? combineTimingInfo(client, server) : client,
            serverTiming: server ?? null,
            serverTimingError,
        };
        mkdirSync(this.directory, { recursive: true });
        writeFileSync(join(this.directory, `timing-${process.pid}-${this.instanceId}.json`), JSON.stringify(snapshot) + "\n", { flag: "wx" });
    }
}
//# sourceMappingURL=timingDump.js.map