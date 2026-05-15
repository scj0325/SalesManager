-- Update handle_new_user function to read tier from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role, tier)
  VALUES (
    new.id, 
    'user', 
    COALESCE(new.raw_user_meta_data->>'tier', 'silver')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add UPDATE policy for profiles
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
