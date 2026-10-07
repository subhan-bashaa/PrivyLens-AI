-- ====================================================================
-- PrivyLens AI — Relational Schema for Neon PostgreSQL
-- ====================================================================

-- Enable pgcrypto / uuid-ossp for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    auth_provider VARCHAR(50) DEFAULT 'local',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER PROFILES TABLE (Role, Privacy Persona, Device)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'general', -- 'student', 'parent', 'employee', 'business', 'general'
    device_type VARCHAR(50) DEFAULT 'personal', -- 'personal', 'work'
    privacy_preference JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. POLICIES TABLE (Root tracked policies)
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    website_url TEXT,
    policy_url TEXT NOT NULL,
    source_type VARCHAR(50) DEFAULT 'url', -- 'url', 'pdf', 'manual'
    current_version_id UUID,
    monitoring_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. POLICY VERSIONS TABLE (Immutable historical revisions)
CREATE TABLE IF NOT EXISTS policy_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    version_number INT NOT NULL DEFAULT 1,
    content_hash VARCHAR(64) NOT NULL,
    extracted_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Circular foreign key hookup for current_version_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_policies_current_version'
    ) THEN
        ALTER TABLE policies 
        ADD CONSTRAINT fk_policies_current_version 
        FOREIGN KEY (current_version_id) REFERENCES policy_versions(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 5. POLICY ANALYSIS TABLE (Deterministic scores & LLM insights)
CREATE TABLE IF NOT EXISTS policy_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_version_id UUID NOT NULL UNIQUE REFERENCES policy_versions(id) ON DELETE CASCADE,
    overall_score NUMERIC(4, 2) NOT NULL DEFAULT 0.00, -- 0.00 to 10.00
    risk_level VARCHAR(50) NOT NULL DEFAULT 'Moderate', -- 'Low', 'Moderate', 'High', 'Very High'
    summary TEXT,
    data_collection JSONB DEFAULT '{}',
    data_sharing JSONB DEFAULT '{}',
    tracking JSONB DEFAULT '{}',
    retention JSONB DEFAULT '{}',
    user_rights JSONB DEFAULT '[]',
    security JSONB DEFAULT '[]',
    red_flags JSONB DEFAULT '[]',
    positive_findings JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    category_scores JSONB DEFAULT '{}',
    reference_mappings JSONB DEFAULT '[]',
    persona_explanations JSONB DEFAULT '{}',
    evidence_records JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. MONITORING TABLE (Automated cron check schedules)
CREATE TABLE IF NOT EXISTS monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id UUID NOT NULL UNIQUE REFERENCES policies(id) ON DELETE CASCADE,
    frequency VARCHAR(50) DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
    enabled BOOLEAN DEFAULT true,
    last_checked TIMESTAMPTZ,
    last_changed TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. ALERTS TABLE (User notifications for policy drift)
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    policy_id UUID REFERENCES policies(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- 'policy_changed', 'risk_increased', 'new_third_party'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. REPORTS TABLE (Exported compliance summaries)
CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    report_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. CHAT SESSIONS TABLE (Conversational RAG tracking)
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. USER SETTINGS TABLE (Notifications, theme, preferences)
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    monitoring_notifications BOOLEAN DEFAULT true,
    theme VARCHAR(20) DEFAULT 'dark',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_policies_user_id ON policies(user_id);
CREATE INDEX IF NOT EXISTS idx_policy_versions_policy_id ON policy_versions(policy_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_read ON alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_monitoring_enabled ON monitoring(enabled);

-- 11. PASSWORD RESET OTPS TABLE (4-Digit Verification Codes)
CREATE TABLE IF NOT EXISTS password_reset_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    consumed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_reset_otps_email ON password_reset_otps(email);

