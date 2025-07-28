-- Enable realtime for contestants table
ALTER TABLE public.contestants REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.contestants;

-- Enable realtime for votes table
ALTER TABLE public.votes REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.votes;