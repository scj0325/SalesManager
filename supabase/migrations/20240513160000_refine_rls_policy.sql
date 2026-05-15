-- 1. Drop the old complex policy
DROP POLICY IF EXISTS "Tier-based product access" ON products;

-- 2. Create a cleaner, more robust tier-based policy
-- Rule: Silver products are public. Gold products require Gold tier or Admin role.
CREATE POLICY "Tier-based product access" ON products
  FOR SELECT USING (
    tier = 'silver' OR 
    (
      auth.uid() IS NOT NULL AND 
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND (tier = 'gold' OR role = 'admin')
      )
    )
  );
