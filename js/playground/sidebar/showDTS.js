define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.showDTSPlugin = void 0;
    exports.showDTSPlugin = (i, utils) => {
        let codeElement;
        const plugin = {
            id: "dts",
            displayName: i("play_sidebar_dts"),
            willMount: (_, container) => {
                const { code } = utils.createDesignSystem(container);
                codeElement = code("");
            },
            modelChanged: (sandbox, model) => {
                sandbox.getDTSForCode().then(dts => {
                    sandbox.monaco.editor.colorize(dts, "typescript", {}).then(coloredDTS => {
                        codeElement.innerHTML = coloredDTS;
                    });
                });
            },
        };
        return plugin;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hvd0RUUy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BsYXlncm91bmQvc3JjL3NpZGViYXIvc2hvd0RUUy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBRWEsUUFBQSxhQUFhLEdBQWtCLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQ3ZELElBQUksV0FBd0IsQ0FBQTtRQUU1QixNQUFNLE1BQU0sR0FBcUI7WUFDL0IsRUFBRSxFQUFFLEtBQUs7WUFDVCxXQUFXLEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDO1lBQ2xDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFDMUIsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQTtnQkFDcEQsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUN4QixDQUFDO1lBQ0QsWUFBWSxFQUFFLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUMvQixPQUFPLENBQUMsYUFBYSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO29CQUNqQyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7d0JBQ3RFLFdBQVcsQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFBO29CQUNwQyxDQUFDLENBQUMsQ0FBQTtnQkFDSixDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUM7U0FDRixDQUFBO1FBRUQsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQbGF5Z3JvdW5kUGx1Z2luLCBQbHVnaW5GYWN0b3J5IH0gZnJvbSBcIi4uXCJcblxuZXhwb3J0IGNvbnN0IHNob3dEVFNQbHVnaW46IFBsdWdpbkZhY3RvcnkgPSAoaSwgdXRpbHMpID0+IHtcbiAgbGV0IGNvZGVFbGVtZW50OiBIVE1MRWxlbWVudFxuXG4gIGNvbnN0IHBsdWdpbjogUGxheWdyb3VuZFBsdWdpbiA9IHtcbiAgICBpZDogXCJkdHNcIixcbiAgICBkaXNwbGF5TmFtZTogaShcInBsYXlfc2lkZWJhcl9kdHNcIiksXG4gICAgd2lsbE1vdW50OiAoXywgY29udGFpbmVyKSA9PiB7XG4gICAgICBjb25zdCB7IGNvZGUgfSA9IHV0aWxzLmNyZWF0ZURlc2lnblN5c3RlbShjb250YWluZXIpXG4gICAgICBjb2RlRWxlbWVudCA9IGNvZGUoXCJcIilcbiAgICB9LFxuICAgIG1vZGVsQ2hhbmdlZDogKHNhbmRib3gsIG1vZGVsKSA9PiB7XG4gICAgICBzYW5kYm94LmdldERUU0ZvckNvZGUoKS50aGVuKGR0cyA9PiB7XG4gICAgICAgIHNhbmRib3gubW9uYWNvLmVkaXRvci5jb2xvcml6ZShkdHMsIFwidHlwZXNjcmlwdFwiLCB7fSkudGhlbihjb2xvcmVkRFRTID0+IHtcbiAgICAgICAgICBjb2RlRWxlbWVudC5pbm5lckhUTUwgPSBjb2xvcmVkRFRTXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sXG4gIH1cblxuICByZXR1cm4gcGx1Z2luXG59XG4iXX0=