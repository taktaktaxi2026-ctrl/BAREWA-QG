export type ServiceStatusType = 'online' | 'degraded' | 'maintenance' | 'deploying' | 'offline';

export interface BarewaService {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'core' | 'intelligence' | 'social' | 'commerce' | 'mobility' | 'infrastructure';
  status: ServiceStatusType;
  version: string;
  uptimePercent: number;
  lastPingTime: string;
  endpointUrl: string;
  connectionMode: 'REST_API' | 'WEBSOCKET' | 'DIRECT_DB' | 'WEBHOOK';
  activeUsers24h: number;
  requestsPerMinute: number;
  errorRatePercent: number;
  isMaintenance: boolean;
  isEnabled: boolean;
  region: string;
  tags: string[];
}

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface BarewaAlert {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  serviceId: string;
  serviceName: string;
  timestamp: string;
  isResolved: boolean;
  isAcknowledged: boolean;
  sourceIp?: string;
  suggestedAction?: string;
}

export interface SecuritySession {
  id: string;
  adminName: string;
  role: string;
  ipAddress: string;
  location: string;
  device: string;
  loginTime: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface ActivityLog {
  id: string;
  adminName: string;
  role: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  severity: 'normal' | 'sensitive' | 'critical';
  status: 'success' | 'failed' | 'blocked';
}

export type AIProviderId = 'gemini' | 'groq' | 'mistral' | 'ollama_local' | 'deepseek';

export interface AIProvider {
  id: AIProviderId;
  name: string;
  providerType: 'cloud_free' | 'open_source' | 'local_server' | 'hybrid';
  status: 'active' | 'standby' | 'rate_limited' | 'disabled';
  defaultModel: string;
  availableModels: string[];
  latencyMs: number;
  costPer1kTokensCFA: number; // 0 for free tiers
  freeTierRpmLimit: number;
  currentRpm: number;
  isConfigured: boolean;
  isLocalCapable: boolean;
  fallbackPriority: number; // 1 is highest priority
  description: string;
}

export type AIRoutingStrategy = 'free_tier_first' | 'lowest_latency' | 'local_sovereignty' | 'quality_first';

export interface EcosystemEvent {
  id: string;
  timestamp: string;
  sourceService: string;
  targetService: string;
  eventType: string;
  payloadSummary: string;
  status: 'delivered' | 'processing' | 'failed' | 'retrying';
  durationMs: number;
}

export interface ServiceQueue {
  id: string;
  name: string;
  purpose: string;
  pendingCount: number;
  processed24h: number;
  failureRate: number;
  status: 'active' | 'paused' | 'congested';
}

export interface AdministratorAccount {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'secops' | 'ops_engineer' | 'auditor';
  status: 'active' | 'suspended';
  lastLogin: string;
  twoFactorEnabled: boolean;
  allowedIps: string[];
}

export interface SystemSettings {
  ecosystemName: string;
  environment: 'production' | 'staging' | 'development';
  globalMaintenanceMode: boolean;
  sahelLowBandwidthMode: boolean; // Compresses payload & strips rich media for slow 2G/3G
  telemetryIntervalSeconds: number;
  sessionTimeoutMinutes: number;
  alertEmailRecipient: string;
  rateLimitPerMinute: number;
  enforceRls: boolean;
  primaryTimezone: string;
  isDemoMode: boolean;
}
