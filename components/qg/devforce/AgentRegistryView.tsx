'use client';

import React, { useState } from 'react';
import {
  Users,
  Cpu,
  Wrench,
  CheckCircle2,
  Clock,
  Shield,
  MessageSquare,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { BarewaAgent, AgentRole, AgentStatus } from '@/types/barewa';

interface AgentRegistryViewProps {
  agents: BarewaAgent[];
  onOpenAgentChat: (agentId: string) => void;
}

export function AgentRegistryView({ agents, onOpenAgentChat }: AgentRegistryViewProps) {
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const filteredAgents = agents.filter((ag) => {
    if (selectedRole === 'ALL') return true;
    return ag.role === selectedRole;
  });

  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case 'online':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ONLINE
          </span>
        );
      case 'busy':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-800 text-amber-400 text-[10px] font-mono flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            BUSY
          </span>
        );
      case 'degraded':
        return (
          <span className="px-2 py-0.5 rounded-full bg-orange-950 border border-orange-800 text-orange-400 text-[10px] font-mono flex items-center gap-1 font-bold">
            DEGRADED
          </span>
        );
      case 'offline':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-400 text-[10px] font-mono flex items-center gap-1 font-bold">
            OFFLINE
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono">
            UNKNOWN
          </span>
        );
    }
  };

  const getActivityBadge = (activity: string) => {
    switch (activity) {
      case 'working':
        return <span className="text-[10px] text-blue-400 font-mono">⚙️ En exécution</span>;
      case 'thinking':
        return <span className="text-[10px] text-amber-400 font-mono">🧠 Réflexion en cours</span>;
      case 'waiting':
        return <span className="text-[10px] text-slate-400 font-mono">⏳ En attente validation</span>;
      case 'approval_requested':
        return <span className="text-[10px] text-red-400 font-mono">⚠️ Approbation requise</span>;
      default:
        return <span className="text-[10px] text-emerald-400 font-mono">🟢 Disponible / Idle</span>;
    }
  };

  const roles = [
    { id: 'ALL', label: 'Tous les Agents' },
    { id: 'dev', label: 'Développeur (DEV)' },
    { id: 'architect', label: 'Architecte' },
    { id: 'database', label: 'Database & RLS' },
    { id: 'qa', label: 'QA & Tests' },
    { id: 'security', label: 'SecOps' },
    { id: 'devops', label: 'DevOps & Cloud' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Bar with Metrics & Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-lg">
            🤖
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif">
              Registre Dynamique des Agents — BAREWA DEV FORCE
            </h3>
            <p className="text-[11px] text-slate-400">
              Unités multi-agents orchestrées via le protocole BAP et connectées aux modèles IA
              interchangeables.
            </p>
          </div>
        </div>

        {/* Role Filters */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedRole === r.id
                  ? 'bg-amber-600 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <div
            key={agent.agent_id}
            className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all shadow-sm"
          >
            <div>
              {/* Agent Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                    {agent.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-semibold">
                        ID: {agent.agent_id}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                        {agent.authorizationLevel}
                      </span>
                    </div>
                  </div>
                </div>

                {getStatusBadge(agent.status)}
              </div>

              {/* Status & Activity */}
              <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 mb-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">État actuel :</span>
                  {getActivityBadge(agent.activityState)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono uppercase">Dernière activité :</span>
                  <span className="text-[10px] text-slate-300 font-mono">{agent.lastActivity}</span>
                </div>
                {agent.currentMissionId && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Mission active :</span>
                    <span className="text-[10px] text-purple-300 font-mono font-bold truncate max-w-[150px]">
                      #{agent.currentMissionId}
                    </span>
                  </div>
                )}
              </div>

              {/* Model & Unit */}
              <div className="space-y-1.5 mb-3 text-xs">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="text-[11px] text-slate-400">Modèle :</span>
                  <span className="text-[11px] font-mono font-medium text-slate-200 truncate">
                    {agent.modelUsed}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="text-[11px] text-slate-400">Unité :</span>
                  <span className="text-[11px] text-slate-300">{agent.unit}</span>
                </div>
              </div>

              {/* Capabilities */}
              <div className="mb-3">
                <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">
                  Capacités clés :
                </p>
                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-300"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="mb-3">
                <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1">
                  Outils & Intégrations :
                </p>
                <div className="flex flex-wrap gap-1">
                  {agent.tools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-amber-950/40 border border-amber-800/60 text-[10px] text-amber-300 font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Metrics & Action Button */}
            <div className="pt-3 border-t border-slate-800 mt-2">
              <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <span className="block text-xs font-bold text-white font-mono">
                    {agent.metrics.tasksCompleted}
                  </span>
                  <span className="text-[9px] text-slate-400">Tâches</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <span className="block text-xs font-bold text-emerald-400 font-mono">
                    {agent.metrics.successRate}%
                  </span>
                  <span className="text-[9px] text-slate-400">Succès</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                  <span className="block text-xs font-bold text-amber-400 font-mono">
                    {agent.metrics.avgLatencyMs}ms
                  </span>
                  <span className="text-[9px] text-slate-400">Latence</span>
                </div>
              </div>

              <button
                onClick={() => onOpenAgentChat(agent.agent_id)}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm group"
              >
                <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>Ouvrir Chat Direct ({agent.name.split(' ')[1] || 'Agent'})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
