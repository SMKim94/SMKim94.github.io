/**
 * 앱 메타데이터(이름·기본 크기)만 담는 모듈.
 * 컴포넌트를 import하지 않아서 WindowManager가 순환 참조 없이 쓸 수 있다.
 * (순환이 있으면 Vite HMR 때 컨텍스트가 재생성되어 앱이 깨진다.)
 */
export type AppId = "explorer" | "notepad" | "terminal";

export interface AppArgs {
  /** 파일/폴더를 열 때의 대상 경로 */
  path?: string;
}

export interface AppMeta {
  name: string;
  w: number;
  h: number;
  /** 창 본문에 추가할 클래스 (예: 터미널의 어두운 배경) */
  bodyClass?: string;
}

export const APP_META: Record<AppId, AppMeta> = {
  explorer: { name: "파일 탐색기", w: 920, h: 600 },
  notepad: { name: "메모장", w: 720, h: 520 },
  terminal: { name: "명령 프롬프트", w: 780, h: 480, bodyClass: "body-terminal" },
};

/** 작업표시줄 고정 순서 */
export const PINNED: AppId[] = ["explorer", "terminal", "notepad"];
