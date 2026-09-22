'use client';

import React from 'react';
import {
  Bell,
  Shield,
  User,
  Lock,
  Radio,
  Clock,
  Sparkles,
  Layers,
  Activity,
  Sliders,
  LayoutDashboard,
} from 'lucide-react';
import { BarewaAlert } from '@/types/barewa';

interface TopBarProps {
  activeTab: 'dashboard' | 'ecosystem' | 'intelligence' | 'flux' | 'control';
  onTabChange: (tab: 'dashboard' | 'ecosystem' | 'intelligence' | 'flux' | 'control') => void;
  alerts: BarewaAlert[];
  onOpenAlerts: () => void;
  onOpenSecurity: () => void;
  onOpenAdmin: () => void;
  onLock: () => void;
  isDemoMode: boolean;
}

export function TopBar({
  activeTab,
  onTabChange,
  alerts,
  onOpenAlerts,
  onOpenSecurity,
  onOpenAdmin,
  onLock,
  isDemoMode,
}: TopBarProps) {
  const unresolvedAlerts = alerts.filter((a) => !a.isResolved);
  const criticalCount = unresolvedAlerts.filter((a) => a.severity === 'critical').length;

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'ecosystem', label: 'Écosystème', icon: Layers },
    { id: 'intelligence', label: 'Intelligence', icon: Sparkles },
    { id: 'flux', label: 'Flux', icon: Activity },
    { id: 'control', label: 'Contrôle', icon: Sliders },
  ] as const;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 border-b border-slate-800 backdrop-blur-md">
      {/* Top Banner: Ecosystem Status & Node Info */}
      <div className="px-3 sm:px-4 py-1.5 bg-slate-900/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold tracking-wide uppercase text-[10px]">Écosystème Opérationnel</span>
          </div>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <span className="hidden sm:inline-flex items-center gap-1 text-slate-300">
            <Radio className="w-3 h-3 text-amber-500" />
            <span>Nœud Central : <strong className="text-slate-200">Niamey (UTC+1)</strong></span>
          </span>

          <span className="text-slate-600 hidden md:inline">•</span>

          <span className="hidden md:inline text-slate-400">
            Disponibilité : <strong className="text-emerald-400 font-mono">99.96%</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {isDemoMode && (
            <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 text-[10px] font-mono">
              MODE DÉMO V1 (Données Simulées)
            </span>
          )}

          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Sahel Standard Time</span>
          </div>

          <button
            type="button"
            onClick={onLock}
            title="Verrouiller le cockpit QG"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 text-[10px] px-1.5"
          >
            <Lock className="w-3 h-3" />
            <span className="hidden lg:inline">Verrouiller</span>
          </button>
        </div>
      </div>

      {/* Main Bar with Branding, Navigation & 3 Permanent Actions */}
      <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 border border-amber-500/50 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              BQ
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-white font-serif">BAREWA</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono font-bold">
                  QG
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-tight leading-normal mt-0.5 hidden xs:block">
                Centre de Contrôle Sahélien
              </p>
            </div>
          </div>
        </div>

        {/* Center: Main Navigation Tabs (5 Tabs) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-amber-600 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: 3 PERMANENT COMMANDS */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 1. ALERTES */}
          <button
            type="button"
            onClick={onOpenAlerts}
            id="cmd-alerts"
            className="relative px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-600/60 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors"
          >
            <div className="relative">
              <Bell className="w-4 h-4 text-amber-400" />
              {unresolvedAlerts.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                  {unresolvedAlerts.length}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Alertes</span>
            {criticalCount > 0 && (
              <span className="hidden xl:inline-block px-1.5 py-0.2 rounded bg-red-950 border border-red-800 text-[10px] text-red-300 font-mono">
                {criticalCount} crit.
              </span>
            )}
          </button>

          {/* 2. SÉCURITÉ */}
          <button
            type="button"
            onClick={onOpenSecurity}
            id="cmd-security"
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-600/60 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Sécurité</span>
            <span className="hidden lg:inline text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono">
              94% RLS
            </span>
          </button>

          {/* 3. ADMINISTRATEUR */}
          <button
            type="button"
            onClick={onOpenAdmin}
            id="cmd-admin"
            className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-2 transition-colors"
          >
            <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center font-bold text-[10px]">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline font-mono text-[11px] truncate max-w-[110px]">Admin</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Tabs (visible only on small screens) */}
      <div className="flex md:hidden items-center justify-around border-t border-slate-800/80 px-2 py-1.5 bg-slate-950 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded text-[10px] font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
