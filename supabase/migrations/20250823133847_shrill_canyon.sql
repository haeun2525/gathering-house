/*
  # Create photos storage bucket

  1. Storage Setup
    - Create 'photos' bucket for profile photo uploads
    - Set bucket to public for easy access to uploaded images
  
  2. Security Policies
    - Allow authenticated users to upload their own photos
    - Allow public read access to all photos
    - Allow users to update/delete their own photos
*/

-- Create the photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload photos
CREATE POLICY "Users can upload photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'photos');

-- Allow public read access to photos
CREATE POLICY "Public can view photos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'photos');

-- Allow users to update their own photos
CREATE POLICY "Users can update own photos" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete own photos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);