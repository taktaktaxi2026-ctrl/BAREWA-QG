'use client';

import React from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Smartphone,
  Globe,
  Database,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { SecuritySession, ActivityLog } from '@/types/barewa';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SecuritySession[];
  onRevokeSession: (id: string) => void;
  activityLogs: ActivityLog[];
  onLockNow: () => void;
}

export function SecurityModal({
  isOpen,
  onClose,
  sessions,
  onRevokeSession,
  activityLogs,
  onLockNow,
}: SecurityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Centre de Sécurité BAREWA QG</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-[10px] text-emerald-300 font-mono">
                  SCORE : 94/100 (GRADE A)
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Gouvernance d&apos;accès, sessions d&apos;administration et intégrité RLS
              </p>
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

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
          {/* Posture Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>PostgreSQL RLS</span>
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>11/11 Tables Protégées</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Isolation stricte entre services et public.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>Protection API Keys</span>
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>100% Côté Serveur</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Zéro secret exposé dans le code frontend.
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span>Pare-feu Réseau Sahel</span>
                <Globe className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Rate Limiting Actif</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Filtrage anti-bruteforce opérationnel.
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Sessions Administrateur Actives ({sessions.length})</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Inactivité max : 30 min</span>
            </div>

            <div className="space-y-2">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                    sess.isCurrent
                      ? 'bg-amber-950/20 border-amber-800/60'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{sess.adminName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-amber-300 font-mono">
                        {sess.role}
                      </span>
                      {sess.isCurrent && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800 text-[9px] text-emerald-300 font-mono font-bold">
                          POSTE COURANT
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{sess.ipAddress}</div>
                    <div className="text-[10px] text-slate-500">
                      {sess.device} • {sess.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Actif : {sess.lastActive}
                    </span>
                    {!sess.isCurrent && (
                      <button
                        type="button"
                        onClick={() => onRevokeSession(sess.id)}
                        className="px-2 py-1 rounded bg-red-950/60 border border-red-800/80 text-red-300 hover:bg-red-900/80 text-[10px] transition-colors"
                      >
                        Révoquer
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sensitive Activity Log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Activités Sensibles Récentes</span>
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Immuabilité garantie</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl divide-y divide-slate-800/80 max-h-48 overflow-y-auto">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="p-2.5 flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-200">{log.action}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-amber-400/90 font-mono text-[10px]">{log.target}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{log.details}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-slate-500 font-mono">{log.timestamp}</div>
                    <span
                      className={`inline-block text-[9px] font-mono uppercase px-1 rounded ${
                        log.status === 'success'
                          ? 'text-emerald-400'
                          : log.status === 'blocked'
                          ? 'text-red-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Chiffrement AES-256 & TLS 1.3 activés</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onLockNow();
            }}
            className="px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-800 text-red-300 hover:bg-red-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Verrouiller le QG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
