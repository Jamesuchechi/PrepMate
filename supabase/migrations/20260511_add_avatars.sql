-- Add avatar_url to profiles
alter table profiles add column avatar_url text;

-- Create a storage bucket for avatars
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Allow users to upload their own avatars
create policy "Users can upload their own avatars"
  on storage.objects for insert with check (
    bucket_id = 'avatars' and 
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own avatars"
  on storage.objects for update with check (
    bucket_id = 'avatars' and 
    (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Avatars are publicly accessible"
  on storage.objects for select using (bucket_id = 'avatars');
