-- 1. Create profiles table for roles and tiers
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  tier TEXT DEFAULT 'silver' CHECK (tier IN ('gold', 'silver')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add tier column to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'silver' CHECK (tier IN ('gold', 'silver'));

-- 3. Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, tier)
  VALUES (new.id, 'user', 'silver');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists to avoid errors on multiple runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- 5. Update Product Policies for Tiers
-- Remove old public read policy
DROP POLICY IF EXISTS "Allow public read access" ON products;

-- Admin can see everything for management
-- Gold users can see everything, Silver users only silver
CREATE POLICY "Tier-based product access" ON products
  FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' OR
    (SELECT tier FROM profiles WHERE id = auth.uid()) = 'gold' OR
    ((SELECT tier FROM profiles WHERE id = auth.uid()) = 'silver' AND tier = 'silver') OR
    (auth.uid() IS NULL AND tier = 'silver') -- Guest sees silver
  );

-- Admin only for insert/update/delete
DROP POLICY IF EXISTS "Allow authenticated insert" ON products;
DROP POLICY IF EXISTS "Allow individual delete" ON products;

CREATE POLICY "Admin insert" ON products FOR INSERT WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admin update" ON products FOR UPDATE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

CREATE POLICY "Admin delete" ON products FOR DELETE USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);
