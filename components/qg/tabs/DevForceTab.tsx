'use client';

import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  Target,
  Activity,
  Shield,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  BarewaAgent,
  Conversation,
  DevForceMission,
  ApprovalRequest,
  BAPEvent,
  BAPProtocolConfig,
} from '@/types/barewa';
import { AgentChatView } from '@/components/qg/devforce/AgentChatView';
import { AgentRegistryView } from '@/components/qg/devforce/AgentRegistryView';
import { MissionsView } from '@/components/qg/devforce/MissionsView';
import { LiveOperationsView } from '@/components/qg/devforce/LiveOperationsView';
import { ApprovalCenterView } from '@/components/qg/devforce/ApprovalCenterView';
import { BAPProtocolView } from '@/components/qg/devforce/BAPProtocolView';
import { SimulationRunnerModal } from '@/components/qg/devforce/SimulationRunnerModal';

interface DevForceTabProps {
  agents: BarewaAgent[];
  conversations: Conversation[];
  missions: DevForceMission[];
  approvals: ApprovalRequest[];
  events: BAPEvent[];
  protocolConfig: BAPProtocolConfig;
  onSendMessage: (conversationId: string, text: string, targetAgentId?: string) => Promise<void>;
  onCreateMissionFromChat: (proposalData: Partial<DevForceMission>) => void;
  onApproveRequest: (approvalId: string, notes?: string) => Promise<void>;
  onRejectRequest: (approvalId: string, notes?: string) => Promise<void>;
  onTriggerHeartbeat: () => void;
  onRefreshProtocol: () => void;
  currentSimStep: number;
  onRunSimStep: (step: number) => Promise<void>;
  onResetSim: () => void;
}

export function DevForceTab({
  agents,
  conversations,
  missions,
  approvals,
  events,
  protocolConfig,
  onSendMessage,
  onCreateMissionFromChat,
  onApproveRequest,
  onRejectRequest,
  onTriggerHeartbeat,
  onRefreshProtocol,
  currentSimStep,
  onRunSimStep,
  onResetSim,
}: DevForceTabProps) {
  const [subTab, setSubTab] = useState<'chat' | 'agents' | 'missions' | 'live' | 'approvals' | 'protocol'>('chat');
  const [showSimModal, setShowSimModal] = useState(false);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'PENDING').length;
  const activeMissionsCount = missions.filter((m) => m.status === 'IN_PROGRESS').length;

  interface SubNavItem {
    id: 'chat' | 'agents' | 'missions' | 'live' | 'approvals' | 'protocol';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }

  const subNavItems: SubNavItem[] = [
    { id: 'chat', label: 'Command & Chat', icon: MessageSquare, badge: `${conversations.length}` },
    { id: 'agents', label: 'Registre Agents', icon: Users, badge: `${agents.length}` },
    { id: 'missions', label: 'Missions & Tâches', icon: Target, badge: `${activeMissionsCount}` },
    { id: 'live', label: 'Opérations Directes', icon: Activity, badge: 'Live' },
    {
      id: 'approvals',
      label: 'Approbation QG',
      icon: Shield,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount}` : undefined,
      badgeColor: 'bg-red-600 text-white',
    },
    { id: 'protocol', label: 'Protocole BAP', icon: Layers },
  ];

  const handleSelectAgentChat = (agentId: string) => {
    setSubTab('chat');
    // Finds or switches to individual conversation
  };

  const handleOpenWarRoom = () => {
    setSubTab('chat');
  };

  const handleOpenApproval = (approvalId: string) => {
    setSubTab('approvals');
  };

  return (
    <div className="space-y-4">
      {/* Dev Force Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white text-xl font-bold shadow-md border border-amber-500/30">
            ⚔️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white font-serif tracking-tight">
                BAREWA DEV FORCE
              </h2>
              <span className="px-2 py-0.5 rounded bg-red-950 border border-red-700/80 text-red-300 font-mono text-[10px] font-bold">
                UNITÉ MULTI-AGENTS
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                CrewAI Adapter v0.102 (BAP)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-normal">
              Flotte autonome d&apos;ingénierie et de maintenance : supervision en direct, dialogues
              individuels, War Room collaborative et validation sous contrôle strict du QG.
            </p>
          </div>
        </div>

        {/* Quick Simulation CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimModal(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Scénario Guidé (13 Étapes)</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-950/20 text-[10px] font-mono">
              {currentSimStep}/13
            </span>
          </button>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
        {subNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = subTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSubTab(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    item.badgeColor ||
                    (isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Sub Views Switch */}
      {subTab === 'chat' && (
        <AgentChatView
          agents={agents}
          conversations={conversations}
          missions={missions}
          approvals={approvals}
          onSendMessage={onSendMessage}
          onCreateMissionFromChat={onCreateMissionFromChat}
          onOpenApproval={handleOpenApproval}
          onSwitchToWarRoom={handleOpenWarRoom}
          onSelectAgentChat={handleSelectAgentChat}
        />
      )}

      {subTab === 'agents' && (
        <AgentRegistryView agents={agents} onOpenAgentChat={handleSelectAgentChat} />
      )}

      {subTab === 'missions' && (
        <MissionsView
          missions={missions}
          agents={agents}
          onOpenWarRoomForMission={handleOpenWarRoom}
          onCreateMission={onCreateMissionFromChat}
        />
      )}

      {subTab === 'live' && (
        <LiveOperationsView
          events={events}
          agents={agents}
          onTriggerSimulatedHeartbeat={onTriggerHeartbeat}
        />
      )}

      {subTab === 'approvals' && (
        <ApprovalCenterView
          approvals={approvals}
          onApprove={onApproveRequest}
          onReject={onRejectRequest}
        />
      )}

      {subTab === 'protocol' && (
        <BAPProtocolView config={protocolConfig} onRefreshConfig={onRefreshProtocol} />
      )}

      {/* Simulation Runner Modal */}
      <SimulationRunnerModal
        isOpen={showSimModal}
        onClose={() => setShowSimModal(false)}
        currentStep={currentSimStep}
        onRunStep={onRunSimStep}
        onResetSimulation={onResetSim}
      />
    </div>
  );
}
