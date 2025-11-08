import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://pbgingyabzhqcgadquik.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZ2luZ3lhYnpocWNnYWRxdWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTczOTEsImV4cCI6MjA3Nzc3MzM5MX0.1KqLZY9QXQcyhTvQBcRNvpuHRC_c7nYz4tiY_OBRNTI"
)

export default supabase;