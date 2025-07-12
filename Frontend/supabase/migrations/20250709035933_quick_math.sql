/*
  # Create mood_data table for mood tracking

  1. New Tables
    - `mood_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `sentiment` (text, mood sentiment: positive, negative, neutral, crisis)
      - `message` (text, original message that triggered mood analysis)
      - `timestamp` (timestamptz, when mood was recorded)
      - `created_at` (timestamptz, record creation time)

  2. Security
    - Enable RLS on `mood_data` table
    - Add policies for authenticated users to manage their own mood data
    - Support for anonymous users to access their own data
*/

CREATE TABLE IF NOT EXISTS public.mood_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sentiment text NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral', 'crisis')),
  message text NOT NULL,
  timestamp timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.mood_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own mood data"
  ON public.mood_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own mood data"
  ON public.mood_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS mood_data_user_id_timestamp_idx ON public.mood_data(user_id, timestamp);