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

// ==========================================
// BAREWA DEV FORCE & BAP (BAREWA AGENT PROTOCOL)
// ==========================================

export type AgentStatus = 'online' | 'busy' | 'degraded' | 'offline' | 'unknown';

export type AgentActivityState =
  | 'idle'
  | 'thinking'
  | 'working'
  | 'waiting'
  | 'approval_requested'
  | 'finished'
  | 'error';

export type AgentRole =
  | 'dev'
  | 'architect'
  | 'qa'
  | 'security'
  | 'database'
  | 'devops'
  | 'product';

export interface BarewaAgent {
  agent_id: string;
  name: string;
  role: AgentRole;
  unit: string;
  status: AgentStatus;
  activityState: AgentActivityState;
  modelUsed: string;
  avatar: string;
  capabilities: string[];
  tools: string[];
  currentMissionId?: string;
  lastActivity: string;
  authorizationLevel: 'L1_OBSERVER' | 'L2_DEVELOPER' | 'L3_MAINTAINER' | 'L4_ADMIN_COCKPIT';
  metrics: {
    tasksCompleted: number;
    successRate: number;
    avgLatencyMs: number;
  };
}

export type ConversationType = 'INDIVIDUAL' | 'TEAM' | 'MISSION';

export interface ChatMessage {
  id: string;
  conversationId?: string;
  senderId: string; // 'user' or agent_id
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  replyToMessageId?: string;
  actionPayload?: {
    type: 'MISSION_PROPOSAL' | 'APPROVAL_REQUEST' | 'CODE_DIFF' | 'TEST_REPORT' | 'SECURITY_ALERT';
    data: Record<string, unknown>;
  };
  requiresApproval?: boolean;
  approvalId?: string;
}

export interface Conversation {
  conversation_id: string;
  title: string;
  type: ConversationType;
  participants: string[];
  applicationConcerned: string;
  mission_id?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'ARCHIVED';
}

export interface DevForceMission {
  mission_id: string;
  title: string;
  objective: string;
  application: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'RESTRICTED';
  status: 'PENDING' | 'IN_PROGRESS' | 'WAITING_APPROVAL' | 'TESTING' | 'DEPLOYING' | 'COMPLETED' | 'BLOCKED';
  assignedAgents: string[];
  constraints: string[];
  progress: number;
  prUrl?: string;
  testResults?: {
    total: number;
    passed: number;
    failed: number;
    coverage: string;
  };
  deploymentStatus?: 'PENDING' | 'STAGING' | 'PRODUCTION';
  conversationId?: string;
  createdAt: string;
  updatedAt?: string;
  finalReport?: string;
}

export interface ApprovalRequest {
  id: string;
  mission_id?: string;
  requesterAgentId: string;
  requesterAgentName: string;
  title: string;
  description: string;
  targetResource: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  proposedDiff?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  decidedAt?: string;
  decidedBy?: string;
  decisionNotes?: string;
  createdAt: string;
}

export interface BAPEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  agentRole?: AgentRole | string;
  eventType:
    | 'HEARTBEAT'
    | 'TASK_STARTED'
    | 'ANALYSIS'
    | 'CODE_GENERATION'
    | 'SCHEMA_CHECK'
    | 'APPROVAL_REQUIRED'
    | 'TEST_RUN'
    | 'PR_OPENED'
    | 'DEPLOYED'
    | 'STATUS_UPDATE'
    | 'ERROR';
  description: string;
  missionId?: string;
  state?: AgentActivityState;
}

export interface BAPProtocolConfig {
  version: string;
  gatewayStatus: 'HEALTHY' | 'DEGRADED' | 'DISCONNECTED';
  primaryAdapter: 'crewai' | 'langgraph' | 'autogen' | 'custom_worker';
  registeredUnits: {
    id: string;
    name: string;
    adapterType: string;
    agentCount: number;
    heartbeatIntervalSec: number;
    status: AgentStatus;
  }[];
  memoryStats: {
    globalEntries: number;
    unitEntries: number;
    agentEntries: number;
    conversationEntries: number;
    missionEntries: number;
    auditEntries: number;
  };
}

