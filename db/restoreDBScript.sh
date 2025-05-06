pg_restore -h "localhost" -p 5432 -U "postgres" -d "our_story_db" --clean --if-exists -v 015055.sql
