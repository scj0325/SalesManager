# CONTEXT

## 프로젝트 개요
- **이름**: 인테리어 추천 플랫폼 (Curtains & Blinds)
- **목적**: 사용자 등급별 차등화된 상품 노출 및 구매 기능을 제공하는 커머스 플랫폼

## 기술 스택
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend/DB**: Supabase (Auth, PostgreSQL, Storage, RLS)
- **상태 관리**: Context API (AuthContext, CartContext)

## 주요 도메인
- **Member**: 회원가입, 로그인, 프로필 관리
- **Product**: 상품 목록 조회, 상세 정보, 검색, 필터링 (Grade 기반 노출)
- **Grade**: Silver, Gold, Admin 등급 체계 및 권한 제어
- **Cart**: 장바구니 담기, 수량 조절, 일괄 추가

## 현재 상태
- 기본 기능 구현 완료 (상품 목록, 검색, 장바구니, 인증)
- 등급 기반 RLS 정책 및 상품 필터링 로직 적용됨
- 관리자용 상품 등록/수정 폼 구현됨
