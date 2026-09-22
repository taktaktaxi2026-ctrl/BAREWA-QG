'use client';

import React, { useState } from 'react';
import {
  Activity,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';
import { BAPEvent, BarewaAgent, AgentActivityState } from '@/types/barewa';

interface LiveOperationsViewProps {
  events: BAPEvent[];
  agents: BarewaAgent[];
  onTriggerSimulatedHeartbeat: () => void;
}

export function LiveOperationsView({
  events,
  agents,
  onTriggerSimulatedHeartbeat,
}: LiveOperationsViewProps) {
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('ALL');

  const filteredEvents = events.filter((ev) => {
    if (selectedAgentFilter === 'ALL') return true;
    return ev.agentId === selectedAgentFilter;
  });

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'TASK_STARTED':
        return (
          <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-400 font-mono text-[10px]">
            DÉMARRAGE TÂCHE
          </span>
        );
      case 'ANALYSIS':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-400 font-mono text-[10px]">
            ANALYSE SYSTÈME
          </span>
        );
      case 'CODE_GENERATION':
        return (
          <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-400 font-mono text-[10px]">
            GÉNÉRATION CODE
          </span>
        );
      case 'SCHEMA_CHECK':
        return (
          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono text-[10px]">
            SCHÉMA & RLS
          </span>
        );
      case 'APPROVAL_REQUIRED':
        return (
          <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-400 font-mono text-[10px] animate-pulse">
            APPROBATION REQUISE
          </span>
        );
      case 'TEST_RUN':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono text-[10px]">
            TESTS UNITAIRES
          </span>
        );
      case 'DEPLOYED':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-[10px]">
            DÉPLOIEMENT
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
            {type}
          </span>
        );
    }
  };

  const getStateIcon = (state: AgentActivityState) => {
    switch (state) {
      case 'working':
        return <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-spin" />;
      case 'thinking':
        return <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />;
      case 'approval_requested':
        return <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />;
      case 'finished':
        return <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />;
      default:
        return <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif">
              Opérations en Direct (Live Supervision Timeline)
            </h3>
            <p className="text-[11px] text-slate-400">
              Flux d&apos;événements BAP en temps réel traçant les décisions, interactions et
              exécutions inter-agents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Agent Filter */}
          <select
            value={selectedAgentFilter}
            onChange={(e) => setSelectedAgentFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none"
          >
            <option value="ALL">Tous les agents ({events.length} logs)</option>
            {agents.map((ag) => (
              <option key={ag.agent_id} value={ag.agent_id}>
                {ag.name} ({ag.role})
              </option>
            ))}
          </select>

          <button
            onClick={onTriggerSimulatedHeartbeat}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Rafraîchir le flux des événements BAP"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            <span>Émettre Heartbeat</span>
          </button>
        </div>
      </div>

      {/* Agents Live Pulse Status Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {agents.map((ag) => (
          <div
            key={ag.agent_id}
            className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5 flex items-center gap-2"
          >
            <div className="text-lg">{ag.avatar}</div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-white block truncate">{ag.name.split(' ')[1] || ag.name}</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {getStateIcon(ag.activityState)}
                <span className="text-[9px] font-mono text-slate-400 uppercase truncate">
                  {ag.activityState}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Chronologie Opérationnelle des Événements BAP</span>
        </h4>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {filteredEvents.map((ev, index) => (
            <div key={ev.id || index} className="relative flex items-start gap-3">
              {/* Timeline Marker */}
              <div className="absolute -left-6 mt-1 w-3 h-3 rounded-full bg-slate-900 border-2 border-amber-500" />

              {/* Event Card */}
              <div className="flex-1 bg-slate-950/70 border border-slate-800/90 rounded-lg p-3 hover:border-slate-700 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{ev.agentName}</span>
                    <span className="text-[10px] font-mono text-amber-400">({ev.agentRole})</span>
                    <span className="text-slate-600">•</span>
                    {getEventBadge(ev.eventType)}
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    {ev.missionId && (
                      <span className="px-1.5 py-0.2 rounded bg-purple-950/80 text-purple-300">
                        #{ev.missionId}
                      </span>
                    )}
                    <span>{ev.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{ev.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
