# 인테리어 추천 플랫폼 (Curtains & Blinds)

이 프로젝트는 [Next.js](https://nextjs.org)와 [Supabase](https://supabase.com)를 활용하여 구축된 **등급 기반 인테리어 상품 커머스 플랫폼**입니다. 사용자의 등급에 따라 접근 가능한 상품이 제한되는 시스템을 핵심으로 하고 있습니다.

## 🚀 주요 기능

- **등급 기반 상품 접근 제어**: Silver, Gold, Admin 등급에 따른 상품 조회 권한 차별화 (Supabase RLS 활용)
- **상세 검색 및 필터링**: 상품명, 색상, 사이즈, 가격대별 맞춤형 검색 기능
- **관리자 기능**: 관리자(Admin) 전용 상품 등록 및 수정/삭제 폼 제공
- **회원 관리**: Supabase Auth를 연동한 로그인, 회원가입 및 등급 시스템
- **댓글 및 리뷰**: 상품 상세 페이지 내 댓글 작성 및 실시간 반영

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database/Backend**: Supabase (PostgreSQL, RLS, Storage)
- **State Management**: React Context API (AuthContext, CartContext)

## 📁 주요 디렉토리 구조

- `src/app`: 페이지 라우팅 (Home, Login, Signup, MyPage, Product Detail)
- `src/components`: 재사용 가능한 UI 컴포넌트 (Navbar, Footer, SearchBar, ProductCard 등)
- `src/context`: 전역 상태 관리 (인증 및 추천리스트)
- `src/lib`: Supabase 클라이언트 및 유틸리티 함수
- `supabase/migrations`: 데이터베이스 스키마 및 정책 정의 (RBAC, Grades, Cart)

## 🏁 Getting Started

먼저, 개발 서버를 실행하세요:

```bash
 npm run dev --prefix frontend
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하실 수 있습니다.

## 📚 Learn More

Next.js와 Supabase에 대해 더 자세히 알아보려면 다음 리소스를 참조하세요:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js 기능 및 API 설명
- [Supabase Documentation](https://supabase.com/docs) - 데이터베이스 및 인증 가이드

---

이 프로젝트는 `create-next-app`으로 부트스트랩되었습니다.

# 트러블 슈팅

## 문제 상황 -1

grade 처리

## 원인 -1

grade가 읽히지 않음

## 해결 방법 -1

데이터베이스 테이블에 grade를 추가하여 session id로 id 비교후 넘겨준 grade값을 auth에 저장하여 리스트를 불러올시 grade에 대한 내용을 연산하여 데이터를 불러옴

## 문제 상황 -2

댓글과 대댓글 순서가 맞지 않음

## 원인 -2

userid가 같을시 댓글과 대댓글에서 구분이 안감

## 해결 방법 -2

대댓글에 댓글id를 부여하고 대댓글이 없는 경우에는 대댓글id를 댓글 id로 같게 부여한후 sort를 대댓글id로 정렬후 생성일자로 정렬함
map으로 자식이 있으면 연결하여 자식이 있는지 없는지 확인후 댓글, 대댓글 출력

## 문제 상황 -3

이미지가 나오지 않음

## 원인 -3

supabase 서버 사용시 unoptimized(최적화를 안해야함)
loading="eager"를 추가해야함(즉시나오게해야함)

## 해결 방법 -3

unoptimized
loading="eager"를 추가

## 문제 상황 -4

장바구니가 새로고침시 사라짐

## 원인 -4

프로그램 변수에 내용들이 저장됨

## 해결 방법 -4

db에 내용을 저장하여 해결함

---

# 회고

- 어려웠던 점 : ai를 처음사용해봐서 어려운 점이 있었음
- 개선하고 싶은 점 : 쇼필기능과 전산기능 추가하고싶음
- 새롭게 배운 점 : 문법적인 내용들을 배울수 있었어요
- AI 에이전트를 사용하며 느낀 점 : 프로그램을 지식만 있으면 빠르게 만들수 있을것 같아요

---

# 참고 자료

- 구글
- chatgpt
- gemini
