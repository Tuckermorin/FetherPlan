// frontend/src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jcbuuqlqaxwsvihxuuev.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYnV1cWxxYXh3c3ZpaHh1dWV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0OTEzNjAsImV4cCI6MjA2NDA2NzM2MH0.lsUfJ5XNRFcOmTMwGE9fDjAWz00qpMzuqETUruXQdFY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)