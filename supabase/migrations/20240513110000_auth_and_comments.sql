-- 1. Products table update (ensure it has user_id)
ALTER TABLE products ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- For replies
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 4. Policies for comments
CREATE POLICY "Allow public read access" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow individual delete" ON comments FOR DELETE USING (auth.uid() = user_id);

-- 5. Storage Buckets (Note: Bucket creation via SQL requires specific extensions, 
-- but we can set policies assuming they exist or create them via CLI/UI)
-- We will handle bucket creation and policies separately if needed.
