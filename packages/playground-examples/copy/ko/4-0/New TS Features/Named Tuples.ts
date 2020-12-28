//// { compiler: { ts: "4.0.2" } }
// 튜플은 타입 시스템에서 순서가 중요한 배열입니다,
// 여러분은 예시에서 자세히 배울 수 있습니다: 튜플

// TypeScript 4.0에서, 튜플의 얻게 된 기능의 타입은
// 배열의 각각 다른 부분에 이름을 부여할 수 있습니다.

// 예를 들어, 여러분은 Lat, Long 위치를 튜플을 통해 작성하곤 했습니다:

type OldLocation = [number, number]

const locations: OldLocation[] = [
    [40.7144, -74.006],
    [53.6458, -1.785]
]

// 어떤 것이 Latitude이고 Longitude인지 아는 것은 모호하므로,
// 여러분은 LatLong 튜플이라고 불러왔을 겁니다.

// 4.0에서는, 이렇게 작성할 수 있습니다.

type NewLocation = [lat: number, long: number]

const newLocations: NewLocation[] = [
    [52.3702, 4.8952],
    [53.3498, -6.2603]
]

// 그 이름은 이제 에디터에서
// 여러분이 다음 줄의 끝에 있는 0과 1 위에서 호버할 때 보입니다.
const firstLat = newLocations[0][0]
const firstLong = newLocations[0][1]

// 조금 실망스럽게 보일 수 있지만,
// 주요 목표는 타입 시스템이 동작할 때,
// 정보를 잃어버리지 않도록 하는 것입니다.
// 예를 들어, Parameter 유틸리티 타입을 사용하는 함수에서
// 파라미터를 추출할 경우:

function centerMap(lng: number, lat: number) {}

// 4.0에서, lng와 lat는 유지합니다
type CenterMapParams = Parameters<typeof centerMap>

// 3.9에서는, 이렇게 보입니다
type OldCenterMapParams = [number, number]

// 파라미터 정보에 대해
// 더 복잡한 타입 조작 손실을 만듭니다.