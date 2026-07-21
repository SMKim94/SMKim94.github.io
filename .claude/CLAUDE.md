# SMkim94.github.io

## 프로젝트 개요
Next.js 기반 개인 웹사이트. 정적 빌드(output: export)로 GitHub Pages에 배포.
현재 콘텐츠는 모두 비워진 백지 상태.

## 기술 스택
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **배포**: GitHub Actions → GitHub Pages

## 프로젝트 구조
```
src/app/
├── layout.tsx    # 루트 레이아웃
├── page.tsx      # / 홈 (현재 빈 페이지)
└── globals.css
.github/workflows/deploy.yml # 자동 배포
```

## 개발
```bash
npm run dev    # 개발 서버
npm run build  # 정적 빌드 (out/ 폴더)
npm run lint   # ESLint
```

## 배포
main 브랜치에 push하면 GitHub Actions가 자동으로 빌드 + 배포.

## 주요 설정
- `next.config.ts`: output: 'export', trailingSlash: true, images.unoptimized: true
- basePath 없음 (username.github.io이므로 루트 서빙)
