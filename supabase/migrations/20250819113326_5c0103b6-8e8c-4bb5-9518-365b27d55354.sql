-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix auto-generate job_id function with proper search_path
CREATE OR REPLACE FUNCTION public.generate_job_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.job_id IS NULL OR NEW.job_id = '' THEN
        NEW.job_id := 'REP' || LPAD((SELECT COUNT(*) + 1 FROM public.repair_jobs)::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;