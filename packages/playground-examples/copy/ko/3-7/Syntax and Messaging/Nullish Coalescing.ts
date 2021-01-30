//// { compiler: {  }, order: 2 }

// nullish coalescing 연산자는 || 연산자의 대안입니다.
// 왼쪽의 결과가 null 또는 undefined일 경우,
// 오른쪽의 결과를 반환합니다.

// 그에 반해, ||는 falsy 검사를 사용하므로
// 빈 문자열 또는 숫자 0은 false로 여깁니다.

// 이 기능의 좋은 예시는 key가 전달되지 않았을 때
// 기본값을 갖는 일부분의 오브젝트를 다루는 것입니다.

interface AppConfiguration {
  // 기본값: "(no name)"; 빈 문자열은 유효
  name: string;

  // 기본값: -1; 0은 유효
  items: number;

  // 기본값: true
  active: boolean;
}

function updateApp(config: Partial<AppConfiguration>) {
  // null-coalescing 연산자로 설정
  config.name = config.name ?? "(no name)";
  config.items = config.items ?? -1;
  config.active = config.active ?? true;

  // 현재 솔루션
  config.name = typeof config.name === "string" ? config.name : "(no name)";
  config.items = typeof config.items === "number" ? config.items : -1;
  config.active = typeof config.active === "boolean" ? config.active : true;

  // 잘못된 데이터를 설정할 수 있는 || 연산자 사용
  config.name = config.name || "(no name)"; // "" 입력을 허용하지 않음
  config.items = config.items || -1; // 0 입력을 허용하지 않음
  config.active = config.active || true; // 아주 잘못된 사례, 항상 true
}

// 여러분은 3.7 버전에 대한 블로그 글에서 nullish coalescing에 대해 더 많은 것을 읽어보실 수 있습니다:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/