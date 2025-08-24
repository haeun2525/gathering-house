/*
  # Create photos storage bucket with proper RLS policies

  1. Storage Setup
    - Create 'photos' bucket for profile images
    - Set bucket as public for easy access
    - Configure proper RLS policies for authenticated users

  2. Security
    - Allow authenticated users to upload photos
    - Allow public read access for displaying images
    - Allow users to manage their own uploaded photos
*/

-- Create the photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload photos
CREATE POLICY "Allow authenticated users to upload photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos');

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'photos');

-- Create policy to allow users to update their own photos
CREATE POLICY "Allow users to update their own photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow users to delete their own photos
CREATE POLICY "Allow users to delete their own photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);