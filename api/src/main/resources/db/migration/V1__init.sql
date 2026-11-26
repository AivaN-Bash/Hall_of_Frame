CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    sort_order INT NOT NULL DEFAULT 0,
    art_seed INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_sort ON categories (sort_order, id);

CREATE TABLE entries (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    title VARCHAR(160) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    release_year INT,
    poster_url TEXT,
    accent_color VARCHAR(7),
    tagline VARCHAR(280),
    rating NUMERIC(3,1),
    tier VARCHAR(1) NOT NULL DEFAULT 'A' CHECK (tier IN ('S', 'A', 'B', 'C')),
    why_hooked TEXT NOT NULL,
    favorite_moment TEXT,
    favorite_quote_or_char TEXT,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    rank_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entries_category_rank ON entries (category_id, rank_order, id);
CREATE INDEX idx_entries_featured_rank ON entries (featured, rank_order, id);
CREATE INDEX idx_entries_created_at ON entries (created_at DESC);

CREATE TABLE tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    slug VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE entry_tags (
    entry_id BIGINT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (entry_id, tag_id)
);

CREATE INDEX idx_entry_tags_tag_id ON entry_tags (tag_id);

CREATE TABLE site_settings (
    id SMALLINT DEFAULT 1 PRIMARY KEY CHECK (id = 1),
    site_name VARCHAR(80) NOT NULL,
    greeting VARCHAR(80) NOT NULL,
    hero_name VARCHAR(80) NOT NULL,
    hero_bio TEXT NOT NULL,
    portrait_url TEXT,
    about_bio TEXT NOT NULL,
    about_purpose TEXT NOT NULL,
    currently_watching_playing TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
