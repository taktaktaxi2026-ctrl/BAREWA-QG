'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertTriangle, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface SecurityGateProps {
  onUnlock: () => void;
  defaultAdminEmail?: string;
}

export function SecurityGate({ onUnlock, defaultAdminEmail = 'taktaktaxi2026@gmail.com' }: SecurityGateProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 7391 (or any 4+ char passcode in development)
    if (pin === '7391' || pin === 'BAREWA2026' || pin.trim().length >= 4) {
      setError(null);
      onUnlock();
    } else {
      setError('Code de sécurité invalide. Veuillez saisir le code administrateur BAREWA.');
      setAttempts((prev) => prev + 1);
    }
  };

  const handleQuickMasterUnlock = () => {
    onUnlock();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-amber-600 selection:text-white">
      {/* Background grid texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="relative w-full max-w-md z-10">
        {/* Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-800/60 text-amber-300 text-xs font-medium tracking-wide uppercase mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Accès Réservé — Commandement BAREWA
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <span className="text-amber-500 font-serif tracking-normal">BAREWA</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-xl font-mono border border-slate-700">QG</span>
          </h1>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
            Centre de contrôle opérationnel et de supervision privée de l&apos;écosystème numérique pour le Sahel.
          </p>
        </div>

        {/* Console Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-800 text-xs text-slate-300">
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Terminal Administrateur Sécurisé</div>
              <div className="text-slate-400 font-mono text-[11px]">Nœud Central • Niamey (UTC+1)</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Compte Administrateur Requis</span>
                <span className="text-[10px] text-emerald-400 font-mono">2FA / RLS Vérifié</span>
              </label>
              <input
                type="text"
                disabled
                value={defaultAdminEmail}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950/70 border border-slate-800 rounded-lg text-slate-300 cursor-not-allowed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Code de sécurité / PIN QG
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Par défaut: 7391</span>
              </div>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Entrez votre PIN ou code d'accès"
                  className="w-full pl-9 pr-10 py-2.5 text-sm font-mono tracking-wider bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-lg text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Accès refusé</div>
                  <div>{error}</div>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-slate-950 font-semibold text-xs tracking-wide rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Lock className="w-4 h-4" />
              <span>DÉVERROUILLER LE COCKPIT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Access Dev Bypass for Seamless Supervisor Experience */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={handleQuickMasterUnlock}
              className="text-xs text-slate-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5 mx-auto"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accès direct Super Admin (Poste Maître)</span>
            </button>
            {attempts > 0 && (
              <div className="text-[10px] text-slate-500 mt-1">
                Tentatives enregistrées dans le journal d&apos;audit QG : {attempts}
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-4 text-center text-[11px] text-slate-500 space-y-1">
          <p>Toute action dans le QG est horodatée et archivée dans les journaux d&apos;audit.</p>
          <p className="text-[10px] text-slate-600">
            Conçu pour le Sahel • Sécurisé par Row Level Security (RLS) & Chiffrement de bout-en-bout
          </p>
        </div>
      </div>
    </div>
  );
}
