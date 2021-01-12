//// { order: 0, isJavaScript: true }

// DOM(문서 객체 모델)은 웹페이지 동작을 위한 하위 API 요소입니다.
// 그리고 TypeScript는 해당 API를 다루는
// 훌륭한 지원을 제공하고 있습니다.

// 상단 메뉴바에서 "Run"을 클릭했을 때
// popover가 보일 수 있도록 구현해보겠습니다.

const popover = document.createElement("div");
popover.id = "example-popover";

// 명확하게 "div"값을 전달했기 때문에
// popover가 정확히 HTMLDivElement 타입이 된 것에 유의하십시오.

// 이 코드를 재실행하기 위해
// 먼저 기존 popover를 삭제하는 함수를 추가하겠습니다.

const removePopover = () => {
  const existingPopover = document.getElementById(popover.id);
  if (existingPopover && existingPopover.parentElement) {
    existingPopover.parentElement.removeChild(existingPopover);
  }
};

// 이제 함수를 바로 실행해보겠습니다.

removePopover();

// HTMLElement에 있는 .style 프로퍼티를 통해
// 요소의 인라인 스타일을 설정할 수 있습니다. - 이는 완전한 형태로 작성됩니다.

popover.style.backgroundColor = "#0078D4";
popover.style.color = "white";
popover.style.border = "1px solid black";
popover.style.position = "fixed";
popover.style.bottom = "10px";
popover.style.left = "20px";
popover.style.width = "200px";
popover.style.height = "100px";
popover.style.padding = "10px";

// 모호하거나, 더 이상 사용하지 않는 CSS 속성값을 포함합니다.
popover.style.webkitBorderRadius = "4px";

// popover에 내용을 추가하기 위해,
// p 요소를 생성해 텍스트를 추가해보겠습니다.

const message = document.createElement("p");
message.textContent = "Here is an example popover";

// 그리고 팝업을 닫는 버튼도 추가해보겠습니다.

const closeButton = document.createElement("a");
closeButton.textContent = "X";
closeButton.style.position = "absolute";
closeButton.style.top = "3px";
closeButton.style.right = "8px";
closeButton.style.color = "white";

closeButton.onclick = () => {
  removePopover();
};

// 이제 페이지에 모든 요소들을 넣어보겠습니다.
popover.appendChild(message);
popover.appendChild(closeButton);
document.body.appendChild(popover);

// 만약 상단의 "Run"을 클릭한다면,
// 팝업이 하단 왼쪽에 나타날 것입니다.
// 해당 팝업은 상단 오른쪽 x 버튼을 클릭해 닫을 수 있습니다.

// 이 예제는 JavaScript에서 DOM API가 동작하는 방식을 보여주고 있지만,
// TypeScript에서 제공하는 좋은 도구 지원을 이용하여
// 해당 작업을 할 수 있습니다.

// TypeScript 도구 WebGL를 이용해 해당 작업을 확장한 예제는
// 이곳에서 볼 수 있습니다: example:typescript-with-webgl
