CREATE TABLE IF NOT EXISTS our_story.document (
    document_id TEXT PRIMARY KEY DEFAULT concat('doc-', gen_random_uuid()),
    title TEXT,
    content TEXT,
    owner TEXT[],
    created_at_utc TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at_utc TIMESTAMP WITHOUT TIME ZONE
);