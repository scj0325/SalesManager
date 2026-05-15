-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_number TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  size TEXT,
  price INTEGER NOT NULL,
  color TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read products
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Insert mock data
INSERT INTO products (product_number, name, size, price, color, image_url, stock, description)
VALUES 
  ('C-001', '리넨 스타일 암막 커튼', '140x230cm', 45000, '아이보리', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 25, '고급스러운 리넨 느낌의 소재로 빛 차단율이 높은 암막 커튼입니다.'),
  ('C-002', '쉬폰 시스루 나비주름 커튼', '200x240cm', 32000, '화이트', 'https://images.unsplash.com/photo-1548611635-b6e78bb0d502?w=800&q=80', 12, '가볍고 부드러운 쉬폰 소재로 화사한 분위기를 연출해줍니다.'),
  ('B-001', '알루미늄 베네시안 블라인드', '100x150cm', 28000, '실버', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', 8, '모던한 디자인의 알루미늄 블라인드로 각도 조절이 용이합니다.'),
  ('C-003', '벨벳 럭셔리 커튼', '150x230cm', 68000, '네이비', 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800&q=80', 15, '부드러운 벨벳 소재로 공간에 고급스러움을 더해주는 커튼입니다.'),
  ('B-002', '우드 콤비 블라인드', '120x180cm', 52000, '브라운', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80', 20, '나무의 결이 살아있는 콤비 블라인드로 자연스러운 분위기를 줍니다.'),
  ('C-004', '모던 그레이 워셔블 커튼', '140x230cm', 39000, '그레이', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80', 5, '세탁이 용이하고 내구성이 좋은 실용적인 커튼입니다.');
