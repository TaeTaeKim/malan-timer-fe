# 메랜 사냥 타이머

## 소개

메랜 사냥 타이머는 메이플스토리 레벨업 및 사냥 효율을 측정하고, 소비 아이템, 경험치, 메소, 사냥 시간 등을 쉽게 기록·분석할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- 사냥 시작/종료 시점의 레벨, 경험치, 메소 자동 추출 (AI 이미지 인식)
- 소비 아이템 추가 및 사용량/가격 계산
- 사냥 시간 타이머 및 스톱워치
- 사냥 결과 요약(획득 경험치, 메소, 소비 비용, 레벨업까지 남은 시간 등)
- 프리셋 저장 및 불러오기

## 설치 및 실행 방법

1. **의존성 설치**
   ```bash
   npm install
   ```
2. **개발 서버 실행**

   ```bash
   npm run dev
   ```

3. **AI 서버 연동**
   - AI 서버가 별도로 필요합니다. (`/extract` 엔드포인트, FastAPI 등)
   - 개발 환경에서는 Vite의 proxy 설정을 통해 CORS 문제 없이 연동할 수 있습니다.

## 폴더 구조

```
malan-timer-fe/
├── public/                # 정적 파일 (예: alarm-sound.mp3)
├── src/
│   ├── assets/            # 이미지 등 에셋
│   ├── components/        # Vue 컴포넌트
│   ├── data/              # 데이터/상수
│   ├── stores/            # Pinia 상태 관리
│   ├── views/             # 주요 뷰(App.vue 등)
│   └── style.css          # 전역 스타일
├── package.json
├── vite.config.ts
└── README.md
```

## 기여 방법

1. 이슈/버그/기능 제안은 [GitHub Issues]에 등록해주세요.
2. PR(Pull Request) 환영합니다!

## 라이선스

MIT License

---

문의: [카카오톡 오픈채팅](https://open.kakao.com/o/s4fVKDFh)
