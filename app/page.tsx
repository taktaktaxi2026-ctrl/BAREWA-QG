'use client';

import React, { useState, useEffect } from 'react';
import { SecurityGate } from '@/components/qg/SecurityGate';
import { TopBar } from '@/components/qg/TopBar';
import { AlertsDrawer } from '@/components/qg/AlertsDrawer';
import { SecurityModal } from '@/components/qg/SecurityModal';
import { AdminModal } from '@/components/qg/AdminModal';

import { DashboardTab } from '@/components/qg/tabs/DashboardTab';
import { EcosystemTab } from '@/components/qg/tabs/EcosystemTab';
import { IntelligenceTab } from '@/components/qg/tabs/IntelligenceTab';
import { FluxTab } from '@/components/qg/tabs/FluxTab';
import { ControlTab } from '@/components/qg/tabs/ControlTab';
import { DevForceTab } from '@/components/qg/tabs/DevForceTab';

import {
  INITIAL_SERVICES,
  INITIAL_ALERTS,
  INITIAL_AI_PROVIDERS,
  INITIAL_EVENTS,
  INITIAL_QUEUES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_SESSIONS,
  INITIAL_ADMINS,
  INITIAL_SETTINGS,
  INITIAL_AGENTS,
  INITIAL_MISSIONS,
  INITIAL_CONVERSATIONS,
  INITIAL_APPROVALS,
  INITIAL_BAP_EVENTS,
  INITIAL_BAP_CONFIG,
} from '@/lib/demo-data';

import {
  BarewaService,
  BarewaAlert,
  AIProvider,
  EcosystemEvent,
  ServiceQueue,
  ActivityLog,
  SecuritySession,
  AdministratorAccount,
  SystemSettings,
  BarewaAgent,
  DevForceMission,
  Conversation,
  ApprovalRequest,
  BAPEvent,
  BAPProtocolConfig,
  ChatMessage,
} from '@/types/barewa';

let globalIdCounter = 5000;
function createId(prefix: string): string {
  globalIdCounter += 1;
  return `${prefix}-${globalIdCounter}`;
}

