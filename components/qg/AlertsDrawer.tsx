'use client';

import React, { useState } from 'react';
import { X, AlertOctagon, AlertTriangle, Info, CheckCircle2, ShieldAlert, Filter } from 'lucide-react';
import { BarewaAlert, AlertSeverity } from '@/types/barewa';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: BarewaAlert[];
  onToggleResolve: (id: string) => void;
  onToggleAcknowledge: (id: string) => void;
}

export function AlertsDrawer({
  isOpen,
  onClose,
  alerts,
  onToggleResolve,
  onToggleAcknowledge,
}: AlertsDrawerProps) {
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'critical'>('unresolved');

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'unresolved') return !a.isResolved;
    if (filter === 'critical') return a.severity === 'critical';
    return true;
  });

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-400 text-[10px] font-mono font-semibold flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> CRITIQUE
          </span>
        );
      case 'warning':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-300 text-[10px] font-mono font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> AVERTISSEMENT
          </span>
        );
      case 'info':
        return (
          <span className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-sky-300 text-[10px] font-mono font-semibold flex items-center gap-1">
            <Info className="w-3 h-3" /> INFORMATION
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950/60 border border-red-800/80 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Centre d&apos;Alertes QG</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                  {alerts.length} au registre
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Incidents, seuils de quotas et sécurité écosystème</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <button
              type="button"
              onClick={() => setFilter('unresolved')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filter === 'unresolved'
                  ? 'bg-amber-600 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Non résolues ({alerts.filter((a) => !a.isResolved).length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('critical')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filter === 'critical'
                  ? 'bg-red-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Critiques ({alerts.filter((a) => a.severity === 'critical').length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                filter === 'all'
                  ? 'bg-slate-800 text-slate-200 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Toutes ({alerts.length})
            </button>
          </div>
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <div className="text-sm font-semibold text-slate-200">Aucune alerte active dans cette vue</div>
              <div className="text-xs text-slate-500 mt-1">Tous les signaux et services Barewa sont sous contrôle.</div>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  alert.isResolved
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                    : alert.severity === 'critical'
                    ? 'bg-red-950/20 border-red-900/60 shadow-lg'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(alert.severity)}
                    <span className="text-[11px] font-mono text-slate-400">
                      [{alert.serviceName}]
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{alert.timestamp}</span>
                </div>

                <h3 className="text-xs font-semibold text-white mb-1">{alert.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">{alert.message}</p>

                {alert.suggestedAction && (
                  <div className="p-2 rounded bg-slate-950/80 border border-slate-800/80 text-[11px] text-amber-200/90 mb-3">
                    <strong className="text-amber-400">Recommandation QG : </strong>
                    {alert.suggestedAction}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px]">
                  <div className="text-slate-400 font-mono text-[10px]">
                    {alert.sourceIp ? `Origine: ${alert.sourceIp}` : 'Événement Système Interne'}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleAcknowledge(alert.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                        alert.isAcknowledged
                          ? 'border-emerald-800/60 bg-emerald-950/40 text-emerald-300'
                          : 'border-slate-700 bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {alert.isAcknowledged ? '✓ Pris en compte' : 'Prendre en compte'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleResolve(alert.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                        alert.isResolved
                          ? 'border-slate-800 text-slate-500 hover:text-slate-300'
                          : 'border-amber-700/60 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50'
                      }`}
                    >
                      {alert.isResolved ? 'Rouvrir' : 'Marquer Résolu'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-center text-[10px] text-slate-500">
          Les alertes critiques déclenchent un basculement automatique du routeur IA ou des passerelles réseau.
        </div>
      </div>
    </div>
  );
}
