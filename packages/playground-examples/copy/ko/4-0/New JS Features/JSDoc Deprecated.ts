// 4.0에서 JSDoc 태그인 @deprecated가 타입 시스템에 추가됩니다.
// 여러분이 현재 사용할 수 있는 JSDoc에
// 어디서든 @deprecated를 사용할 수 있습니다.

interface AccountInfo {
  name: string;
  gender: string;

  /** @deprecated gender 필드를 대신 사용하세요. */
  sex: "male" | "female";
}

declare const userInfo: AccountInfo;
userInfo.sex;

// 지원 중단된 프로퍼티에 접근되었을 때
// TypeScript는 논 블로킹(non-blocking) 경고를 제공할 것이며,
// vscode가 사용하는 것처럼 편집기는 intellisense, outline 그리고 여러분의 코드에서
// 지원 중단된 정보를 표시할 것입니다.
