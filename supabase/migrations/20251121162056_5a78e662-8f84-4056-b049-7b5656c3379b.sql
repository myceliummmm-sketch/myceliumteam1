-- Fix function search path for update_vision_progress_updated_at
CREATE OR REPLACE FUNCTION update_vision_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;