var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compiledJSPlugin = void 0;
    exports.compiledJSPlugin = () => {
        let codeElement;
        const plugin = {
            id: 'types',
            displayName: 'Types',
            willMount: (sandbox, container) => __awaiter(void 0, void 0, void 0, function* () {
                const createCodePre = document.createElement('pre');
                codeElement = document.createElement('code');
                createCodePre.appendChild(codeElement);
                container.appendChild(createCodePre);
            }),
            modelChangedDebounce: (sandbox, model) => __awaiter(void 0, void 0, void 0, function* () {
                const program = yield sandbox.createTSProgram();
                const checker = program.getTypeChecker();
                const sourceFile = program.getSourceFile(model.uri.path);
                const ts = sandbox.ts;
                sandbox.ts.forEachChild(sourceFile, node => {
                    if (ts.isInterfaceDeclaration(node)) {
                        const symbol = checker.getSymbolAtLocation(node);
                        if (symbol) {
                            console.log(symbol, symbol.members);
                        }
                        else {
                            console.log('could not get symbol for interface');
                        }
                    }
                });
            }),
        };
        return plugin;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvd1R5cGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGxheWdyb3VuZC9zcmMvc2lkZWJhci9zaG93VHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUVhLFFBQUEsZ0JBQWdCLEdBQUcsR0FBRyxFQUFFO1FBQ25DLElBQUksV0FBd0IsQ0FBQTtRQUU1QixNQUFNLE1BQU0sR0FBcUI7WUFDL0IsRUFBRSxFQUFFLE9BQU87WUFDWCxXQUFXLEVBQUUsT0FBTztZQUNwQixTQUFTLEVBQUUsQ0FBTyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUU7Z0JBQ3RDLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ25ELFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFBO2dCQUU1QyxhQUFhLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFBO2dCQUN0QyxTQUFTLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFBO1lBQ3RDLENBQUMsQ0FBQTtZQUVELG9CQUFvQixFQUFFLENBQU8sT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUM3QyxNQUFNLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQyxlQUFlLEVBQUUsQ0FBQTtnQkFDL0MsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFBO2dCQUV4QyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFFLENBQUE7Z0JBQ3pELE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUE7Z0JBQ3JCLE9BQU8sQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsRUFBRTtvQkFDekMsSUFBSSxFQUFFLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQ25DLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQTt3QkFDaEQsSUFBSSxNQUFNLEVBQUU7NEJBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFBO3lCQUNwQzs2QkFBTTs0QkFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUE7eUJBQ2xEO3FCQUNGO2dCQUNILENBQUMsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFBO1NBQ0YsQ0FBQTtRQUVELE9BQU8sTUFBTSxDQUFBO0lBQ2YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGxheWdyb3VuZFBsdWdpbiB9IGZyb20gJy4uJ1xuXG5leHBvcnQgY29uc3QgY29tcGlsZWRKU1BsdWdpbiA9ICgpID0+IHtcbiAgbGV0IGNvZGVFbGVtZW50OiBIVE1MRWxlbWVudFxuXG4gIGNvbnN0IHBsdWdpbjogUGxheWdyb3VuZFBsdWdpbiA9IHtcbiAgICBpZDogJ3R5cGVzJyxcbiAgICBkaXNwbGF5TmFtZTogJ1R5cGVzJyxcbiAgICB3aWxsTW91bnQ6IGFzeW5jIChzYW5kYm94LCBjb250YWluZXIpID0+IHtcbiAgICAgIGNvbnN0IGNyZWF0ZUNvZGVQcmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwcmUnKVxuICAgICAgY29kZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjb2RlJylcblxuICAgICAgY3JlYXRlQ29kZVByZS5hcHBlbmRDaGlsZChjb2RlRWxlbWVudClcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjcmVhdGVDb2RlUHJlKVxuICAgIH0sXG5cbiAgICBtb2RlbENoYW5nZWREZWJvdW5jZTogYXN5bmMgKHNhbmRib3gsIG1vZGVsKSA9PiB7XG4gICAgICBjb25zdCBwcm9ncmFtID0gYXdhaXQgc2FuZGJveC5jcmVhdGVUU1Byb2dyYW0oKVxuICAgICAgY29uc3QgY2hlY2tlciA9IHByb2dyYW0uZ2V0VHlwZUNoZWNrZXIoKVxuXG4gICAgICBjb25zdCBzb3VyY2VGaWxlID0gcHJvZ3JhbS5nZXRTb3VyY2VGaWxlKG1vZGVsLnVyaS5wYXRoKSFcbiAgICAgIGNvbnN0IHRzID0gc2FuZGJveC50c1xuICAgICAgc2FuZGJveC50cy5mb3JFYWNoQ2hpbGQoc291cmNlRmlsZSwgbm9kZSA9PiB7XG4gICAgICAgIGlmICh0cy5pc0ludGVyZmFjZURlY2xhcmF0aW9uKG5vZGUpKSB7XG4gICAgICAgICAgY29uc3Qgc3ltYm9sID0gY2hlY2tlci5nZXRTeW1ib2xBdExvY2F0aW9uKG5vZGUpXG4gICAgICAgICAgaWYgKHN5bWJvbCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coc3ltYm9sLCBzeW1ib2wubWVtYmVycylcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NvdWxkIG5vdCBnZXQgc3ltYm9sIGZvciBpbnRlcmZhY2UnKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LFxuICB9XG5cbiAgcmV0dXJuIHBsdWdpblxufVxuIl19