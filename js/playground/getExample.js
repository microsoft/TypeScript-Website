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
    exports.getExampleSourceCode = void 0;
    exports.getExampleSourceCode = (prefix, lang, exampleID) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const site = `${document.location.protocol}//${document.location.host}${prefix}`;
            const examplesTOCHref = `${site}/js/examples/${lang}.json`;
            const res = yield fetch(examplesTOCHref);
            if (!res.ok) {
                console.error('Could not fetch example TOC for lang: ' + lang);
                return {};
            }
            const toc = yield res.json();
            const example = toc.examples.find((e) => e.id === exampleID);
            if (!example) {
                // prettier-ignore
                console.error(`Could not find example with id: ${exampleID} in\n// ${document.location.protocol}//${document.location.host}${examplesTOCHref}`);
                return {};
            }
            const exampleCodePath = `${site}/js/examples/${example.lang}/${example.path.join('/')}/${example.name}`;
            const codeRes = yield fetch(exampleCodePath);
            let code = yield codeRes.text();
            // Handle removing the compiler settings stuff
            if (code.startsWith('//// {')) {
                code = code
                    .split('\n')
                    .slice(1)
                    .join('\n')
                    .trim();
            }
            // @ts-ignore
            window.appInsights.trackEvent({ name: 'Read Playground Example', properties: { id: exampleID, lang } });
            return {
                example,
                code,
            };
        }
        catch (e) {
            console.log(e);
            return {};
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0RXhhbXBsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL2dldEV4YW1wbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUFhLFFBQUEsb0JBQW9CLEdBQUcsQ0FBTyxNQUFjLEVBQUUsSUFBWSxFQUFFLFNBQWlCLEVBQUUsRUFBRTtRQUM1RixJQUFJO1lBQ0YsTUFBTSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLEVBQUUsQ0FBQTtZQUNoRixNQUFNLGVBQWUsR0FBRyxHQUFHLElBQUksZ0JBQWdCLElBQUksT0FBTyxDQUFBO1lBQzFELE1BQU0sR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBQ3hDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO2dCQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLEdBQUcsSUFBSSxDQUFDLENBQUE7Z0JBQzlELE9BQU8sRUFBRSxDQUFBO2FBQ1Y7WUFFRCxNQUFNLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUM1QixNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxTQUFTLENBQUMsQ0FBQTtZQUNqRSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLGtCQUFrQjtnQkFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsU0FBUyxXQUFXLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxLQUFLLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLGVBQWUsRUFBRSxDQUFDLENBQUE7Z0JBQy9JLE9BQU8sRUFBRSxDQUFBO2FBQ1Y7WUFFRCxNQUFNLGVBQWUsR0FBRyxHQUFHLElBQUksZ0JBQWdCLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO1lBQ3ZHLE1BQU0sT0FBTyxHQUFHLE1BQU0sS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFBO1lBQzVDLElBQUksSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO1lBRS9CLDhDQUE4QztZQUM5QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQzdCLElBQUksR0FBRyxJQUFJO3FCQUNSLEtBQUssQ0FBQyxJQUFJLENBQUM7cUJBQ1gsS0FBSyxDQUFDLENBQUMsQ0FBQztxQkFDUixJQUFJLENBQUMsSUFBSSxDQUFDO3FCQUNWLElBQUksRUFBRSxDQUFBO2FBQ1Y7WUFFRCxhQUFhO1lBQ2IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUseUJBQXlCLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUE7WUFFdkcsT0FBTztnQkFDTCxPQUFPO2dCQUNQLElBQUk7YUFDTCxDQUFBO1NBQ0Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDZCxPQUFPLEVBQUUsQ0FBQTtTQUNWO0lBQ0gsQ0FBQyxDQUFBLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgZ2V0RXhhbXBsZVNvdXJjZUNvZGUgPSBhc3luYyAocHJlZml4OiBzdHJpbmcsIGxhbmc6IHN0cmluZywgZXhhbXBsZUlEOiBzdHJpbmcpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzaXRlID0gYCR7ZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2x9Ly8ke2RvY3VtZW50LmxvY2F0aW9uLmhvc3R9JHtwcmVmaXh9YFxuICAgIGNvbnN0IGV4YW1wbGVzVE9DSHJlZiA9IGAke3NpdGV9L2pzL2V4YW1wbGVzLyR7bGFuZ30uanNvbmBcbiAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaChleGFtcGxlc1RPQ0hyZWYpXG4gICAgaWYgKCFyZXMub2spIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBmZXRjaCBleGFtcGxlIFRPQyBmb3IgbGFuZzogJyArIGxhbmcpXG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICBjb25zdCB0b2MgPSBhd2FpdCByZXMuanNvbigpXG4gICAgY29uc3QgZXhhbXBsZSA9IHRvYy5leGFtcGxlcy5maW5kKChlOiBhbnkpID0+IGUuaWQgPT09IGV4YW1wbGVJRClcbiAgICBpZiAoIWV4YW1wbGUpIHtcbiAgICAgIC8vIHByZXR0aWVyLWlnbm9yZVxuICAgICAgY29uc29sZS5lcnJvcihgQ291bGQgbm90IGZpbmQgZXhhbXBsZSB3aXRoIGlkOiAke2V4YW1wbGVJRH0gaW5cXG4vLyAke2RvY3VtZW50LmxvY2F0aW9uLnByb3RvY29sfS8vJHtkb2N1bWVudC5sb2NhdGlvbi5ob3N0fSR7ZXhhbXBsZXNUT0NIcmVmfWApXG4gICAgICByZXR1cm4ge31cbiAgICB9XG5cbiAgICBjb25zdCBleGFtcGxlQ29kZVBhdGggPSBgJHtzaXRlfS9qcy9leGFtcGxlcy8ke2V4YW1wbGUubGFuZ30vJHtleGFtcGxlLnBhdGguam9pbignLycpfS8ke2V4YW1wbGUubmFtZX1gXG4gICAgY29uc3QgY29kZVJlcyA9IGF3YWl0IGZldGNoKGV4YW1wbGVDb2RlUGF0aClcbiAgICBsZXQgY29kZSA9IGF3YWl0IGNvZGVSZXMudGV4dCgpXG5cbiAgICAvLyBIYW5kbGUgcmVtb3ZpbmcgdGhlIGNvbXBpbGVyIHNldHRpbmdzIHN0dWZmXG4gICAgaWYgKGNvZGUuc3RhcnRzV2l0aCgnLy8vLyB7JykpIHtcbiAgICAgIGNvZGUgPSBjb2RlXG4gICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgLnNsaWNlKDEpXG4gICAgICAgIC5qb2luKCdcXG4nKVxuICAgICAgICAudHJpbSgpXG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIHdpbmRvdy5hcHBJbnNpZ2h0cy50cmFja0V2ZW50KHsgbmFtZTogJ1JlYWQgUGxheWdyb3VuZCBFeGFtcGxlJywgcHJvcGVydGllczogeyBpZDogZXhhbXBsZUlELCBsYW5nIH0gfSlcblxuICAgIHJldHVybiB7XG4gICAgICBleGFtcGxlLFxuICAgICAgY29kZSxcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIHJldHVybiB7fVxuICB9XG59XG4iXX0=