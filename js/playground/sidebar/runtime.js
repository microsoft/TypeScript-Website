define(["require", "exports", "../localizeWithFallback"], function (require, exports, localizeWithFallback_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runWithCustomLogs = exports.runPlugin = void 0;
    let allLogs = "";
    exports.runPlugin = (i, utils) => {
        const plugin = {
            id: "logs",
            displayName: i("play_sidebar_logs"),
            willMount: (sandbox, container) => {
                if (allLogs.length === 0) {
                    const noErrorsMessage = document.createElement("div");
                    noErrorsMessage.id = "empty-message-container";
                    container.appendChild(noErrorsMessage);
                    const message = document.createElement("div");
                    message.textContent = localizeWithFallback_1.localize("play_sidebar_logs_no_logs", "No logs");
                    message.classList.add("empty-plugin-message");
                    noErrorsMessage.appendChild(message);
                }
                const errorUL = document.createElement("div");
                errorUL.id = "log-container";
                container.appendChild(errorUL);
                const logs = document.createElement("div");
                logs.id = "log";
                logs.innerHTML = allLogs;
                errorUL.appendChild(logs);
            },
        };
        return plugin;
    };
    exports.runWithCustomLogs = (closure, i) => {
        const noLogs = document.getElementById("empty-message-container");
        if (noLogs) {
            noLogs.style.display = "none";
        }
        rewireLoggingToElement(() => document.getElementById("log"), () => document.getElementById("log-container"), closure, true, i);
    };
    // Thanks SO: https://stackoverflow.com/questions/20256760/javascript-console-log-to-html/35449256#35449256
    function rewireLoggingToElement(eleLocator, eleOverflowLocator, closure, autoScroll, i) {
        fixLoggingFunc("log", "LOG");
        fixLoggingFunc("debug", "DBG");
        fixLoggingFunc("warn", "WRN");
        fixLoggingFunc("error", "ERR");
        fixLoggingFunc("info", "INF");
        closure.then(js => {
            try {
                eval(js);
            }
            catch (error) {
                console.error(i("play_run_js_fail"));
                console.error(error);
            }
            allLogs = allLogs + "<hr />";
            undoLoggingFunc("log");
            undoLoggingFunc("debug");
            undoLoggingFunc("warn");
            undoLoggingFunc("error");
            undoLoggingFunc("info");
        });
        function undoLoggingFunc(name) {
            // @ts-ignore
            console[name] = console["old" + name];
        }
        function fixLoggingFunc(name, id) {
            // @ts-ignore
            console["old" + name] = console[name];
            // @ts-ignore
            console[name] = function (...objs) {
                const output = produceOutput(objs);
                const eleLog = eleLocator();
                const prefix = '[<span class="log-' + name + '">' + id + "</span>]: ";
                const eleContainerLog = eleOverflowLocator();
                allLogs = allLogs + prefix + output + "<br>";
                if (eleLog && eleContainerLog) {
                    if (autoScroll) {
                        const atBottom = eleContainerLog.scrollHeight - eleContainerLog.clientHeight <= eleContainerLog.scrollTop + 1;
                        eleLog.innerHTML = allLogs;
                        if (atBottom)
                            eleContainerLog.scrollTop = eleContainerLog.scrollHeight - eleContainerLog.clientHeight;
                    }
                    else {
                        eleLog.innerHTML = allLogs;
                    }
                }
                // @ts-ignore
                console["old" + name].apply(undefined, objs);
            };
        }
        function produceOutput(args) {
            return args.reduce((output, arg, index) => {
                const isObj = typeof arg === "object";
                let textRep = "";
                if (arg && arg.stack && arg.message) {
                    // special case for err
                    textRep = arg.message;
                }
                else if (isObj) {
                    textRep = JSON.stringify(arg, null, 2);
                }
                else {
                    textRep = arg;
                }
                const showComma = index !== args.length - 1;
                const comma = showComma ? "<span class='comma'>, </span>" : "";
                return output + textRep + comma + "&nbsp;";
            }, "");
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVudGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL3NpZGViYXIvcnVudGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBR0EsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFBO0lBRUgsUUFBQSxTQUFTLEdBQWtCLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ25ELE1BQU0sTUFBTSxHQUFxQjtZQUMvQixFQUFFLEVBQUUsTUFBTTtZQUNWLFdBQVcsRUFBRSxDQUFDLENBQUMsbUJBQW1CLENBQUM7WUFDbkMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFFO2dCQUNoQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO29CQUN4QixNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUNyRCxlQUFlLENBQUMsRUFBRSxHQUFHLHlCQUF5QixDQUFBO29CQUM5QyxTQUFTLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFBO29CQUV0QyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO29CQUM3QyxPQUFPLENBQUMsV0FBVyxHQUFHLCtCQUFRLENBQUMsMkJBQTJCLEVBQUUsU0FBUyxDQUFDLENBQUE7b0JBQ3RFLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUE7b0JBQzdDLGVBQWUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7aUJBQ3JDO2dCQUVELE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQzdDLE9BQU8sQ0FBQyxFQUFFLEdBQUcsZUFBZSxDQUFBO2dCQUM1QixTQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO2dCQUU5QixNQUFNLElB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QUFNLFNBQVMsR0FBRyxLQUFLLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUE7Z0JBQzNDLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsK0JBQStCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtnQkFDOUQsT0FBTyxNQUFNLEdBQUcsT0FBTyxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUE7WUFDNUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBQ1IsQ0FBQztJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbGF5Z3JvdW5kUGx1Z2luLCBQbHVnaW5GYWN0b3J5IH0gZnJvbSBcIi4uXCJcbmltcG9ydCB7IGxvY2FsaXplIH0gZnJvbSBcIi4uL2xvY2FsaXplV2l0aEZhbGxiYWNrXCJcblxubGV0IGFsbExvZ3MgPSBcIlwiXG5cbmV4cG9ydCBjb25zdCBydW5QbHVnaW46IFBsdWdpbkZhY3RvcnkgPSAoaSwgdXRpbHMpID0+IHtcbiAgY29uc3QgcGx1Z2luOiBQbGF5Z3JvdW5kUGx1Z2luID0ge1xuICAgIGlkOiBcImxvZ3NcIixcbiAgICBkaXNwbGF5TmFtZTogaShcInBsYXlfc2lkZWJhcl9sb2dzXCIpLFxuICAgIHdpbGxNb3VudDogKHNhbmRib3gsIGNvbnRhaW5lcikgPT4ge1xuICAgICAgaWYgKGFsbExvZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGNvbnN0IG5vRXJyb3JzTWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgbm9FcnJvcnNNZXNzYWdlLmlkID0gXCJlbXB0eS1tZXNzYWdlLWNvbnRhaW5lclwiXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChub0Vycm9yc01lc3NhZ2UpXG5cbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcbiAgICAgICAgbWVzc2FnZS50ZXh0Q29udGVudCA9IGxvY2FsaXplKFwicGxheV9zaWRlYmFyX2xvZ3Nfbm9fbG9nc1wiLCBcIk5vIGxvZ3NcIilcbiAgICAgICAgbWVzc2FnZS5jbGFzc0xpc3QuYWRkKFwiZW1wdHktcGx1Z2luLW1lc3NhZ2VcIilcbiAgICAgICAgbm9FcnJvcnNNZXNzYWdlLmFwcGVuZENoaWxkKG1lc3NhZ2UpXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVycm9yVUwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpXG4gICAgICBlcnJvclVMLmlkID0gXCJsb2ctY29udGFpbmVyXCJcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChlcnJvclVMKVxuXG4gICAgICBjb25zdCBsb2dzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxuICAgICAgbG9ncy5pZCA9IFwibG9nXCJcbiAgICAgIGxvZ3MuaW5uZXJIVE1MID0gYWxsTG9nc1xuICAgICAgZXJyb3JVTC5hcHBlbmRDaGlsZChsb2dzKVxuICAgIH0sXG4gIH1cblxuICByZXR1cm4gcGx1Z2luXG59XG5cbmV4cG9ydCBjb25zdCBydW5XaXRoQ3VzdG9tTG9ncyA9IChjbG9zdXJlOiBQcm9taXNlPHN0cmluZz4sIGk6IEZ1bmN0aW9uKSA9PiB7XG4gIGNvbnN0IG5vTG9ncyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZW1wdHktbWVzc2FnZS1jb250YWluZXJcIilcbiAgaWYgKG5vTG9ncykge1xuICAgIG5vTG9ncy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcbiAgfVxuXG4gIHJld2lyZUxvZ2dpbmdUb0VsZW1lbnQoXG4gICAgKCkgPT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dcIikhLFxuICAgICgpID0+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9nLWNvbnRhaW5lclwiKSEsXG4gICAgY2xvc3VyZSxcbiAgICB0cnVlLFxuICAgIGlcbiAgKVxufVxuXG4vLyBUaGFua3MgU086IGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIwMjU2NzYwL2phdmFzY3JpcHQtY29uc29sZS1sb2ctdG8taHRtbC8zNTQ0OTI1NiMzNTQ0OTI1NlxuXG5mdW5jdGlvbiByZXdpcmVMb2dnaW5nVG9FbGVtZW50KFxuICBlbGVMb2NhdG9yOiAoKSA9PiBFbGVtZW50LFxuICBlbGVPdmVyZmxvd0xvY2F0b3I6ICgpID0+IEVsZW1lbnQsXG4gIGNsb3N1cmU6IFByb21pc2U8c3RyaW5nPixcbiAgYXV0b1Njcm9sbDogYm9vbGVhbixcbiAgaTogRnVuY3Rpb25cbikge1xuICBmaXhMb2dnaW5nRnVuYyhcImxvZ1wiLCBcIkxPR1wiKVxuICBmaXhMb2dnaW5nRnVuYyhcImRlYnVnXCIsIFwiREJHXCIpXG4gIGZpeExvZ2dpbmdGdW5jKFwid2FyblwiLCBcIldSTlwiKVxuICBmaXhMb2dnaW5nRnVuYyhcImVycm9yXCIsIFwiRVJSXCIpXG4gIGZpeExvZ2dpbmdGdW5jKFwiaW5mb1wiLCBcIklORlwiKVxuXG4gIGNsb3N1cmUudGhlbihqcyA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGV2YWwoanMpXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoaShcInBsYXlfcnVuX2pzX2ZhaWxcIikpXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICAgIH1cblxuICAgIGFsbExvZ3MgPSBhbGxMb2dzICsgXCI8aHIgLz5cIlxuXG4gICAgdW5kb0xvZ2dpbmdGdW5jKFwibG9nXCIpXG4gICAgdW5kb0xvZ2dpbmdGdW5jKFwiZGVidWdcIilcbiAgICB1bmRvTG9nZ2luZ0Z1bmMoXCJ3YXJuXCIpXG4gICAgdW5kb0xvZ2dpbmdGdW5jKFwiZXJyb3JcIilcbiAgICB1bmRvTG9nZ2luZ0Z1bmMoXCJpbmZvXCIpXG4gIH0pXG5cbiAgZnVuY3Rpb24gdW5kb0xvZ2dpbmdGdW5jKG5hbWU6IHN0cmluZykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zb2xlW25hbWVdID0gY29uc29sZVtcIm9sZFwiICsgbmFtZV1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZpeExvZ2dpbmdGdW5jKG5hbWU6IHN0cmluZywgaWQ6IHN0cmluZykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25zb2xlW1wib2xkXCIgKyBuYW1lXSA9IGNvbnNvbGVbbmFtZV1cbiAgICAvLyBAdHMtaWdub3JlXG4gICAgY29uc29sZVtuYW1lXSA9IGZ1bmN0aW9uICguLi5vYmpzOiBhbnlbXSkge1xuICAgICAgY29uc3Qgb3V0cHV0ID0gcHJvZHVjZU91dHB1dChvYmpzKVxuICAgICAgY29uc3QgZWxlTG9nID0gZWxlTG9jYXRvcigpXG4gICAgICBjb25zdCBwcmVmaXggPSAnWzxzcGFuIGNsYXNzPVwibG9nLScgKyBuYW1lICsgJ1wiPicgKyBpZCArIFwiPC9zcGFuPl06IFwiXG4gICAgICBjb25zdCBlbGVDb250YWluZXJMb2cgPSBlbGVPdmVyZmxvd0xvY2F0b3IoKVxuICAgICAgYWxsTG9ncyA9IGFsbExvZ3MgKyBwcmVmaXggKyBvdXRwdXQgKyBcIjxicj5cIlxuXG4gICAgICBpZiAoZWxlTG9nICYmIGVsZUNvbnRhaW5lckxvZykge1xuICAgICAgICBpZiAoYXV0b1Njcm9sbCkge1xuICAgICAgICAgIGNvbnN0IGF0Qm90dG9tID0gZWxlQ29udGFpbmVyTG9nLnNjcm9sbEhlaWdodCAtIGVsZUNvbnRhaW5lckxvZy5jbGllbnRIZWlnaHQgPD0gZWxlQ29udGFpbmVyTG9nLnNjcm9sbFRvcCArIDFcbiAgICAgICAgICBlbGVMb2cuaW5uZXJIVE1MID0gYWxsTG9nc1xuXG4gICAgICAgICAgaWYgKGF0Qm90dG9tKSBlbGVDb250YWluZXJMb2cuc2Nyb2xsVG9wID0gZWxlQ29udGFpbmVyTG9nLnNjcm9sbEhlaWdodCAtIGVsZUNvbnRhaW5lckxvZy5jbGllbnRIZWlnaHRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlbGVMb2cuaW5uZXJIVE1MID0gYWxsTG9nc1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIGNvbnNvbGVbXCJvbGRcIiArIG5hbWVdLmFwcGx5KHVuZGVmaW5lZCwgb2JqcylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBwcm9kdWNlT3V0cHV0KGFyZ3M6IGFueVtdKSB7XG4gICAgcmV0dXJuIGFyZ3MucmVkdWNlKChvdXRwdXQ6IGFueSwgYXJnOiBhbnksIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBpc09iaiA9IHR5cGVvZiBhcmcgPT09IFwib2JqZWN0XCJcbiAgICAgIGxldCB0ZXh0UmVwID0gXCJcIlxuICAgICAgaWYgKGFyZyAmJiBhcmcuc3RhY2sgJiYgYXJnLm1lc3NhZ2UpIHtcbiAgICAgICAgLy8gc3BlY2lhbCBjYXNlIGZvciBlcnJcbiAgICAgICAgdGV4dFJlcCA9IGFyZy5tZXNzYWdlXG4gICAgICB9IGVsc2UgaWYgKGlzT2JqKSB7XG4gICAgICAgIHRleHRSZXAgPSBKU09OLnN0cmluZ2lmeShhcmcsIG51bGwsIDIpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0ZXh0UmVwID0gYXJnIGFzIGFueVxuICAgICAgfVxuXG4gICAgICBjb25zdCBzaG93Q29tbWEgPSBpbmRleCAhPT0gYXJncy5sZW5ndGggLSAxXG4gICAgICBjb25zdCBjb21tYSA9IHNob3dDb21tYSA/IFwiPHNwYW4gY2xhc3M9J2NvbW1hJz4sIDwvc3Bhbj5cIiA6IFwiXCJcbiAgICAgIHJldHVybiBvdXRwdXQgKyB0ZXh0UmVwICsgY29tbWEgKyBcIiZuYnNwO1wiXG4gICAgfSwgXCJcIilcbiAgfVxufVxuIl19