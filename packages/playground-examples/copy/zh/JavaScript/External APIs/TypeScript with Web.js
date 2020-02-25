//// { order: 0, isJavaScript: true }

// DOM (Document Object Model，文档对象模型) 是一种网页底层的标准
// 接口规范，而 TypeScript 对这套接口有着相当不错的支持。

// 在点击运行按钮之前，我们先来创建一个弹出窗口。

const popover = document.createElement("div");
popover.id = "example-popover";

// 值得注意的是，我们创建了一个 div 元素，该弹出窗口将以一个
// HTMLDivElement 类型的元素存在

// 为防止重新运行时出问题，我们必须要有一个方法在每次运行时把弹出窗口移除掉，
// 以确保我们的弹出窗口不会被重复创建

const removePopover = () => {
  const existingPopover = document.getElementById(popover.id);
  if (existingPopover && existingPopover.parentElement) {
    existingPopover.parentElement.removeChild(existingPopover);
  }
};

// 先调用该方法
removePopover();

// 我们可以通过 .style 属性来为一个 HTMLElement 设置 CSS 样式

popover.style.backgroundColor = "#0078D4";
popover.style.color = "white";
popover.style.border = "1px solid black";
popover.style.position = "fixed";
popover.style.bottom = "10px";
popover.style.right = "20px";
popover.style.width = "200px";
popover.style.height = "100px";
popover.style.padding = "10px";

// 包括一些在不同浏览器上可能表现不一致、或者不推荐使用的 CSS 属性
popover.style.webkitBorderRadius = "4px";

// 要在弹出窗口中显示内容，我们需要添加一个 p 标签并给它添加一些文本
const message = document.createElement("p");
message.textContent = "Here is an example popover";

// 接着我们还需要增加一个关闭按钮

const closeButton = document.createElement("a");
closeButton.textContent = "X";
closeButton.style.position = "absolute";
closeButton.style.top = "3px";
closeButton.style.right = "8px";
closeButton.style.color = "white";

closeButton.onclick = () => {
  removePopover();
};

// 最后我们把上面所定义的所有元素都添加到页面上
popover.appendChild(message);
popover.appendChild(closeButton);
document.body.appendChild(popover);

// 如果你点击上面的运行按钮，就会看到右下角出现一个弹出窗口
// 同时你可以点击这个弹出窗口右上角的 X 来关闭这个窗口

// 通过该例子你可以得知在 JavaScript 下如何使用 DOM API——但是，
// TypeScript 为此也提供了更强大的支持。

// 这里同时提供一个使用 TypeScript 的 WebGL 应用的扩展例子：
// example:typescript-with-webgl

