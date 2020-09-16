//// { compiler: { ts: "3.8.3" } }
// 3.8에선 타입 import를 위해 새로운 구문들을 추가했습니다.
// 이는 flow 사용자에게는 익숙할 것입니다.

// 'import type'은 타입만 import를 선언하는 방법을 제공합니다.
// 즉, JavaScript로 변활할 때 코드가 지워질 것이라는 것을 확신할 수 있습니다.
// 코드는 항상 제거되기 때문에
// 매우 예측 가능한 방식입니다!

// 예를 들어, 이 줄은 import를 추가하거나 요구하지 않을 것입니다.
import type { CSSProperties } from 'react';

// 여기에선 타입으로 사용됩니다.
const style: CSSProperties = {
    textAlign: 'center'
};

// 이 import와는 대조적입니다:
import * as React from 'react';

// 이는 JavaScript에 추가될 것입니다.
export class Welcome extends React.Component {
    render() {
        return (
            <div style={style}>
                <h1>Hello, world</h1>
            </div>
        )
    }
}

// 그러나, 타입이 없는 'import'에서
// 타입만 import 할 경우, 제거될 수 있습니다.
// 컴파일된 JS 결과물에 이 import는 포함되지 않습니다.

import { FunctionComponent } from 'react';

export const BetaNotice: FunctionComponent = () => {
    return <p>This page is still in beta</p>
}

// 이것을 import 생략이라 하며 혼란의 원인이 될 수 있습니다.
// 'import type' 구문을 사용하면
// JavaScript에서 원하는 것을 구체적으로 지정할 수 있습니다.

// 이것은 'import types'의 주요 사용 사례 중
// 하나에 대한 작은 개요지만,
// 3.8 릴리스 노트에서 더 많은 내용을 읽을 수 있습니다.

// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#type-only-imports-exports
