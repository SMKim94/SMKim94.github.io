# SMkim94.github.io

## 프로젝트 개요
Next.js 기반 개인 웹사이트. 정적 빌드(output: export)로 GitHub Pages에 배포.

## 기술 스택
- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + @tailwindcss/typography
- **Theme**: next-themes (다크/라이트)
- **Blog**: MDX + gray-matter + next-mdx-remote
- **배포**: GitHub Actions → GitHub Pages

## 프로젝트 구조
```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃
│   ├── page.tsx            # / 랜딩
│   ├── not-found.tsx       # 404
│   ├── about/page.tsx      # /about
│   ├── projects/page.tsx   # /projects
│   └── blog/
│       ├── page.tsx        # /blog 목록
│       └── [slug]/page.tsx # /blog/[slug] 개별 글
├── components/             # Header, Footer, ThemeToggle, ThemeProvider
├── data/projects.ts        # 프로젝트 데이터
└── lib/posts.ts            # MDX 파싱 유틸
content/posts/              # 블로그 MDX 파일 (.mdx)
.github/workflows/deploy.yml # 자동 배포
```

## 개발
```bash
npm run dev    # 개발 서버
npm run build  # 정적 빌드 (out/ 폴더)
npm run lint   # ESLint
```

## 블로그 글 작성
`content/posts/` 에 `.mdx` 파일 추가:
```yaml
---
title: "글 제목"
date: "2026-03-05"
summary: "짧은 요약"
tags: ["태그"]
---
본문 (MDX)
```

## 배포
main 브랜치에 push하면 GitHub Actions가 자동으로 빌드 + 배포.
⚠️ GitHub 저장소 Settings > Pages > Source를 "GitHub Actions"로 설정 필요.

## 주요 설정
- `next.config.ts`: output: 'export', trailingSlash: true, images.unoptimized: true
- basePath 없음 (username.github.io이므로 루트 서빙)
