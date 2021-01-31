//// { compiler: {  }, order: 1 }

// 3.7버전에서 새로운 점은 
// 여러분이 함수의 반환 값 대신 실수로 함수를 사용할 때,
// if문 내부를 검사하는 것입니다.

// if문을 항상 true로 만드는 함수가 존재한다고
// 알려질 때만 적용합니다.

// 여기에 선택적인 콜백과 필수적인 콜백이 있는
// plugin 인터페이스 예시가 있습니다.

interface PluginSettings {
  pluginShouldLoad?: () => void;
  pluginIsActivated: () => void;
}

declare const plugin: PluginSettings;

// pluginShouldLoad는 존재하지 않으니
// 타당한 검사입니다.

if (plugin.pluginShouldLoad) {
  // pluginShouldLoad가 존재할 때 이곳에 당신이 원하는 것을 하세요.
}

// 3.6버전과 아래의 경우, 에러가 아닙니다.

if (plugin.pluginIsActivated) {
  // plugin이 활성화 될때
  // 무언가를 하고 싶지만,
  // 메서드 호출하는 대신에 속성으로 사용했습니다.
}

// pluginIsActivated는 항상 존재해야 하지만, 
// if문 블록 안에서 메서드를 호출했으므로
// TypeScript는 여전히 검사를 허용합니다. 

if (plugin.pluginIsActivated) {
  plugin.pluginIsActivated();
}
