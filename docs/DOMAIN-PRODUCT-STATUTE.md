# DOMAIN-PRODUCT-STATUTE

## 도메인 규칙

1. **데이터 모델**:
   - `id`, `product_number`, `name`, `price`, `grade`, `image_url` 등을 포함한다.
   - `grade` 컬럼은 해당 상품을 조회할 수 있는 최소 등급을 의미한다.

2. **조회 로직**:
   - 비로그인 사용자는 'silver' 등급 상품만 조회 가능하다.
   - 로그인 사용자는 본인의 등급 이하의 모든 상품을 조회할 수 있다.
   - 관리자(admin)는 모든 상품을 조회 및 관리(등록/수정/삭제)할 수 있다.

3. **이미지 처리**:
   - 상품 이미지는 Supabase Storage(`product-images` 버킷)에 저장하며, Public URL을 통해 접근한다.
