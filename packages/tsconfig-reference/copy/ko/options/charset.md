---
display: "Charset"
oneline: "Manually set the text encoding for reading files"
---

이전 TypeScript 버전에서는, 디스크에서 텍스트 파일을 읽을 때 어떤 인코딩이 사용되었는지를 제어했습니다.
오늘날 TypeScript는 UTF-8 인코딩을 전제로 합니다. 하지만 UTF-16 (BE 와 LE) 또는 UTF-8 BOMs도 정확하게 감지합니다.
