CREATE TABLE IF NOT EXISTS our_story.user (
    user_id TEXT PRIMARY KEY DEFAULT concat('user-', gen_random_uuid()),
    email TEXT,
    password TEXT,
    created_at_utc TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at_utc TIMESTAMP WITHOUT TIME ZONE
);