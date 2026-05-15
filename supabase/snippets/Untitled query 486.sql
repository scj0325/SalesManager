create policy "Public read access"
on storage.objects
for select
using (bucket_id = 'product-images');