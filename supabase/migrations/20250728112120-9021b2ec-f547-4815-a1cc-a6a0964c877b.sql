-- Create contestants table
CREATE TABLE public.contestants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  talent TEXT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contestant_id UUID NOT NULL REFERENCES public.contestants(id) ON DELETE CASCADE,
  voter_session TEXT NOT NULL, -- Using session ID for anonymous voting
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(voter_session) -- One vote per session
);

-- Enable Row Level Security
ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create policies for contestants (public read access)
CREATE POLICY "Contestants are viewable by everyone" 
ON public.contestants 
FOR SELECT 
USING (true);

-- Create policies for votes (public read, insert with session restriction)
CREATE POLICY "Votes are viewable by everyone" 
ON public.votes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can vote once per session" 
ON public.votes 
FOR INSERT 
WITH CHECK (true);

-- Insert sample contestants
INSERT INTO public.contestants (name, talent, image_url) VALUES
('Sarah Johnson', 'Singer', 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=300&fit=crop&crop=face'),
('Marcus Chen', 'Magician', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face'),
('Isabella Rodriguez', 'Dancer', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop&crop=face'),
('David Thompson', 'Comedian', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=300&fit=crop&crop=face'),
('Emma Williams', 'Acrobat', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face'),
('Alex Kim', 'Musician', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face');