/*
  # Create messages table for chat functionality

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content` (text, message content)
      - `sender` (text, either 'user' or 'bot')
      - `timestamp` (timestamptz, when message was sent)
      - `persona` (text, AI persona used)
      - `created_at` (timestamptz, record creation time)

  2. Security
    - Enable RLS on `messages` table
    - Add policies for authenticated users to manage their own messages
    - Support for anonymous users to access their own data
*/

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  sender text NOT NULL CHECK (sender IN ('user', 'bot')),
  timestamp timestamptz DEFAULT now() NOT NULL,
  persona text DEFAULT 'default' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own messages"
  ON public.messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own messages"
  ON public.messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
  ON public.messages
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS messages_user_id_timestamp_idx ON public.messages(user_id, timestamp);