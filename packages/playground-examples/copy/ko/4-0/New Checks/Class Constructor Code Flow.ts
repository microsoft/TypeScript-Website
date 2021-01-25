//// { compiler: { ts: "4.0.2" } }

// 4.0에서는 제어 흐름 분석을 사용하여
// 생성자에 설정된 값을 기반으로
// 클래스 프로퍼티의 잠재적인 타입을 추론합니다.

class UserAccount {
  id; // 타입은 string | number로 추론됩니다.
  constructor(isAdmin: boolean) {
    if (isAdmin) {
      this.id = "admin";
    } else {
      this.id = 0;
    }
  }
}

// TypeScript 이전 버전에서는
// 'id'가 'any'로 분류되었습니다.
