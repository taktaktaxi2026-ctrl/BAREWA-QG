'use client';

import React from 'react';
import {
  X,
  User,
  Shield,
  LogOut,
  Sliders,
  Mail,
  Zap,
  Check,
} from 'lucide-react';
import { SystemSettings } from '@/types/barewa';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  onLogout: () => void;
}

export function AdminModal({
  isOpen,
  onClose,
  adminEmail,
  settings,
  onUpdateSettings,
  onLogout,
}: AdminModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Profil Administrateur QG
              </h2>
              <p className="text-[11px] text-slate-400">Commandement & Préférences de session</p>
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

        {/* Body */}
        <div className="p-4 space-y-4 text-xs">
          {/* Admin Identity Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-bold text-white">Architecte Principal BAREWA</div>
                <div className="text-slate-400 flex items-center gap-1 mt-0.5 font-mono text-[11px]">
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span>{adminEmail}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-mono text-[10px] font-bold">
                SUPER ADMIN
              </span>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>2FA Matériel Actif</span>
              </span>
              <span className="font-mono text-slate-500">Node : Niamey Master Grid</span>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Préférences Opérationnelles QG</span>
            </h3>

            {/* Low Bandwidth Sahel Mode Toggle */}
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mode Réseau Sahélien (2G / 3G)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Allège les flux, compresse la télémétrie et coupe les médias lourds.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({ sahelLowBandwidthMode: !settings.sahelLowBandwidthMode })
                }
                className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
                  settings.sahelLowBandwidthMode ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.sahelLowBandwidthMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Refresh rate */}
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Intervalle de Télémétrie</div>
                <div className="text-[11px] text-slate-400">Fréquence de rafraîchissement des pings</div>
              </div>
              <select
                value={settings.telemetryIntervalSeconds}
                onChange={(e) =>
                  onUpdateSettings({ telemetryIntervalSeconds: Number(e.target.value) })
                }
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
              >
                <option value={10}>10 secondes</option>
                <option value={15}>15 secondes (défaut)</option>
                <option value={30}>30 secondes</option>
                <option value={60}>60 secondes</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-200">Fuseau Horaire de Référence</div>
                <div className="text-[11px] text-slate-400">Calibrage horodatage des logs et événements</div>
              </div>
              <div className="text-right font-mono text-[11px] text-amber-400">
                Africa/Niamey (UTC+1)
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Sign out */}
        <div className="p-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[10px] text-slate-500 flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>Session sécurisée active</span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-red-950/80 border border-red-800 text-red-300 hover:bg-red-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion QG</span>
          </button>
        </div>
      </div>
    </div>
  );
}
