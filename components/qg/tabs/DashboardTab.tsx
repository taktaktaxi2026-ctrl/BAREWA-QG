'use client';

import React from 'react';
import {
  Activity,
  Users,
  Layers,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Server,
  Zap,
  Radio,
  ArrowUpRight,
  Globe,
  RefreshCw,
  Coins,
} from 'lucide-react';
import { BarewaService, BarewaAlert, EcosystemEvent } from '@/types/barewa';

interface DashboardTabProps {
  services: BarewaService[];
  alerts: BarewaAlert[];
  events: EcosystemEvent[];
  onNavigateTab: (tab: 'ecosystem' | 'intelligence' | 'flux' | 'control' | 'devforce') => void;
  onOpenAlerts: () => void;
}

export function DashboardTab({
  services,
  alerts,
  events,
  onNavigateTab,
  onOpenAlerts,
}: DashboardTabProps) {
  const onlineServicesCount = services.filter((s) => s.status === 'online').length;
  const totalUsers = services.reduce((acc, s) => acc + s.activeUsers24h, 0);
  const totalRpm = services.reduce((acc, s) => acc + s.requestsPerMinute, 0);
  const avgUptime = (
    services.reduce((acc, s) => acc + s.uptimePercent, 0) / services.length
  ).toFixed(2);
  const unresolvedAlerts = alerts.filter((a) => !a.isResolved);

  // Geographic traffic distribution (Niger & Sahel)
  const trafficByCountry = [
    { country: 'Niger (Niamey, Maradi, Zinder, Tahoua)', percent: 68, active: true },
    { country: 'Mali (Bamako, Gao)', percent: 14, active: true },
    { country: 'Burkina Faso (Ouaga, Bobo)', percent: 11, active: true },
    { country: 'Sénégal & Tchad', percent: 4, active: true },
    { country: 'Diaspora Sahélienne', percent: 3, active: true },
  ];

  return (
    <div className="space-y-4">
      {/* Top Banner: Status & Mission Statement */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950/90 border border-emerald-800 text-emerald-300 font-mono text-[10px] font-bold tracking-wide uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ÉCOSYSTÈME NORMAL — OPÉRATIONNEL
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300 font-mono">Infrastructure Souveraine du Sahel</span>
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Supervision Globale de l&apos;Écosystème BAREWA
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Noyau BAREWA CORE opérant au Niger et au Sahel. Visualisation en temps réel de la charge,
            des services micro-frontends et de la couche d&apos;intelligence artificielle.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Budget Utilisé</div>
            <div className="text-sm font-bold font-mono text-amber-400 flex items-center justify-end gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>0 FCFA (Free Tier)</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('ecosystem')}
            className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Gérer l&apos;Écosystème</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DEV FORCE Spotlight Banner */}
      <div className="p-3 sm:p-3.5 rounded-xl bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/40 border border-red-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center font-bold text-base">
            ⚔️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-serif">
                Unité Autonome BAREWA DEV FORCE & Passerelle BAP
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-[9px] font-mono">
                6/6 Agents Prêts
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Command Center multi-agents activé : Chat direct, War Room collaborative, Supervision live et Approbation QG.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('devforce')}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
        >
          <span>Accéder au Command Center DEV FORCE</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Primary KPI Grid (6 Dense Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {/* KPI 1: Active Services */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Services</span>
            <Layers className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {onlineServicesCount} / {services.length}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>100% connectés</span>
          </div>
        </div>

        {/* KPI 2: Total Active Users */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Utilisateurs (24h)</span>
            <Users className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {totalUsers.toLocaleString('fr-FR')}
          </div>
          <div className="text-[10px] text-sky-400 flex items-center gap-1 mt-1 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% cette sem.</span>
          </div>
        </div>

        {/* KPI 3: Requests / Minute */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Débit Trafic</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {totalRpm}{' '}
            <span className="text-[11px] font-normal text-slate-400">req/min</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Pic max : 1 450 RPM
          </div>
        </div>

        {/* KPI 4: Global Availability */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Disponibilité SLA</span>
            <Server className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {avgUptime}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Sur 30 jours glissants
          </div>
        </div>

        {/* KPI 5: Error Rate */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Taux d&apos;Erreurs</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            0.04%
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">
            Bien sous le seuil 1%
          </div>
        </div>

        {/* KPI 6: Active Alerts */}
        <div
          onClick={onOpenAlerts}
          className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-600/70 flex flex-col justify-between cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Alertes Actives</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {unresolvedAlerts.length}
          </div>
          <div className="text-[10px] text-amber-300 font-mono mt-1 flex items-center justify-between">
            <span>Consulter le registre</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Bloomberg Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Column 1 & 2: Real-time Ecosystem Matrix & Traffic Chart */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ecosystem Real-time Service Status Strip */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-500" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Matrice des Services BAREWA en Temps Réel
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('ecosystem')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <span>Voir le catalogue complet</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          svc.status === 'online'
                            ? 'bg-emerald-400'
                            : svc.status === 'degraded'
                            ? 'bg-amber-400'
                            : 'bg-red-400'
                        }`}
                      />
                      <span className="font-semibold text-xs text-slate-100">{svc.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{svc.version}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {svc.region} • Ping : {svc.lastPingTime}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      {svc.uptimePercent}%
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {svc.requestsPerMinute} req/m
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Density & Load Simulation Curve */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Courbe de Charge & Trafic Sahélien (24h)
                </h2>
                <p className="text-[11px] text-slate-400">
                  Pics d&apos;activité observés à 08h00 (début marchés) et 19h00 (retours domicile Niamey/Zinder)
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                Agrégation 1h
              </span>
            </div>

            {/* High-density SVG Sparkline Chart */}
            <div className="h-36 w-full bg-slate-950/80 border border-slate-800/80 rounded-lg p-2 flex flex-col justify-between">
              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                <span>1 200 RPM</span>
                <span className="text-amber-400">Moyenne : 840 RPM</span>
                <span>0 RPM</span>
              </div>

              <svg className="w-full h-20 overflow-visible" viewBox="0 0 500 80" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d97706" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area */}
                <path
                  d="M 0,60 Q 50,45 100,55 T 200,20 T 300,35 T 400,15 T 500,28 L 500,80 L 0,80 Z"
                  fill="url(#trafficGradient)"
                />
                {/* Line */}
                <path
                  d="M 0,60 Q 50,45 100,55 T 200,20 T 300,35 T 400,15 T 500,28"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.5"
                />
              </svg>

              <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>Maintenant (Niamey)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Geographic Distribution & Live Event Feed */}
        <div className="space-y-4">
          {/* Geographic Breakdown */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-sky-400" />
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Répartition Géographique du Trafic
              </h2>
            </div>

            <div className="space-y-2.5 text-xs">
              {trafficByCountry.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-300 font-medium truncate">{item.country}</span>
                    <span className="font-mono text-amber-400 font-semibold">{item.percent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400">
              Passerelle principale : PoP Niamey Telecom & Points de présence sahéliens.
            </div>
          </div>

          {/* Live Ecosystem Events (Recent Stream) */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Flux d&apos;Événements Récents
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('flux')}
                className="text-[11px] text-amber-400 hover:text-amber-300"
              >
                Tout voir
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {events.slice(0, 5).map((ev) => (
                <div
                  key={ev.id}
                  className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-amber-400">
                      {ev.sourceService} → {ev.targetService}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{ev.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-tight line-clamp-2">
                    {ev.payloadSummary}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span className="font-mono text-[9px] px-1 rounded bg-slate-800 text-slate-300">
                      {ev.eventType}
                    </span>
                    <span className="text-emerald-400 font-mono">{ev.durationMs}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
