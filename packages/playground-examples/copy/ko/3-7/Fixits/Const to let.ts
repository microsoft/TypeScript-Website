//// { compiler: {  }, order: 1 }

// 3.7 버전의 새로운 기능은
// 값이 재할당 되었을 때 const 변수를 let으로
// 빠르게 변환하는 것입니다.

// 아래 오류에 하이라이트 표시를 확인하고
// 퀵 픽스를 실행해보세요.

const displayName = "Andrew";

displayName = "Andrea";
