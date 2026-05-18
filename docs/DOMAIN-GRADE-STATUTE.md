# DOMAIN-GRADE-STATUTE

## 도메인 규칙

1. **등급 정의**:
   - `silver`: 기본 등급, 일반 공개 상품만 접근 가능.
   - `gold`: 우수 등급, 일반 및 프리미엄 상품 접근 가능.
   - `admin`: 관리자 등급, 모든 상품 접근 및 데이터 관리 가능.

2. **등급 관리**:
   - `grade` 테이블에서 사용자의 `id`(UUID)와 대응되는 `grade` 값을 관리한다.
   - 사용자 메타데이터(`raw_user_meta_data`)에도 등급 정보를 동기화하여 빠른 조회를 지원한다.

3. **RBAC 정책**:
   - Supabase `auth.uid()`와 `grade` 테이블의 조인을 통해 RLS 정책을 구현한다.
