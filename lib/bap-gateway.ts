import {
  BarewaAgent,
  DevForceMission,
  Conversation,
  ApprovalRequest,
  BAPEvent,
  ChatMessage,
  AgentRole,
} from '@/types/barewa';

export interface BAPAgentMessageRequest {
  conversationId: string;
  senderId: string;
  senderName: string;
  text: string;
  targetAgentId?: string; // If individual chat
  isTeamWarRoom?: boolean; // If team chat
  missionId?: string;
  applicationConcerned?: string;
}

export interface BAPAgentMessageResponse {
  messages: ChatMessage[];
  eventsGenerated: BAPEvent[];
  newApprovalRequest?: ApprovalRequest;
  missionUpdate?: Partial<DevForceMission>;
}

/**
 * Returns role-specific system prompt guidelines for Barewa Agents
 */
export function getAgentPersonaPrompt(agent: BarewaAgent, mission?: DevForceMission): string {
  const missionContext = mission
    ? `MISSION ACTIVE : ${mission.mission_id} - ${mission.title}
APPLICATION CONCERNÉE : ${mission.application}
OBJECTIF : ${mission.objective}
CONTRAINTES : ${mission.constraints.join('; ')}`
    : 'AUCUNE MISSION SPÉCIFIQUE ASSOCIÉE';

  return `Tu es ${agent.name} (${agent.agent_id}), membre d'élite de BAREWA DEV FORCE.
Rôle : ${agent.role.toUpperCase()}
Modèle assigné : ${agent.modelUsed}
Outils disponibles : ${agent.tools.join(', ')}
Capacités : ${agent.capabilities.join(', ')}
Niveau d'autorisation : ${agent.authorizationLevel}

CONTEXTE ÉCOSYSTÈME BAREWA (Niger & Sahel) :
- BAREWA CORE est le socle souverain partagé.
- ZÉRO régression : ne jamais casser l'existant.
- Budget 0 FCFA : privilégier le native, open source et free-tier.
- Sécurité stricte : Supabase PostgreSQL avec Row Level Security (RLS) obligatoire.
- Réseau sahélien : résistant aux connexions instables 2G/3G, offline-first via PWA IndexedDB.

${missionContext}

Directives de réponse :
- Reste parfaitement dans ton rôle de ${agent.role}.
- Sois technique, précis, concis, orienté action et sécurité.
- Si une opération est sensible (DDL SQL, suppression, accès direct, déploiement), rappelle que l'autorisation QG est requise.`;
}
