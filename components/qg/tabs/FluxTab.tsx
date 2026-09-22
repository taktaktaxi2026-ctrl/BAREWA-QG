'use client';

import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  RefreshCw,
  Clock,
  Radio,
  Server,
  Filter,
  CheckCircle,
  Pause,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { EcosystemEvent, ServiceQueue } from '@/types/barewa';

interface FluxTabProps {
  events: EcosystemEvent[];
  queues: ServiceQueue[];
  onToggleQueueStatus: (id: string) => void;
  onPurgeQueue: (id: string) => void;
}

export function FluxTab({
  events,
  queues,
  onToggleQueueStatus,
  onPurgeQueue,
}: FluxTabProps) {
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');

  // Inter-service bridges
  const interServiceBridges = [
    {
      source: 'Barewa Mobility',
      target: 'Barewa Maps',
      flow: 'Géocodage & calcul de matrices de distance',
      protocol: 'REST / SIG',
      volume24h: '34 200 appels',
      status: 'optimal',
    },
    {
      source: 'Barewa Health',
      target: 'Barewa AI',
      flow: 'Prétraitement d aide au diagnostic clinique',
      protocol: 'AI Router',
      volume24h: '4 820 inférences',
      status: 'optimal',
    },
    {
      source: 'Barewa Météo',
      target: 'Passerelles GSM / SMS',
      flow: 'Diffusion d alertes intempéries agriculteurs',
      protocol: 'Queue SMPP / HTTP',
      volume24h: '18 400 SMS',
      status: 'surveillance',
    },
    {
      source: 'Barewa Store',
      target: 'Barewa Mobility',
      flow: 'Affectation automatique des coursiers urbains',
      protocol: 'Webhooks EventBus',
      volume24h: '1 290 courses',
      status: 'optimal',
    },
    {
      source: 'Barewa Académie',
      target: 'Barewa Core Database',
      flow: 'Synchronisation par lots des progressions hors-ligne',
      protocol: 'PostgreSQL Sync',
      volume24h: '9 140 syncs',
      status: 'optimal',
    },
  ];

  const filteredEvents = events.filter((ev) => {
    if (selectedEventFilter === 'all') return true;
    return ev.status === selectedEventFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-amber-500" />
            <h1 className="text-base font-bold text-white uppercase tracking-wide">
              Supervision des Flux & Bus d&apos;Événements Inter-Services
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Télémétrie en temps réel des échanges de données, files d&apos;attente, webhooks et synchronisations hors-ligne du Sahel.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-right">
            <span className="text-slate-500 block text-[10px]">Taux Succès Échanges</span>
            <span className="text-emerald-400 font-bold">99.88%</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-right">
            <span className="text-slate-500 block text-[10px]">Latence Bus Médiane</span>
            <span className="text-amber-400 font-bold">38 ms</span>
          </div>
        </div>
      </div>

      {/* Inter-Service Communication Topology Matrix */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-amber-500" />
            <span>Matrice de Communication Inter-Services (Qui Appelle Qui)</span>
          </h2>
          <span className="text-[10px] text-slate-500 font-mono">Protocole BAREWA CORE EventBus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {interServiceBridges.map((bridge, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
                  <span className="text-amber-400">{bridge.source}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-sky-400">{bridge.target}</span>
                </div>
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                    bridge.status === 'optimal'
                      ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                      : 'bg-amber-950/80 border-amber-800 text-amber-400'
                  }`}
                >
                  {bridge.status}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-snug">{bridge.flow}</p>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/60">
                <span>Protocole : {bridge.protocol}</span>
                <span className="text-slate-300 font-semibold">{bridge.volume24h}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Queues Management & Automated Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Queues (2 Cols) */}
        <div className="lg:col-span-2 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Gestionnaire des Files d&apos;Attente (Message Queues)</span>
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Moteur Asynchrone Redis/Worker</span>
          </div>

          <div className="space-y-2.5">
            {queues.map((q) => (
              <div
                key={q.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{q.name}</span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border ${
                        q.status === 'active'
                          ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                          : 'bg-amber-950/80 border-amber-800 text-amber-300'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{q.purpose}</p>
                  <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-1">
                    <span>
                      En attente : <strong className="text-amber-400">{q.pendingCount}</strong>
                    </span>
                    <span>
                      Traités (24h) : <strong className="text-slate-200">{q.processed24h}</strong>
                    </span>
                    <span>
                      Échecs : <strong className="text-emerald-400">{q.failureRate}%</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onToggleQueueStatus(q.id)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                  >
                    {q.status === 'active' ? (
                      <>
                        <Pause className="w-3 h-3 text-amber-400" />
                        <span>Mettre en pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 text-emerald-400" />
                        <span>Reprendre</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onPurgeQueue(q.id)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors"
                    title="Rejouer les messages échoués"
                  >
                    <RotateCcw className="w-3 h-3 text-sky-400" />
                    <span>Rejouer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automated Background Tasks / Crons */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Tâches Automatisées & Cron
            </h2>
          </div>

          <div className="space-y-2 text-xs">
            {[
              {
                name: 'Snapshot PostgreSQL Supabase',
                schedule: 'Tous les jours à 02:00 UTC',
                status: 'Succès (11/09/2026)',
                duration: '4.2s',
              },
              {
                name: 'Ingestion Satellites Agrométéo',
                schedule: 'Toutes les 3 heures',
                status: 'Succès (il y a 42m)',
                duration: '18.1s',
              },
              {
                name: 'Indexation Sémantique Barewa AI',
                schedule: 'Toutes les 6 heures',
                status: 'En cours (72%)',
                duration: 'En cours',
              },
              {
                name: 'Nettoyage Tokens Sessions Expirées',
                schedule: 'Toutes les heures',
                status: 'Succès',
                duration: '0.4s',
              },
            ].map((task, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1"
              >
                <div className="font-semibold text-slate-200">{task.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{task.schedule}</div>
                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>{task.status}</span>
                  </span>
                  <span className="font-mono text-slate-500">{task.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Event Stream (Audit & Telemetry Log) */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Journal des Événements du Bus en Direct
            </h2>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <Filter className="w-3 h-3 text-slate-400 mr-1" />
            <button
              type="button"
              onClick={() => setSelectedEventFilter('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                selectedEventFilter === 'all'
                  ? 'bg-amber-600 text-slate-950 font-semibold'
                  : 'bg-slate-950 text-slate-400'
              }`}
            >
              Tous
            </button>
            <button
              type="button"
              onClick={() => setSelectedEventFilter('delivered')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                selectedEventFilter === 'delivered'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400'
              }`}
            >
              Délivrés
            </button>
            <button
              type="button"
              onClick={() => setSelectedEventFilter('processing')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                selectedEventFilter === 'processing'
                  ? 'bg-amber-600 text-slate-950 font-semibold'
                  : 'bg-slate-950 text-slate-400'
              }`}
            >
              En cours
            </button>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Horodatage</th>
                <th className="p-3">Source → Cible</th>
                <th className="p-3">Type d&apos;Événement</th>
                <th className="p-3">Détail du Payload</th>
                <th className="p-3">Statut</th>
                <th className="p-3 text-right">Durée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                    {ev.timestamp}
                  </td>
                  <td className="p-3 font-semibold text-slate-200 whitespace-nowrap">
                    <span className="text-amber-400">{ev.sourceService}</span>
                    <span className="text-slate-500 mx-1.5">→</span>
                    <span className="text-sky-400">{ev.targetService}</span>
                  </td>
                  <td className="p-3 font-mono text-amber-300 text-[11px] whitespace-nowrap">
                    {ev.eventType}
                  </td>
                  <td className="p-3 text-slate-300 max-w-xs truncate">{ev.payloadSummary}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                        ev.status === 'delivered'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-right text-emerald-400 text-[11px] whitespace-nowrap">
                    {ev.durationMs} ms
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
