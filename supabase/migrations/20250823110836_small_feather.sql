/*
  # Create Test Data

  1. Test Users
    - Admin user for managing events
    - Regular user for testing applications

  2. Sample Events
    - Weekend dating events
    - Various capacities and dates
*/

-- Insert test admin user (you'll need to create this user in Supabase Auth first)
-- Then update the profile to make them admin
-- This is a placeholder - the actual user creation happens through the auth system

-- Insert sample events
INSERT INTO events (
  title,
  description,
  event_date,
  start_time,
  end_time,
  capacity_male,
  capacity_female,
  application_deadline
) VALUES
(
  'Weekend Coffee Meetup',
  'Casual coffee meetup for singles in their 20s and 30s. Great opportunity to meet new people in a relaxed environment.',
  '2025-01-25',
  '14:00',
  '16:00',
  8,
  8,
  '2025-01-24 12:00:00+00'
),
(
  'Saturday Night Social',
  'Evening social event with dinner and activities. Perfect for making meaningful connections.',
  '2025-02-01',
  '18:00',
  '22:00',
  12,
  12,
  '2025-01-31 15:00:00+00'
),
(
  'Sunday Brunch & Walk',
  'Start your Sunday with brunch followed by a scenic walk in the park. Ideal for nature lovers.',
  '2025-02-02',
  '11:00',
  '15:00',
  6,
  6,
  '2025-02-01 20:00:00+00'
),
(
  'Friday Evening Mixer',
  'End your week with a fun mixer event. Light refreshments and great conversation guaranteed.',
  '2025-02-07',
  '19:00',
  '22:00',
  10,
  10,
  '2025-02-06 17:00:00+00'
);