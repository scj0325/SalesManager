# ARCHITECTURE-STATUTE

## 구현 규칙

1. **Next.js & React**:
   - App Router 패턴을 따르며, 상호작용이 필요한 컴포넌트는 `"use client"` 지시어를 명확히 사용한다.
   - 데이터 Fetching은 가능한 서버 컴포넌트나 Supabase 클라이언트를 직접 호출하여 수행한다.

2. **Supabase 연동**:
   - `src/lib/supabaseClient.ts`에 정의된 클라이언트를 공통으로 사용한다.
   - 복잡한 쿼리는 SQL Migration 파일에 작성하고 RLS 정책을 반드시 포함한다.

3. **상태 관리 (Context)**:
   - `AuthContext`: 로그인한 사용자의 `user` 정보와 `gradeInfo`를 제공한다.
   - `CartContext`: `cartItems` 배열과 `addToCart`, `removeFromCart` 등의 함수를 제공한다.

4. **스타일링 (Tailwind CSS 4)**:
   - 유틸리티 클래스 기반으로 스타일링하며, 복잡한 커스텀 스타일은 `globals.css`에 추상화한다.
   - 반응형 디자인(sm, lg, xl 등)을 기본적으로 고려한다.
