import { type ServerTimingInfo, type TimingInfo } from "./timing.ts";
/** One final snapshot per client, written before its connection is closed. */
export declare class TimingDump {
    private readonly instanceId;
    private readonly startedAt;
    private readonly directory;
    private readonly mode;
    private readonly transport;
    static fromEnvironment(mode: "sync" | "async", transport: "spawn" | "socket"): TimingDump | undefined;
    private constructor();
    write(client: TimingInfo, server: ServerTimingInfo | undefined, serverTimingError?: string): void;
}
//# sourceMappingURL=timingDump.d.ts.map