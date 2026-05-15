-- Clear existing products to avoid duplicates during reset/seed
DELETE FROM products;

-- Insert Silver Tier Products (Accessible to everyone)
INSERT INTO products (product_number, name, size, price, color, image_url, stock, description, tier)
VALUES 
  ('S-101', '[Silver] 베이직 화이트 쉬폰 커튼', '140x230cm', 24000, '화이트', 'https://images.unsplash.com/photo-1548611635-b6e78bb0d502?w=800&q=80', 50, '깔끔하고 가벼운 소재의 화이트 쉬폰 커튼입니다. 어느 인테리어에나 잘 어울립니다.', 'silver'),
  ('S-102', '[Silver] 모던 그레이 암막 커튼', '140x230cm', 38000, '그레이', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 30, '실내 빛을 효과적으로 차단해주는 실용적인 암막 커튼입니다.', 'silver'),
  ('S-103', '[Silver] 내추럴 우드 블라인드', '120x180cm', 45000, '브라운', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', 20, '따뜻한 나무 느낌을 주는 기본형 우드 블라인드입니다.', 'silver');

-- Insert Gold Tier Products (Accessible only to Gold members and Admins)
INSERT INTO products (product_number, name, size, price, color, image_url, stock, description, tier)
VALUES 
  ('G-901', '[Gold] 프리미엄 벨기에 벨벳 커튼', '200x240cm', 280000, '네이비', 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80', 5, '최고급 벨기에산 벨벳 소재를 사용하여 공간의 품격을 높여주는 명품 커튼입니다.', 'gold'),
  ('G-902', '[Gold] 스마트 IoT 전동 블라인드', '150x200cm', 420000, '실버', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', 10, '스마트폰 앱으로 조절 가능한 최첨단 전동 블라인드 시스템입니다.', 'gold'),
  ('G-903', '[Gold] 핸드메이드 실크 자수 커튼', '180x230cm', 350000, '샴페인 골드', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 3, '장인의 손길로 한 땀 한 땀 수놓은 고귀한 실크 자수 커튼입니다.', 'gold');
