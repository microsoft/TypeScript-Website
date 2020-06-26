var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./showDTS", "./showJS", "./showErrors", "./plugins", "./ast", "./runtime"], function (require, exports, showDTS_1, showJS_1, showErrors_1, plugins_1, ast_1, runtime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.settingsPlugin = exports.getPlaygroundPlugins = void 0;
    exports.getPlaygroundPlugins = () => {
        const defaults = [];
        if (!localStorage.getItem("disable-sidebar-js"))
            defaults.push(showJS_1.compiledJSPlugin);
        if (!localStorage.getItem("disable-sidebar-dts"))
            defaults.push(showDTS_1.showDTSPlugin);
        if (!localStorage.getItem("disable-sidebar-err"))
            defaults.push(showErrors_1.showErrors);
        if (!localStorage.getItem("disable-sidebar-run"))
            defaults.push(runtime_1.runPlugin);
        if (!localStorage.getItem("disable-sidebar-plugins"))
            defaults.push(plugins_1.optionsPlugin);
        // Sidebar items which are more dev/introspection focused
        if (localStorage.getItem("enable-sidebar-ast"))
            defaults.push(ast_1.showASTPlugin);
        // Don't let it ever be zero, this is mostly laziness on my part but every
        // possible UI state needs to be considered across so many other states
        // and reducing the matrix is worth it
        if (defaults.length === 0)
            defaults.push(showJS_1.compiledJSPlugin);
        return defaults;
    };
    exports.settingsPlugin = (i, utils) => {
        const settings = [
            {
                display: i("play_sidebar_options_disable_ata"),
                blurb: i("play_sidebar_options_disable_ata_copy"),
                flag: "disable-ata",
            },
            {
                display: i("play_sidebar_options_disable_save"),
                blurb: i("play_sidebar_options_disable_save_copy"),
                flag: "disable-save-on-type",
            },
        ];
        const uiPlugins = [
            {
                display: i("play_sidebar_js_title"),
                blurb: i("play_sidebar_js_blurb"),
                flag: "disable-sidebar-js",
                emptyImpliesEnabled: true,
            },
            {
                display: i("play_sidebar_dts_title"),
                blurb: i("play_sidebar_dts_blurb"),
                flag: "disable-sidebar-dts",
                emptyImpliesEnabled: true,
            },
            {
                display: i("play_sidebar_err_title"),
                blurb: i("play_sidebar_err_blurb"),
                flag: "disable-sidebar-err",
                emptyImpliesEnabled: true,
            },
            {
                display: i("play_sidebar_run_title"),
                blurb: i("play_sidebar_run_blurb"),
                flag: "disable-sidebar-run",
                emptyImpliesEnabled: true,
            },
            {
                display: i("play_sidebar_plugins_title"),
                blurb: i("play_sidebar_plugins_blurb"),
                flag: "disable-sidebar-plugins",
                emptyImpliesEnabled: true,
            },
            {
                display: i("play_sidebar_ast_title"),
                blurb: i("play_sidebar_ast_blurb"),
                flag: "enable-sidebar-ast",
            },
        ];
        const plugin = {
            id: "settings",
            displayName: i("play_subnav_settings"),
            didMount: (sandbox, container) => __awaiter(void 0, void 0, void 0, function* () {
                const ds = utils.createDesignSystem(container);
                ds.subtitle(i("play_subnav_settings"));
                ds.showOptionList(settings, { style: "separated", requireRestart: true });
                ds.subtitle(i("play_settings_tabs_settings"));
                ds.showOptionList(uiPlugins, { style: "separated", requireRestart: true });
            }),
        };
        return plugin;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wbGF5Z3JvdW5kL3NyYy9zaWRlYmFyL3NldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFTYSxRQUFBLG9CQUFvQixHQUFHLEdBQW9CLEVBQUU7UUFDeEQsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFBO1FBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyx5QkFBZ0IsQ0FBQyxDQUFBO1FBQ2hGLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyx1QkFBYSxDQUFDLENBQUE7UUFDOUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQUM7WUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLHVCQUFVLENBQUMsQ0FBQTtRQUMzRSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQztZQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQVMsQ0FBQyxDQUFBO1FBQzFFLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLHlCQUF5QixDQUFDO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyx1QkFBYSxDQUFDLENBQUE7UUFFbEYseURBQXlEO1FBQ3pELElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztZQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsbUJBQWEsQ0FBQyxDQUFBO1FBRTVFLDBFQUEwRTtRQUMxRSx1RUFBdUU7UUFDdkUsc0NBQXNDO1FBQ3RDLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyx5QkFBZ0IsQ0FBQyxDQUFBO1FBRTFELE9BQU8sUUFBUSxDQUFBO0lBQ2pCLENBQUMsQ0FBQTtJQUVZLFFBQUEsY0FBYyxHQUFrQixDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtRQUN4RCxNQUFNLFFBQVEsR0FBeUI7WUFDckM7Z0JBQ0UsT0FBTyxFQUFFLENBQUMsQ0FBQyxrQ0FBa0MsQ0FBQztnQkFDOUMsS0FBSyxFQUFFLENBQUMsQ0FBQyx1Q0FBdUMsQ0FBQztnQkFDakQsSUFBSSxFQUFFLGFBQWE7YUFDcEI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLG1DQUFtQyxDQUFDO2dCQUMvQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLHdDQUF3QyxDQUFDO2dCQUNsRCxJQUFJLEVBQUUsc0JBQXNCO2FBQzdCO1NBTUYsQ0FBQTtRQUVELE1BQU0sU0FBUyxHQUF5QjtZQUN0QztnQkFDRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixDQUFDO2dCQUNuQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLHVCQUF1QixDQUFDO2dCQUNqQyxJQUFJLEVBQUUsb0JBQW9CO2dCQUMxQixtQkFBbUIsRUFBRSxJQUFJO2FBQzFCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQztnQkFDcEMsS0FBSyxFQUFFLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQztnQkFDbEMsSUFBSSxFQUFFLHFCQUFxQjtnQkFDM0IsbUJBQW1CLEVBQUUsSUFBSTthQUMxQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDLENBQUMsd0JBQXdCLENBQUM7Z0JBQ3BDLEtBQUssRUFBRSxDQUFDLENBQUMsd0JBQXdCLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxxQkFBcUI7Z0JBQzNCLG1CQUFtQixFQUFFLElBQUk7YUFDMUI7WUFDRDtnQkFDRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixDQUFDO2dCQUNwQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLHdCQUF3QixDQUFDO2dCQUNsQyxJQUFJLEVBQUUscUJBQXFCO2dCQUMzQixtQkFBbUIsRUFBRSxJQUFJO2FBQzFCO1lBQ0Q7Z0JBQ0UsT0FBTyxFQUFFLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQztnQkFDeEMsS0FBSyxFQUFFLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQztnQkFDdEMsSUFBSSxFQUFFLHlCQUF5QjtnQkFDL0IsbUJBQW1CLEVBQUUsSUFBSTthQUMxQjtZQUNEO2dCQUNFLE9BQU8sRUFBRSxDQUFDLENBQUMsd0JBQXdCLENBQUM7Z0JBQ3BDLEtBQUssRUFBRSxDQUFDLENBQUMsd0JBQXdCLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxvQkFBb0I7YUFDM0I7U0FDRixDQUFBO1FBRUQsTUFBTSxNQUFNLEdBQXFCO1lBQy9CLEVBQUUsRUFBRSxVQUFVO1lBQ2QsV0FBVyxFQUFFLENBQUMsQ0FBQyxzQkFBc0IsQ0FBQztZQUN0QyxRQUFRLEVBQUUsQ0FBTyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUU7Z0JBQ3JDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFFOUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFBO2dCQUN0QyxFQUFFLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7Z0JBRXpFLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQTtnQkFDN0MsRUFBRSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1lBQzVFLENBQUMsQ0FBQTtTQUNGLENBQUE7UUFFRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBsYXlncm91bmRQbHVnaW4sIFBsdWdpbkZhY3RvcnkgfSBmcm9tIFwiLi5cIlxuaW1wb3J0IHsgc2hvd0RUU1BsdWdpbiB9IGZyb20gXCIuL3Nob3dEVFNcIlxuaW1wb3J0IHsgY29tcGlsZWRKU1BsdWdpbiB9IGZyb20gXCIuL3Nob3dKU1wiXG5pbXBvcnQgeyBzaG93RXJyb3JzIH0gZnJvbSBcIi4vc2hvd0Vycm9yc1wiXG5pbXBvcnQgeyBvcHRpb25zUGx1Z2luIH0gZnJvbSBcIi4vcGx1Z2luc1wiXG5pbXBvcnQgeyBzaG93QVNUUGx1Z2luIH0gZnJvbSBcIi4vYXN0XCJcbmltcG9ydCB7IHJ1blBsdWdpbiB9IGZyb20gXCIuL3J1bnRpbWVcIlxuaW1wb3J0IHsgTG9jYWxTdG9yYWdlT3B0aW9uIH0gZnJvbSBcIi4uL2RzL2NyZWF0ZURlc2lnblN5c3RlbVwiXG5cbmV4cG9ydCBjb25zdCBnZXRQbGF5Z3JvdW5kUGx1Z2lucyA9ICgpOiBQbHVnaW5GYWN0b3J5W10gPT4ge1xuICBjb25zdCBkZWZhdWx0cyA9IFtdXG4gIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJkaXNhYmxlLXNpZGViYXItanNcIikpIGRlZmF1bHRzLnB1c2goY29tcGlsZWRKU1BsdWdpbilcbiAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRpc2FibGUtc2lkZWJhci1kdHNcIikpIGRlZmF1bHRzLnB1c2goc2hvd0RUU1BsdWdpbilcbiAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRpc2FibGUtc2lkZWJhci1lcnJcIikpIGRlZmF1bHRzLnB1c2goc2hvd0Vycm9ycylcbiAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcImRpc2FibGUtc2lkZWJhci1ydW5cIikpIGRlZmF1bHRzLnB1c2gocnVuUGx1Z2luKVxuICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZGlzYWJsZS1zaWRlYmFyLXBsdWdpbnNcIikpIGRlZmF1bHRzLnB1c2gob3B0aW9uc1BsdWdpbilcblxuICAvLyBTaWRlYmFyIGl0ZW1zIHdoaWNoIGFyZSBtb3JlIGRldi9pbnRyb3NwZWN0aW9uIGZvY3VzZWRcbiAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZW5hYmxlLXNpZGViYXItYXN0XCIpKSBkZWZhdWx0cy5wdXNoKHNob3dBU1RQbHVnaW4pXG5cbiAgLy8gRG9uJ3QgbGV0IGl0IGV2ZXIgYmUgemVybywgdGhpcyBpcyBtb3N0bHkgbGF6aW5lc3Mgb24gbXkgcGFydCBidXQgZXZlcnlcbiAgLy8gcG9zc2libGUgVUkgc3RhdGUgbmVlZHMgdG8gYmUgY29uc2lkZXJlZCBhY3Jvc3Mgc28gbWFueSBvdGhlciBzdGF0ZXNcbiAgLy8gYW5kIHJlZHVjaW5nIHRoZSBtYXRyaXggaXMgd29ydGggaXRcbiAgaWYgKGRlZmF1bHRzLmxlbmd0aCA9PT0gMCkgZGVmYXVsdHMucHVzaChjb21waWxlZEpTUGx1Z2luKVxuXG4gIHJldHVybiBkZWZhdWx0c1xufVxuXG5leHBvcnQgY29uc3Qgc2V0dGluZ3NQbHVnaW46IFBsdWdpbkZhY3RvcnkgPSAoaSwgdXRpbHMpID0+IHtcbiAgY29uc3Qgc2V0dGluZ3M6IExvY2FsU3RvcmFnZU9wdGlvbltdID0gW1xuICAgIHtcbiAgICAgIGRpc3BsYXk6IGkoXCJwbGF5X3NpZGViYXJfb3B0aW9uc19kaXNhYmxlX2F0YVwiKSxcbiAgICAgIGJsdXJiOiBpKFwicGxheV9zaWRlYmFyX29wdGlvbnNfZGlzYWJsZV9hdGFfY29weVwiKSxcbiAgICAgIGZsYWc6IFwiZGlzYWJsZS1hdGFcIixcbiAgICB9LFxuICAgIHtcbiAgICAgIGRpc3BsYXk6IGkoXCJwbGF5X3NpZGViYXJfb3B0aW9uc19kaXNhYmxlX3NhdmVcIiksXG4gICAgICBibHVyYjogaShcInBsYXlfc2lkZWJhcl9vcHRpb25zX2Rpc2FibGVfc2F2ZV9jb3B5XCIpLFxuICAgICAgZmxhZzogXCJkaXNhYmxlLXNhdmUtb24tdHlwZVwiLFxuICAgIH0sXG4gICAgLy8ge1xuICAgIC8vICAgZGlzcGxheTogJ1ZlcmJvc2UgTG9nZ2luZycsXG4gICAgLy8gICBibHVyYjogJ1R1cm4gb24gc3VwZXJmbHVvdXMgbG9nZ2luZycsXG4gICAgLy8gICBmbGFnOiAnZW5hYmxlLXN1cGVyZmx1b3VzLWxvZ2dpbmcnLFxuICAgIC8vIH0sXG4gIF1cblxuICBjb25zdCB1aVBsdWdpbnM6IExvY2FsU3RvcmFnZU9wdGlvbltdID0gW1xuICAgIHtcbiAgICAgIGRpc3BsYXk6IGkoXCJwbGF5X3NpZGViYXJfanNfdGl0bGVcIiksXG4gICAgICBibHVyYjogaShcInBsYXlfc2lkZWJhcl9qc19ibHVyYlwiKSxcbiAgICAgIGZsYWc6IFwiZGlzYWJsZS1zaWRlYmFyLWpzXCIsXG4gICAgICBlbXB0eUltcGxpZXNFbmFibGVkOiB0cnVlLFxuICAgIH0sXG4gICAge1xuICAgICAgZGlzcGxheTogaShcInBsYXlfc2lkZWJhcl9kdHNfdGl0bGVcIiksXG4gICAgICBibHVyYjogaShcInBsYXlfc2lkZWJhcl9kdHNfYmx1cmJcIiksXG4gICAgICBmbGFnOiBcImRpc2FibGUtc2lkZWJhci1kdHNcIixcbiAgICAgIGVtcHR5SW1wbGllc0VuYWJsZWQ6IHRydWUsXG4gICAgfSxcbiAgICB7XG4gICAgICBkaXNwbGF5OiBpKFwicGxheV9zaWRlYmFyX2Vycl90aXRsZVwiKSxcbiAgICAgIGJsdXJiOiBpKFwicGxheV9zaWRlYmFyX2Vycl9ibHVyYlwiKSxcbiAgICAgIGZsYWc6IFwiZGlzYWJsZS1zaWRlYmFyLWVyclwiLFxuICAgICAgZW1wdHlJbXBsaWVzRW5hYmxlZDogdHJ1ZSxcbiAgICB9LFxuICAgIHtcbiAgICAgIGRpc3BsYXk6IGkoXCJwbGF5X3NpZGViYXJfcnVuX3RpdGxlXCIpLFxuICAgICAgYmx1cmI6IGkoXCJwbGF5X3NpZGViYXJfcnVuX2JsdXJiXCIpLFxuICAgICAgZmxhZzogXCJkaXNhYmxlLXNpZGViYXItcnVuXCIsXG4gICAgICBlbXB0eUltcGxpZXNFbmFibGVkOiB0cnVlLFxuICAgIH0sXG4gICAge1xuICAgICAgZGlzcGxheTogaShcInBsYXlfc2lkZWJhcl9wbHVnaW5zX3RpdGxlXCIpLFxuICAgICAgYmx1cmI6IGkoXCJwbGF5X3NpZGViYXJfcGx1Z2luc19ibHVyYlwiKSxcbiAgICAgIGZsYWc6IFwiZGlzYWJsZS1zaWRlYmFyLXBsdWdpbnNcIixcbiAgICAgIGVtcHR5SW1wbGllc0VuYWJsZWQ6IHRydWUsXG4gICAgfSxcbiAgICB7XG4gICAgICBkaXNwbGF5OiBpKFwicGxheV9zaWRlYmFyX2FzdF90aXRsZVwiKSxcbiAgICAgIGJsdXJiOiBpKFwicGxheV9zaWRlYmFyX2FzdF9ibHVyYlwiKSxcbiAgICAgIGZsYWc6IFwiZW5hYmxlLXNpZGViYXItYXN0XCIsXG4gICAgfSxcbiAgXVxuXG4gIGNvbnN0IHBsdWdpbjogUGxheWdyb3VuZFBsdWdpbiA9IHtcbiAgICBpZDogXCJzZXR0aW5nc1wiLFxuICAgIGRpc3BsYXlOYW1lOiBpKFwicGxheV9zdWJuYXZfc2V0dGluZ3NcIiksXG4gICAgZGlkTW91bnQ6IGFzeW5jIChzYW5kYm94LCBjb250YWluZXIpID0+IHtcbiAgICAgIGNvbnN0IGRzID0gdXRpbHMuY3JlYXRlRGVzaWduU3lzdGVtKGNvbnRhaW5lcilcblxuICAgICAgZHMuc3VidGl0bGUoaShcInBsYXlfc3VibmF2X3NldHRpbmdzXCIpKVxuICAgICAgZHMuc2hvd09wdGlvbkxpc3Qoc2V0dGluZ3MsIHsgc3R5bGU6IFwic2VwYXJhdGVkXCIsIHJlcXVpcmVSZXN0YXJ0OiB0cnVlIH0pXG5cbiAgICAgIGRzLnN1YnRpdGxlKGkoXCJwbGF5X3NldHRpbmdzX3RhYnNfc2V0dGluZ3NcIikpXG4gICAgICBkcy5zaG93T3B0aW9uTGlzdCh1aVBsdWdpbnMsIHsgc3R5bGU6IFwic2VwYXJhdGVkXCIsIHJlcXVpcmVSZXN0YXJ0OiB0cnVlIH0pXG4gICAgfSxcbiAgfVxuXG4gIHJldHVybiBwbHVnaW5cbn1cbiJdfQ==