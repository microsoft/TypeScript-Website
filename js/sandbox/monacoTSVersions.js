define(["require", "exports", "./releases"], function (require, exports, releases_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.latestSupportedTypeScriptVersion = exports.monacoTSVersions = void 0;
    /**
     * The versions of monaco-typescript which we can use
     * for backwards compatibility with older versions
     * of TS in the playground.
     */
    exports.monacoTSVersions = [...releases_1.supportedReleases, 'Latest'];
    /** Returns the latest TypeScript version supported by the sandbox */
    exports.latestSupportedTypeScriptVersion = Object.keys(exports.monacoTSVersions)
        .filter(key => key !== 'Nightly' && !key.includes('-'))
        .sort()
        .pop();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uYWNvVFNWZXJzaW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NhbmRib3gvc3JjL21vbmFjb1RTVmVyc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUtBOzs7O09BSUc7SUFDVSxRQUFBLGdCQUFnQixHQUEwQixDQUFDLEdBQUcsNEJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFFdkYscUVBQXFFO0lBQ3hELFFBQUEsZ0NBQWdDLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBZ0IsQ0FBQztTQUNsRixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssU0FBUyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN0RCxJQUFJLEVBQUU7U0FDTixHQUFHLEVBQUcsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHN1cHBvcnRlZFJlbGVhc2VzLCBSZWxlYXNlVmVyc2lvbnMgfSBmcm9tICcuL3JlbGVhc2VzJ1xuXG4vKiogVGhlIHZlcnNpb25zIHlvdSBjYW4gZ2V0IGZvciB0aGUgc2FuZGJveCAqL1xuZXhwb3J0IHR5cGUgU3VwcG9ydGVkVFNWZXJzaW9ucyA9IFJlbGVhc2VWZXJzaW9ucyB8ICdMYXRlc3QnXG5cbi8qKlxuICogVGhlIHZlcnNpb25zIG9mIG1vbmFjby10eXBlc2NyaXB0IHdoaWNoIHdlIGNhbiB1c2VcbiAqIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIG9sZGVyIHZlcnNpb25zXG4gKiBvZiBUUyBpbiB0aGUgcGxheWdyb3VuZC5cbiAqL1xuZXhwb3J0IGNvbnN0IG1vbmFjb1RTVmVyc2lvbnM6IFN1cHBvcnRlZFRTVmVyc2lvbnNbXSA9IFsuLi5zdXBwb3J0ZWRSZWxlYXNlcywgJ0xhdGVzdCddXG5cbi8qKiBSZXR1cm5zIHRoZSBsYXRlc3QgVHlwZVNjcmlwdCB2ZXJzaW9uIHN1cHBvcnRlZCBieSB0aGUgc2FuZGJveCAqL1xuZXhwb3J0IGNvbnN0IGxhdGVzdFN1cHBvcnRlZFR5cGVTY3JpcHRWZXJzaW9uOiBzdHJpbmcgPSBPYmplY3Qua2V5cyhtb25hY29UU1ZlcnNpb25zKVxuICAuZmlsdGVyKGtleSA9PiBrZXkgIT09ICdOaWdodGx5JyAmJiAha2V5LmluY2x1ZGVzKCctJykpXG4gIC5zb3J0KClcbiAgLnBvcCgpIVxuIl19