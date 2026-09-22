'use client';

import React from 'react';
import {
  Layers,
  Cpu,
  Database,
  Shield,
  Activity,
  HardDrive,
  GitBranch,
  RefreshCw,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { BAPProtocolConfig } from '@/types/barewa';

interface BAPProtocolViewProps {
  config: BAPProtocolConfig;
  onRefreshConfig: () => void;
}

export function BAPProtocolView({ config, onRefreshConfig }: BAPProtocolViewProps) {
  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-lg">
            🧠
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif">
              Protocole BAP (Barewa Agent Protocol) & Système de Mémoire
            </h3>
            <p className="text-[11px] text-slate-400">
              Couche d&apos;interopérabilité découplée garantissant l&apos;indépendance totale
              envers CrewAI et tout framework multi-agents tiers.
            </p>
          </div>
        </div>

        <button
          onClick={onRefreshConfig}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
          <span>Vérifier la Passerelle</span>
        </button>
      </div>

      {/* Architecture Decoupling Visualizer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-amber-500" />
          <span>Architecture de Découplage BAP (Adapter Pattern)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/80">
            <span className="text-[10px] font-mono text-amber-400 font-bold block mb-1">Étage 1</span>
            <h5 className="font-bold text-white">BAREWA QG</h5>
            <p className="text-[10px] text-slate-400 mt-1">Cockpit de supervision & autorité</p>
          </div>

          <div className="flex items-center justify-center text-slate-600 font-mono text-lg">
            ↓
          </div>

          <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/80">
            <span className="text-[10px] font-mono text-blue-400 font-bold block mb-1">Étage 2</span>
            <h5 className="font-bold text-white">BAP & Gateway</h5>
            <p className="text-[10px] text-slate-400 mt-1">Protocole générique & API REST/WS</p>
          </div>

          <div className="flex items-center justify-center text-slate-600 font-mono text-lg">
            ↓
          </div>

          <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-800/80">
            <span className="text-[10px] font-mono text-purple-400 font-bold block mb-1">
              Étage 3 (Adaptateur)
            </span>
            <h5 className="font-bold text-white">CrewAI Adapter</h5>
            <p className="text-[10px] text-slate-400 mt-1">
              Interchangeable (LangGraph / AutoGen ready)
            </p>
          </div>
        </div>

        <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
          <strong className="text-amber-400">Règle d&apos;indépendance BAREWA : </strong>
          Le QG ne communique jamais directement avec le SDK de CrewAI. Toutes les instructions
          (missions, conversations, validations, télémétrie) sont encapsulées dans des structures
          BAP standardisées. Si CrewAI est remplacé ultérieurement, seul l&apos;adaptateur d&apos;unité
          est mis à jour.
        </div>
      </div>

      {/* Memory Subsystem Explorer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Global & Unit Memory */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-mono font-bold text-white uppercase">
              Mémoire Globale & Unités
            </h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Règles BAREWA CORE & RLS</span>
              <span className="font-mono text-emerald-400 font-bold">
                {config.memoryStats.globalEntries} entrées
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Contexte Flotte DEV FORCE</span>
              <span className="font-mono text-blue-400 font-bold">
                {config.memoryStats.unitEntries} entrées
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal mt-1">
              Partagée entre tous les agents pour garantir la cohérence architecturale.
            </p>
          </div>
        </div>

        {/* Agent & Conversation Memory */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-mono font-bold text-white uppercase">
              Mémoire Agents & Dialogues
            </h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Profils & Outils Agents</span>
              <span className="font-mono text-amber-400 font-bold">
                {config.memoryStats.agentEntries} entrées
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Historique Salons & War Room</span>
              <span className="font-mono text-purple-400 font-bold">
                {config.memoryStats.conversationEntries} fils
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal mt-1">
              Chaque agent conserve l&apos;historique de ses analyses et de ses interactions
              passées.
            </p>
          </div>
        </div>

        {/* Mission & Audit Memory */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-mono font-bold text-white uppercase">
              Mémoire Missions & Audit
            </h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Archives des Missions</span>
              <span className="font-mono text-purple-400 font-bold">
                {config.memoryStats.missionEntries} missions
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-300">Journal d&apos;Audit Sécurisé</span>
              <span className="font-mono text-emerald-400 font-bold">
                {config.memoryStats.auditEntries} logs
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal mt-1">
              Traçabilité immuable des validations et approbations de l&apos;Architecte QG.
            </p>
          </div>
        </div>
      </div>

      {/* Registered Units */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
          Unités Multi-Agents Enregistrées
        </h4>
        <div className="space-y-2">
          {config.registeredUnits.map((u) => (
            <div
              key={u.id}
              className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div>
                <span className="font-bold text-white">{u.name}</span>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                  <span>Adaptateur : {u.adapterType}</span>
                  <span>•</span>
                  <span>{u.agentCount} agents</span>
                  <span>•</span>
                  <span>Heartbeat : {u.heartbeatIntervalSec}s</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                CONNECTÉ AU PROTOCOLE BAP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
