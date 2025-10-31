-- Replace handle_new_user function with conflict-proof version
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  base_username text;
  final_username text;
  try_suffix text;
  counter int := 0;
BEGIN
  -- Derive base username (username -> full_name -> email local part)
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name',
    split_part(NEW.email, '@', 1)
  );

  -- Sanitize: lowercase, keep a-z0-9_, convert non-matching to underscore
  base_username := lower(regexp_replace(COALESCE(base_username, ''), '[^a-z0-9_]+', '_', 'g'));

  -- Fallback if empty
  IF base_username = '' THEN
    base_username := 'user';
  END IF;

  final_username := base_username;

  -- If taken, append short id-based suffix until unique
  WHILE EXISTS (SELECT 1 FROM public.players WHERE username = final_username) LOOP
    counter := counter + 1;
    IF counter = 1 THEN
      -- First attempt: use first 6 chars of user ID
      try_suffix := '_' || substr(NEW.id::text, 1, 6);
    ELSE
      -- Subsequent attempts: add counter
      try_suffix := '_' || substr(NEW.id::text, 1, 6) || '_' || counter::text;
    END IF;
    final_username := base_username || try_suffix;
    
    -- Safety limit (should never hit this)
    IF counter > 100 THEN
      final_username := base_username || '_' || NEW.id::text;
      EXIT;
    END IF;
  END LOOP;

  INSERT INTO public.players (id, email, username)
  VALUES (NEW.id, NEW.email, final_username);

  RETURN NEW;
END;
$$;