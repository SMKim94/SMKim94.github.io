# 제3자 고지

이 저장소는 아래 오픈소스 자산을 포함한다. 각 라이선스가 요구하는 저작권
고지를 여기에 남긴다.

---

## Fluent UI System Icons

`src/os/icons.tsx` 의 단색 UI 아이콘은 Microsoft가 MIT 라이선스로 공개한
**Fluent UI System Icons** 의 경로 데이터다.

- 출처: https://github.com/microsoft/fluentui-system-icons
- 패키지: `@fluentui/svg-icons` 1.1.338
- 사용한 것: 20px `Regular` 변형 45종의 `<path d="...">` 값
- 라이선스: MIT

경로 데이터만 소스에 인라인했고 패키지를 의존성으로 두지는 않았다. 아이콘
45개를 쓰자고 2만 개짜리 패키지를 번들에 끌어들일 이유가 없다.

컬러 앱 아이콘(폴더·탐색기·메모장·터미널·휴지통 등), 시작 단추 글리프,
창 제어 단추 글리프는 이 세트에 포함되지 않는다. 직접 그린 것이다.

### 라이선스 전문

```
MIT License

Copyright (c) 2020 Microsoft Corporation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 포함하지 않은 것

Windows에서 추출한 아이콘(`.ico`, `.png`)은 쓰지 않는다. Windows 사용권은
구성 요소를 분리해 재배포할 권리를 주지 않고, 공개 배포되는 사이트라
저작권 문제가 생긴다. 자세한 방침은 `CONTRIBUTING.md` 의 "아이콘" 절에
있다.
