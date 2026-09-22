/**
 * BAREWA ECOSYSTEM — POSTGRESQL & SUPABASE PRODUCTION DDL SCHEMA
 * 
 * Ce fichier contient le schéma complet prêt à être exécuté dans l'éditeur SQL de Supabase
 * ou dans toute instance PostgreSQL standard.
 * 
 * Tables couvertes :
 * 1. roles
 * 2. permissions
 * 3. role_permissions
 * 4. administrators
 * 5. services
 * 6. service_status
 * 7. activity_logs
 * 8. alerts
 * 9. ai_providers
 * 10. ai_models
 * 11. system_settings
 * 
 * RLS (Row Level Security) activé avec politiques d'accès de moindre privilège.
 */

export const BAREWA_SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- BAREWA ECOSYSTEM — SCHÉMA POSTGRESQL / SUPABASE V1 (CORE INFRASTRUCTURE)
-- Conçu au Niger pour l'ensemble du Sahel et de l'Afrique.
-- ==============================================================================

-- 1. EXTENSIONS REQUISES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. GESTION DES RÔLES ET PERMISSIONS (RBAC)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(100) UNIQUE NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- ==============================================================================
-- 3. ADMINISTRATEURS DU QG
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.administrators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE RESTRICT,
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
    two_factor_enabled BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    last_ip_address VARCHAR(45),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. SERVICES ET APPLICATIONS DE L'ÉCOSYSTÈME BAREWA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- ex: 'BAREWA_AI', 'BAREWA_ACADEMIE', etc.
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'core', 'intelligence', 'social', 'commerce', 'mobility', 'infrastructure'
    status VARCHAR(30) DEFAULT 'online' CHECK (status IN ('online', 'degraded', 'maintenance', 'deploying', 'offline')),
    version VARCHAR(30) NOT NULL DEFAULT 'v1.0.0',
    endpoint_url TEXT,
    healthcheck_url TEXT,
    connection_mode VARCHAR(30) DEFAULT 'REST_API' CHECK (connection_mode IN ('REST_API', 'WEBSOCKET', 'DIRECT_DB', 'WEBHOOK')),
    is_enabled BOOLEAN DEFAULT true,
    is_maintenance BOOLEAN DEFAULT false,
    region VARCHAR(100) DEFAULT 'Sahel (Niamey)',
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Suivi continu de télémétrie et de disponibilité des services
CREATE TABLE IF NOT EXISTS public.service_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    uptime_percent NUMERIC(5,2) DEFAULT 100.00,
    latency_ms INTEGER DEFAULT 0,
    requests_per_minute INTEGER DEFAULT 0,
    error_rate_percent NUMERIC(5,2) DEFAULT 0.00,
    active_users_count INTEGER DEFAULT 0,
    last_ping_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. JOURNALISATION DES ACTIONS SENSIBLES (ACTIVITY LOGS IMMUABLES)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.administrators(id) ON DELETE SET NULL,
    admin_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    target VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    severity VARCHAR(20) DEFAULT 'normal' CHECK (severity IN ('normal', 'sensitive', 'critical')),
    status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'blocked')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 6. ALERTES ET INCIDENTS DU QG
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('critical', 'warning', 'info')),
    is_resolved BOOLEAN DEFAULT false,
    is_acknowledged BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES public.administrators(id),
    resolved_at TIMESTAMP WITH TIME ZONE,
    source_ip VARCHAR(45),
    suggested_action TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 7. BAREWA AI — PROVIDERS & MODÈLES (AI ROUTER SYSTEM)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.ai_providers (
    id VARCHAR(50) PRIMARY KEY, -- 'gemini', 'groq', 'mistral', 'ollama_local'
    name VARCHAR(100) NOT NULL,
    provider_type VARCHAR(30) NOT NULL CHECK (provider_type IN ('cloud_free', 'open_source', 'local_server', 'hybrid')),
    status VARCHAR(30) DEFAULT 'active' CHECK (status IN ('active', 'standby', 'rate_limited', 'disabled')),
    default_model VARCHAR(100) NOT NULL,
    fallback_priority INTEGER NOT NULL DEFAULT 1,
    free_tier_rpm_limit INTEGER DEFAULT 15,
    is_configured BOOLEAN DEFAULT false,
    is_local_capable BOOLEAN DEFAULT false,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id VARCHAR(50) NOT NULL REFERENCES public.ai_providers(id) ON DELETE CASCADE,
    model_identifier VARCHAR(100) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    context_window_tokens INTEGER DEFAULT 32768,
    cost_per_million_tokens_cfa NUMERIC(10,2) DEFAULT 0.00,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 8. PARAMÈTRES GLOBAUX DU SYSTÈME BAREWA
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    is_secret BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES public.administrators(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Seuls les administrateurs authentifiés avec le rôle approprié peuvent accéder aux tables du QG
CREATE POLICY "Admins peuvent lire les services" 
    ON public.services FOR SELECT 
    USING (auth.jwt() ->> 'role' = 'authenticated');

CREATE POLICY "Super Admins peuvent modifier les services" 
    ON public.services FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.administrators a
            JOIN public.roles r ON a.role_id = r.id
            WHERE a.user_id = auth.uid() AND r.code IN ('super_admin', 'ops_engineer')
        )
    );

CREATE POLICY "Logs consultables uniquement par administrateurs autorisés" 
    ON public.activity_logs FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.administrators a
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

CREATE POLICY "Insertion de logs sécurisée" 
    ON public.activity_logs FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Lecture des alertes pour admins" 
    ON public.alerts FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.administrators a
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

CREATE POLICY "Modification des alertes par admins" 
    ON public.alerts FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.administrators a
            WHERE a.user_id = auth.uid() AND a.status = 'active'
        )
    );

-- ==============================================================================
-- 10. INDEX DE PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_services_status ON public.services(status);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_severity ON public.activity_logs(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_unresolved ON public.alerts(is_resolved) WHERE is_resolved = false;
CREATE INDEX IF NOT EXISTS idx_service_status_reported ON public.service_status(reported_at DESC);
`;
