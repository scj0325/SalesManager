# ARCHITECTURE-CONSTITUTION

## 핵심 원칙

1. **보안 우선 (Security First)**:
   - 모든 데이터 접근은 Supabase RLS(Row Level Security)를 통해 서버 측에서 검증되어야 한다.
   - 클라이언트 측 필터링은 편의를 위한 것이며, 최종 권한 검증은 DB 레벨에서 수행한다.

2. **일관된 상태 관리 (Single Source of Truth)**:
   - 인증 상태는 `AuthContext`, 장바구니 상태는 `CartContext`를 통해 전역적으로 관리한다.
   - 서버 데이터와 동기화가 필요한 경우 수동 새로고침보다 상태 업데이트 후 재조회를 권장한다.

3. **등급 기반 접근 제어 (Grade-based Access)**:
   - 서비스의 핵심 가치는 등급별 차등화된 정보다.
   - 모든 신규 기능 설계 시 등급(Grade)에 따른 영향도를 먼저 고려한다.

4. **컴포넌트 중심 개발 (Component-Driven)**:
   - UI 로직과 비즈니스 로직을 최대한 분리한다.
   - 재사용 가능한 작은 단위의 컴포넌트를 조합하여 복잡한 UI를 구성한다.
