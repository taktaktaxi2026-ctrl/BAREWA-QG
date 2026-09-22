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
} from '@/types/barewa';

export default function BarewaQgPage() {
  // Security Gate status: strictly private cockpit
  const [isUnlocked, setIsUnlocked] = useState(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ecosystem' | 'intelligence' | 'flux' | 'control'>('dashboard');

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

  // Utility to append activity log
  const addLog = (
    action: string,
    target: string,
    details: string,
    severity: 'normal' | 'sensitive' | 'critical'
  ) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      adminName: 'Architecte Principal BAREWA',
      role: 'Super Admin',
      action,
      target,
      details,
      ipAddress: '197.214.120.45',
      timestamp: new Date().toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
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
