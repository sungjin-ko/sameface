# 아이돌 닮은 꼴 찾기 (Idol Look-Alike Finder)

## 개요 (Overview)

이 애플리케이션은 사용자가 자신의 얼굴 사진을 업로드하면, AI를 이용해 가장 닮은 K-POP 아이돌을 찾아주는 웹 서비스입니다.

This application is a web service that allows users to upload a photo of their face and uses AI to find the K-POP idol they most resemble.

## 프로젝트 상세 (Project Details)

### 디자인 및 스타일 (Design & Style)

*   **레이아웃 (Layout):** 중앙 정렬된 수직 레이아웃으로, 사용자가 쉽게 콘텐츠에 집중할 수 있도록 합니다.
*   **글꼴 (Font):** 기본 sans-serif 글꼴을 사용하여 가독성을 높입니다.
*   **색상 (Color):** 부드러운 회색 배경 (`#f0f2f5`)과 어두운 텍스트 색상 (`#333`)으로 차분하고 깔끔한 느낌을 줍니다.
*   **컴포넌트 (Components):**
    *   파일 업로드 버튼 (`<input type="file">`)
    *   결과를 표시할 div 영역

### 기능 (Features)

*   **HTML (`index.html`):**
    *   페이지 제목: "아이돌 닮은 꼴 찾기"
    *   메인 헤딩 (`<h1>`)과 간단한 설명 (`<p>`).
    *   이미지 업로드를 위한 `input` 요소 (`id="image-upload"`).
    *   결과를 표시할 `div` 요소 (`id="result"`).
    *   `main.js`와 `style.css` 파일을 로드합니다.

*   **CSS (`style.css`):**
    *   `body`에 `flexbox`를 적용하여 콘텐츠를 수직, 수평 중앙 정렬합니다.
    *   제목, 파일 입력, 결과 영역에 적절한 마진과 패딩을 적용합니다.

*   **JavaScript (`main.js`):**
    *   `image-upload` 요소에 `change` 이벤트 리스너를 추가합니다.
    *   미리 정의된 아이돌 목록(아이유, 카리나, 장원영, 해린, 슬기)을 포함합니다.
    *   사용자가 이미지를 선택하면:
        *   `FileReader`를 사용해 이미지를 읽고 화면에 200px 너비로 표시합니다.
        *   기존 결과는 지웁니다.
        *   아이돌 목록에서 무작위로 한 명을 선택하여, 그룹과 이름을 포함한 결과 텍스트를 화면에 표시합니다.

## 현재 계획 (Current Plan)

*   [x] 기본 HTML, CSS, JavaScript 구조 설정 완료.
*   [x] 이미지 업로드 및 미리보기 기능 구현.
*   [x] 임시 아이돌 데이터 추가 및 무작위 결과 출력 기능 구현.
*   [x] `blueprint.md` 파일 생성 및 프로젝트 내용 문서화.
