-- 1. Create the new 'grade' table
CREATE TABLE IF NOT EXISTS grade (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  grade TEXT DEFAULT 'silver' CHECK (grade IN ('admin', 'gold', 'silver')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS on the 'grade' table
ALTER TABLE grade ENABLE ROW LEVEL SECURITY;

-- Remove old policies if they exist (to be safe)
DROP POLICY IF EXISTS "Users can view their own grade" ON grade;
DROP POLICY IF EXISTS "Users can insert their own grade" ON grade;
DROP POLICY IF EXISTS "Users can update their own grade" ON grade;

CREATE POLICY "Users can view their own grade" ON grade
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own grade" ON grade
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own grade" ON grade
  FOR UPDATE USING (auth.uid() = id);

-- 3. Migrate existing data from profiles to grade
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    INSERT INTO grade (id, grade)
    SELECT id, 
           CASE 
             WHEN role = 'admin' THEN 'admin'
             ELSE tier 
           END
    FROM profiles
    ON CONFLICT (id) DO UPDATE SET grade = EXCLUDED.grade;
  END IF;
END $$;

-- 4. Update the handle_new_user trigger to use the grade table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.grade (id, grade)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'grade', new.raw_user_meta_data->>'tier', 'silver')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Refactor the products table: rename 'tier' to 'grade'
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tier') THEN
    ALTER TABLE products RENAME COLUMN tier TO grade;
  END IF;
END $$;

-- 6. Update Product Policies for the new Grade system
DROP POLICY IF EXISTS "Tier-based product access" ON products;
DROP POLICY IF EXISTS "Grade-based product access" ON products;
DROP POLICY IF EXISTS "Admin insert" ON products;
DROP POLICY IF EXISTS "Admin update" ON products;
DROP POLICY IF EXISTS "Admin delete" ON products;

CREATE POLICY "Grade-based product access" ON products
  FOR SELECT USING (
    grade = 'silver' OR 
    (
      auth.uid() IS NOT NULL AND 
      EXISTS (
        SELECT 1 FROM grade 
        WHERE id = auth.uid() 
        AND (grade = 'gold' OR grade = 'admin')
      )
    )
  );

CREATE POLICY "Admin insert" ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM grade WHERE id = auth.uid() AND grade = 'admin')
);

CREATE POLICY "Admin update" ON products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM grade WHERE id = auth.uid() AND grade = 'admin')
);

CREATE POLICY "Admin delete" ON products FOR DELETE USING (
  EXISTS (SELECT 1 FROM grade WHERE id = auth.uid() AND grade = 'admin')
);