function getSystemTime(): string {
  return new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function BarewaQgPage() {
  // Security Gate status: strictly private cockpit
  const [isUnlocked, setIsUnlocked] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ecosystem' | 'intelligence' | 'flux' | 'control' | 'devforce'>('dashboard');

  // Top bar command modals
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Core Ecosystem State
  const [services, setServices] = useState<BarewaService[]>(INITIAL_SERVICES);
  const [alerts, setAlerts] = useState<BarewaAlert[]>(INITIAL_ALERTS);
  const [aiProviders, setAiProviders] = useState<AIProvider[]>(INITIAL_AI_PROVIDERS);
  const [events, setEvents] = useState<EcosystemEvent[]>(INITIAL_EVENTS);
  const [queues, setQueues] = useState<ServiceQueue[]>(INITIAL_QUEUES);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [sessions, setSessions] = useState<SecuritySession[]>(INITIAL_SESSIONS);
  const [admins, setAdmins] = useState<AdministratorAccount[]>(INITIAL_ADMINS);
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);

  // BAREWA DEV FORCE & BAP State
  const [agents, setAgents] = useState<BarewaAgent[]>(INITIAL_AGENTS);
  const [missions, setMissions] = useState<DevForceMission[]>(INITIAL_MISSIONS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(INITIAL_APPROVALS);
  const [bapEvents, setBapEvents] = useState<BAPEvent[]>(INITIAL_BAP_EVENTS);
  const [bapConfig, setBapConfig] = useState<BAPProtocolConfig>(INITIAL_BAP_CONFIG);
  const [currentSimStep, setCurrentSimStep] = useState<number>(1);

  // Auto-ping simulation for subtle live heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time subtle request variations
      setServices((prev) =>
        prev.map((s) => {
          if (!s.isEnabled || s.isMaintenance) return s;
          const delta = Math.floor(Math.random() * 5) - 2;
          return {
            ...s,
            requestsPerMinute: Math.max(10, s.requestsPerMinute + delta),
          };
        })
      );
    }, (settings.telemetryIntervalSeconds || 15) * 1000);

    return () => clearInterval(interval);
  }, [settings.telemetryIntervalSeconds]);

  // Handlers for Services
  const handleToggleServiceEnabled = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
    addLog('Bascule Kill-Switch', `Service #${id}`, 'Action manuelle administrateur', 'sensitive');
  };

  const handleToggleServiceMaintenance = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isMaintenance: !s.isMaintenance } : s))
    );
    addLog('Bascule Mode Maintenance', `Service #${id}`, 'Mise à jour état opérationnel', 'normal');
  };

  const handleUpdateService = (updated: BarewaService) => {
    setServices((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    addLog('Configuration Service', updated.name, 'Mise à jour endpoint et paramètres', 'normal');
  };

  const handleAddService = (newService: BarewaService) => {
    setServices((prev) => [newService, ...prev]);
    addLog('Enregistrement Nouveau Service', newService.name, `Code: ${newService.code}`, 'sensitive');
  };

  // Handlers for Alerts
  const handleToggleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isResolved: !a.isResolved } : a))
    );
  };

  const handleToggleAcknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isAcknowledged: !a.isAcknowledged } : a))
    );
  };

  // Handlers for AI Providers
  const handleToggleProviderStatus = (id: string) => {
    setAiProviders((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'active' ? 'standby' : 'active' }
          : p
      )
    );
    addLog('Changement Statut Provider IA', id, 'Modification statut routeur IA', 'sensitive');
  };

  const handleUpdateProviderPriority = (id: string, newPriority: number) => {
    setAiProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, fallbackPriority: newPriority } : p))
    );
    addLog('Priorité Fallback IA', id, `Nouvelle priorité: ${newPriority}`, 'normal');
  };

  // Handlers for Queues
  const handleToggleQueueStatus = (id: string) => {
    setQueues((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, status: q.status === 'active' ? 'paused' : 'active' }
          : q
      )
    );
    addLog('Contrôle Queue Asynchrone', id, 'Modification état file de messages', 'normal');
  };

  const handlePurgeQueue = (id: string) => {
    setQueues((prev) =>
      prev.map((q) => (q.id === id ? { ...q, failureRate: 0.0 } : q))
    );
    addLog('Relance Messages Échoués', id, 'Rejeu des messages d erreur', 'normal');
  };

  // Handlers for Security & Sessions
  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    addLog('Révocation Session', sessionId, 'Session administrateur révoquée', 'critical');
  };

  // Handlers for Admins & Settings
  const handleAddAdmin = (newAdmin: AdministratorAccount) => {
    setAdmins((prev) => [...prev, newAdmin]);
    addLog('Création Compte Administrateur', newAdmin.email, `Rôle: ${newAdmin.role}`, 'critical');
  };

  const handleToggleAdminStatus = (id: string) => {
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' }
          : a
      )
    );
    addLog('Changement Statut Admin', id, 'Suspension ou réactivation de compte', 'critical');
  };

  const handleUpdateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    addLog('Mise à Jour Paramètres QG', 'Paramètres Globaux', 'Mise à jour des règles globales', 'sensitive');
  };

  // ==========================================
  // BAREWA DEV FORCE & BAP HANDLERS
  // ==========================================

  const handleSendMessage = async (
    conversationId: string,
    text: string,
    targetAgentId?: string
  ) => {
    const timestamp = getSystemTime();
    const userMsg: ChatMessage = {
      id: createId('msg'),
      senderId: 'user',
      senderName: 'Architecte Principal (QG)',
      timestamp,
      text,
    };

    // Add user message to conversation immediately
    setConversations((prev) =>
      prev.map((c) =>
        c.conversation_id === conversationId
          ? { ...c, messages: [...c.messages, userMsg], updatedAt: timestamp }
          : c
      )
    );

    // Call /api/bap
    try {
      const res = await fetch('/api/bap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          conversationId,
          targetAgentId,
          message: text,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        const agentMsg: ChatMessage = {
          id: data.reply.id || createId('msg'),
          senderId: data.reply.senderId || targetAgentId || 'dev-001',
          senderName: data.reply.senderName || 'Agent BAREWA DEV FORCE',
          senderAvatar: data.reply.senderAvatar || '🤖',
          senderRole: data.reply.senderRole,
          timestamp: data.reply.timestamp || timestamp,
          text: data.reply.text,
          requiresApproval: data.reply.requiresApproval,
          approvalId: data.reply.approvalId,
          actionPayload: data.reply.actionPayload,
        };

        setConversations((prev) =>
          prev.map((c) =>
            c.conversation_id === conversationId
              ? { ...c, messages: [...c.messages, agentMsg], updatedAt: timestamp }
              : c
          )
        );

        if (data.bapEvent) {
          setBapEvents((prev) => [data.bapEvent, ...prev]);
        }

        if (data.approvalRequest) {
          setApprovals((prev) => [data.approvalRequest, ...prev]);
          addLog(
            'Demande Approbation BAP',
            `Requête #${data.approvalRequest.id}`,
            'Soumission modification sensible',
            'sensitive'
          );
        }
      }
    } catch (err) {
      console.error('Erreur API BAP:', err);
    }
  };

  const handleCreateMissionFromChat = (proposalData: Partial<DevForceMission>) => {
    const newMissionId = createId('MIS');
    const newMission: DevForceMission = {
      mission_id: newMissionId,
      title: proposalData.title || 'Nouvelle Mission DEV FORCE',
      objective:
        proposalData.objective || 'Optimisation technique de l écosystème BAREWA',
      application: proposalData.application || 'Barewa Core',
      priority: proposalData.priority || 'HIGH',
      risk: proposalData.risk || 'MEDIUM',
      status: 'IN_PROGRESS',
      progress: 15,
      assignedAgents: ['dev-001', 'arch-001', 'db-001', 'qa-001'],
      constraints: [
        'Compatibilité PWA & réseau 2G sahélien (<100 Ko payload)',
        'Respect strict RLS Supabase & Zero-Trust',
        'Zéro régression sur BAREWA CORE',
        'Couverture de tests unitaires > 90%',
      ],
      createdAt: getSystemTime(),
    };

    setMissions((prev) => [newMission, ...prev]);

    const newEvent: BAPEvent = {
      id: createId('ev'),
      timestamp: getSystemTime(),
      missionId: newMissionId,
      agentId: 'arch-001',
      agentName: 'Oumar (Architecte)',
      agentRole: 'Architecte',
      eventType: 'TASK_STARTED',
      description: `Nouvelle mission #${newMissionId} démarrée pour ${newMission.application}. Équipe mobilisée.`,
    };
    setBapEvents((prev) => [newEvent, ...prev]);

    addLog(
      'Création Mission DEV FORCE',
      newMission.title,
      `Mission #${newMissionId} assignée à 4 agents`,
      'normal'
    );
  };

  const handleApproveRequest = async (approvalId: string, notes?: string) => {
    const timestamp = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    try {
      await fetch('/api/bap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_approval',
          approvalId,
          decision: 'APPROVED',
          notes: notes || 'Validé et autorisé par l Architecte Principal BAREWA QG',
        }),
      });
    } catch (e) {
      console.error(e);
    }

    setApprovals((prev) =>
      prev.map((a) =>
        a.id === approvalId
          ? {
              ...a,
              status: 'APPROVED',
              decidedAt: timestamp,
              decidedBy: 'Architecte Principal BAREWA QG',
              decisionNotes: notes || 'Validé',
            }
          : a
      )
    );

    setMissions((prev) =>
      prev.map((m) =>
        m.status === 'WAITING_APPROVAL'
          ? { ...m, status: 'IN_PROGRESS', progress: Math.min(85, m.progress + 30) }
          : m
      )
    );

    setAgents((prev) =>
      prev.map((ag) =>
        ag.activityState === 'approval_requested' || ag.activityState === 'waiting'
          ? { ...ag, activityState: 'working', status: 'busy' }
          : ag
      )
    );

    const newEvent: BAPEvent = {
      id: createId('ev'),
      timestamp,
      agentId: 'sec-001',
      agentName: 'Fatima (SecOps)',
      agentRole: 'SecOps',
      eventType: 'STATUS_UPDATE',
      description: `Demande #${approvalId} approuvée par le QG. Verrou de déploiement levé, reprise de l'exécution.`,
    };
    setBapEvents((prev) => [newEvent, ...prev]);

    addLog(
      'Approbation Opération BAP',
      `Requête #${approvalId}`,
      'Validation DDL / Déploiement autorisée',
      'critical'
    );
  };

  const handleRejectRequest = async (approvalId: string, notes?: string) => {
    const timestamp = getSystemTime();
    try {
      await fetch('/api/bap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_approval',
          approvalId,
          decision: 'REJECTED',
          notes: notes || 'Refusé par le QG',
        }),
      });
    } catch (e) {
      console.error(e);
    }

    setApprovals((prev) =>
      prev.map((a) =>
        a.id === approvalId
          ? {
              ...a,
              status: 'REJECTED',
              decidedAt: timestamp,
              decidedBy: 'Architecte Principal BAREWA QG',
              decisionNotes: notes || 'Refusé',
            }
          : a
      )
    );

    const newEvent: BAPEvent = {
      id: createId('ev'),
      timestamp,
      agentId: 'sec-001',
      agentName: 'Fatima (SecOps)',
      agentRole: 'SecOps',
      eventType: 'ERROR',
      description: `Demande #${approvalId} rejetée par le QG. Migration interrompue conformément à la gouvernance.`,
    };
    setBapEvents((prev) => [newEvent, ...prev]);

    addLog(
      'Refus Opération BAP',
      `Requête #${approvalId}`,
      notes || 'Modification rejetée',
      'sensitive'
    );
  };

  const handleTriggerHeartbeat = () => {
    const timestamp = getSystemTime();
    setBapEvents((prev) => [
      {
        id: createId('ev'),
        timestamp,
        agentId: 'bap-gateway',
        agentName: 'Passerelle BAP',
        agentRole: 'Passerelle',
        eventType: 'HEARTBEAT',
        description:
          'Battement de cœur BAP v1.0 synchronisé : 6/6 agents en ligne, CrewAI Adapter opérationnel.',
      },
      ...prev,
    ]);
  };

  const handleRefreshProtocol = () => {
    setBapConfig((prev) => ({
      ...prev,
      memoryStats: {
        ...prev.memoryStats,
        auditEntries: prev.memoryStats.auditEntries + 1,
      },
    }));
    handleTriggerHeartbeat();
  };

  // 13-step Simulation Runner Logic (Section 22)
  const handleRunSimStep = async (step: number) => {
    setCurrentSimStep(step);
    const timestamp = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    switch (step) {
      case 1:
        setActiveTab('devforce');
        break;
      case 2:
        setAgents((prev) =>
          prev.map((a) =>
            a.agent_id === 'dev-001'
              ? { ...a, status: 'busy', activityState: 'thinking' }
              : a
          )
        );
        break;
      case 3:
        await handleSendMessage(
          'conv-dev-individual',
          'Ajoute la réservation express QR Code dans Barewa Taxi.',
          'dev-001'
        );
        break;
      case 4:
        handleCreateMissionFromChat({
          title: 'Implémentation Réservation QR Code — Barewa Mobility',
          application: 'Barewa Mobility',
          objective:
            'Génération de QR code hors-ligne et schéma PostgreSQL RLS pour validation vélo-taxi',
          priority: 'HIGH',
          risk: 'MEDIUM',
        });
        break;
      case 5:
        setConversations((prev) =>
          prev.map((c) =>
            c.type === 'TEAM'
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: createId('msg-sim'),
                      senderId: 'user',
                      senderName: 'Architecte Principal (QG)',
                      timestamp,
                      text: "Mobilisation War Room : démarrage de la mission Réservation QR Code Barewa Mobility.",
                    },
                  ],
                }
              : c
          )
        );
        break;
      case 6:
        setConversations((prev) =>
          prev.map((c) =>
            c.type === 'TEAM'
              ? {
                  ...c,
                  messages: [
                    ...c.messages,
                    {
                      id: createId('msg-sim-arch'),
                      senderId: 'arch-001',
                      senderName: 'Oumar (Architecte)',
                      senderRole: 'Architecte',
                      senderAvatar: '🏛️',
                      timestamp,
                      text: "Architecture validée : découplage propre entre le scanner QR caméra et la synchronisation SQLite PWA.",
                    },
                    {
                      id: createId('msg-sim-db'),
                      senderId: 'db-001',
                      senderName: 'Ibrahim (Database)',
                      senderRole: 'Database',
                      senderAvatar: '🗄️',
                      timestamp,
                      text: "Table `taxi_reservations` prête avec contrainte `CHECK (passenger_count <= 2)` et RLS `auth.uid() = passenger_id`.",
                    },
                  ],
                }
              : c
          )
        );
        break;
      case 7:
        setAgents((prev) =>
          prev.map((a) =>
            ['dev-001', 'db-001'].includes(a.agent_id)
              ? { ...a, status: 'busy', activityState: 'working' }
              : a
          )
        );
        setMissions((prev) =>
          prev.map((m) =>
            m.application === 'Barewa Mobility' ? { ...m, progress: 50 } : m
          )
        );
        break;
      case 8:
        setBapEvents((prev) => [
          {
            id: createId('ev-sim'),
            timestamp,
            agentId: 'dev-001',
            agentName: 'Moussa (DEV)',
            agentRole: 'DEV',
            eventType: 'CODE_GENERATION',
            description:
              'Composants QRCodeScanner.tsx et OfflineTicketCard.tsx créés sans dépendances lourdes (payload 32 Ko).',
          },
          ...prev,
        ]);
        break;
      case 9:
        setAgents((prev) =>
          prev.map((a) =>
            a.agent_id === 'sec-001'
              ? { ...a, activityState: 'approval_requested' }
              : a
          )
        );
        setApprovals((prev) => [
          {
            id: createId('APP-SIM'),
            mission_id: 'MIS-001',
            requesterAgentId: 'sec-001',
            requesterAgentName: 'Fatima (SecOps)',
            title: 'Autorisation DDL & Politique RLS Barewa Mobility',
            description:
              'Création de la table `taxi_reservations` avec index partiels géographiques Niamey et politique de sécurité RLS.',
            targetResource: 'PostgreSQL Supabase (Production)',
            riskLevel: 'HIGH',
            status: 'PENDING',
            proposedDiff: `-- Schema Migration Taxi Reservations
CREATE TABLE IF NOT EXISTS public.taxi_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_id UUID REFERENCES auth.users(id),
  driver_id UUID REFERENCES auth.users(id),
  qr_token TEXT NOT NULL UNIQUE,
  status TEXT CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.taxi_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Drivers and Passengers access" ON public.taxi_reservations
  FOR ALL USING (auth.uid() = passenger_id OR auth.uid() = driver_id);`,
            createdAt: timestamp,
          },
          ...prev,
        ]);
        break;
      case 10:
        if (approvals.length > 0) {
          await handleApproveRequest(
            approvals[0].id,
            'Approuvé lors du scénario de démonstration QG'
          );
        }
        break;
      case 11:
        setMissions((prev) =>
          prev.map((m) =>
            m.application === 'Barewa Mobility' ? { ...m, progress: 85 } : m
          )
        );
        break;
      case 12:
        setMissions((prev) =>
          prev.map((m) =>
            m.application === 'Barewa Mobility'
              ? {
                  ...m,
                  progress: 100,
                  status: 'COMPLETED',
                  testResults: { total: 24, passed: 24, failed: 0, coverage: '94.5%' },
                  finalReport:
                    'Mission exécutée avec succès par BAREWA DEV FORCE. Composant PWA léger (<35 Ko), tests 2G résilients au vert, table PostgreSQL RLS déployée après approbation QG.',
                }
              : m
          )
        );
        break;
      case 13:
        setBapConfig((prev) => ({
          ...prev,
          memoryStats: {
            ...prev.memoryStats,
            missionEntries: prev.memoryStats.missionEntries + 1,
            auditEntries: prev.memoryStats.auditEntries + 1,
          },
        }));
        addLog(
          'Scénario DEV FORCE Achevé',
          'Cycle 13 Étapes',
          'Toutes les étapes validées et archivées dans la mémoire persistante BAP',
          'normal'
        );
        break;
      default:
        break;
    }
  };

  const handleResetSim = () => {
    setCurrentSimStep(1);
    setAgents(INITIAL_AGENTS);
    setMissions(INITIAL_MISSIONS);
    setApprovals(INITIAL_APPROVALS);
    setConversations(INITIAL_CONVERSATIONS);
    setBapEvents(INITIAL_BAP_EVENTS);
  };

  // Utility to append activity log
  const addLog = (
    action: string,
    target: string,
    details: string,
    severity: 'normal' | 'sensitive' | 'critical'
  ) => {
    const newLog: ActivityLog = {
      id: createId('log'),
      adminName: 'Architecte Principal BAREWA',
      role: 'Super Admin',
      action,
      target,
      details,
      ipAddress: '197.214.120.45',
      timestamp: getSystemTime(),
      severity,
      status: 'success',
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // If locked, show SecurityGate
  if (!isUnlocked) {
    return (
      <SecurityGate
        onUnlock={() => setIsUnlocked(true)}
        defaultAdminEmail={settings.alertEmailRecipient || 'taktaktaxi2026@gmail.com'}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Permanent Top Bar with 3 Permanent Commands */}
      <TopBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alerts={alerts}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onLock={() => setIsUnlocked(false)}
        isDemoMode={settings.isDemoMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 pb-20 md:pb-12">
        {activeTab === 'dashboard' && (
          <DashboardTab
            services={services}
            alerts={alerts}
            events={events}
            onNavigateTab={setActiveTab}
            onOpenAlerts={() => setIsAlertsOpen(true)}
          />
        )}

        {activeTab === 'devforce' && (
          <DevForceTab
            agents={agents}
            conversations={conversations}
            missions={missions}
            approvals={approvals}
            events={bapEvents}
            protocolConfig={bapConfig}
            onSendMessage={handleSendMessage}
            onCreateMissionFromChat={handleCreateMissionFromChat}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onTriggerHeartbeat={handleTriggerHeartbeat}
            onRefreshProtocol={handleRefreshProtocol}
            currentSimStep={currentSimStep}
            onRunSimStep={handleRunSimStep}
            onResetSim={handleResetSim}
          />
        )}

        {activeTab === 'ecosystem' && (
          <EcosystemTab
            services={services}
            onToggleServiceEnabled={handleToggleServiceEnabled}
            onToggleServiceMaintenance={handleToggleServiceMaintenance}
            onUpdateService={handleUpdateService}
            onAddService={handleAddService}
          />
        )}

        {activeTab === 'intelligence' && (
          <IntelligenceTab
            providers={aiProviders}
            onToggleProviderStatus={handleToggleProviderStatus}
            onUpdateProviderPriority={handleUpdateProviderPriority}
          />
        )}

        {activeTab === 'flux' && (
          <FluxTab
            events={events}
            queues={queues}
            onToggleQueueStatus={handleToggleQueueStatus}
            onPurgeQueue={handlePurgeQueue}
          />
        )}

        {activeTab === 'control' && (
          <ControlTab
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            admins={admins}
            onAddAdmin={handleAddAdmin}
            onToggleAdminStatus={handleToggleAdminStatus}
            activityLogs={activityLogs}
          />
        )}
      </main>

      {/* 3 Permanent Modals */}
      <AlertsDrawer
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
        onToggleResolve={handleToggleResolveAlert}
        onToggleAcknowledge={handleToggleAcknowledgeAlert}
      />

      <SecurityModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
        sessions={sessions}
        onRevokeSession={handleRevokeSession}
        activityLogs={activityLogs}
        onLockNow={() => {
          setIsSecurityOpen(false);
          setIsUnlocked(false);
        }}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        adminEmail={settings.alertEmailRecipient || 'taktaktaxi2026@gmail.com'}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onLogout={() => {
          setIsAdminOpen(false);
          setIsUnlocked(false);
        }}
      />

      {/* Global Status Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-4 py-2 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1">
        <div className="flex items-center gap-2">
          <span className="font-serif text-slate-300 font-bold">BAREWA QG</span>
          <span>• Centre de Commandement Opérationnel</span>
          <span className="hidden md:inline">• Niamey, République du Niger</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span>PostgreSQL / Supabase RLS : Actif</span>
          <span>•</span>
          <span>AI Router : 0 FCFA Free Tier</span>
          <span>•</span>
          <span className="text-emerald-400">Node SLA: 99.96%</span>
        </div>
      </footer>
    </div>
  );
}
