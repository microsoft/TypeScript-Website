//// { compiler: {  }, order: 1 }

// TypeScript는 코드를 자동으로 리팩터링하는
// 도우미 로서 많은 수정 사항을 지원합니다.
// 예를 들어 7번째 줄의 텍스트를 선택하고 팝업되는
// 전구를 클릭하면 몇 가지 수정 사항이 제공됩니다.

function addOne(x: number) {
  return x + 1;
}

// 이 기능은 TypeScript 3.7버전과 함께 사용할 수 있으며,
// 최신 버전(nightly builds)도 포함합니다.

// 코드 샘플을 만들거나 학습할 때 플레이그라운드(playground)에서
// 사용할 필요가 없을 수도 있습니다.

// 그러나, 사용 가능한 수정 기능이 있다는 것은 플레이그라운드(playground)에서
// 문서화할 수 있다는 것을 의미하며, 이는 매우 가치 있는 일입니다.:

// 예시:big-number-literals
// 예시:const-to-let
// 예시:infer-from-usage-changes
