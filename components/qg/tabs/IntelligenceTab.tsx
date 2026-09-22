'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Cpu,
  Zap,
  Shield,
  Layers,
  Send,
  AlertCircle,
  RefreshCw,
  Coins,
  CheckCircle2,
  Sliders,
  Play,
} from 'lucide-react';
import { AIProvider, AIRoutingStrategy } from '@/types/barewa';
import { AIRouteResponse } from '@/lib/ai-router';

interface IntelligenceTabProps {
  providers: AIProvider[];
  onToggleProviderStatus: (id: string) => void;
  onUpdateProviderPriority: (id: string, newPriority: number) => void;
}

export function IntelligenceTab({
  providers,
  onToggleProviderStatus,
  onUpdateProviderPriority,
}: IntelligenceTabProps) {
  const [strategy, setStrategy] = useState<AIRoutingStrategy>('free_tier_first');
  const [selectedProviderId, setSelectedProviderId] = useState<string>('gemini');

  // Interactive Test Console State
  const [testPrompt, setTestPrompt] = useState(
    "Explique les meilleures pratiques d'irrigation goutte-à-goutte pour un maraîcher de la région de Maradi confronté à la saison sèche sahélienne."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<AIRouteResponse | null>(null);
  const [testError, setTestError] = useState<string | null>(null);

  const presets = [
    {
      title: 'Agrométéo Maradi',
      prompt: "Explique les meilleures pratiques d'irrigation goutte-à-goutte pour un maraîcher de la région de Maradi confronté à la saison sèche sahélienne.",
    },
    {
      title: 'Dossier Santé Zinder',
      prompt: "Génère une synthèse de triage d'urgence pour un centre de santé intégré de brousse (accès hors-ligne, protocole paludisme simple).",
    },
    {
      title: 'Mobilité Urbaine Niamey',
      prompt: "Optimise un trajet de livraison entre le Grand Marché de Niamey et le quartier Francophonie en évitant les axes encombrés.",
    },
    {
      title: 'Traduction Hausa/Zarma',
      prompt: "Traduis et adapte le message de sensibilisation météo en Hausa et en Zarma avec un vocabulaire accessible.",
    },
  ];

  const handleRunTest = async () => {
    if (!testPrompt.trim()) return;
    setIsLoading(true);
    setTestError(null);

    try {
      const res = await fetch('/api/ai-router', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: testPrompt,
          strategy,
          preferredProviderId: selectedProviderId === 'auto' ? undefined : selectedProviderId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors du traitement par le routeur IA.');
      }
      setTestResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      setTestError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute fallback chain based on strategy
  const sortedChain = [...providers].sort((a, b) => {
    if (strategy === 'lowest_latency') return a.latencyMs - b.latencyMs;
    if (strategy === 'local_sovereignty') {
      if (a.isLocalCapable && !b.isLocalCapable) return -1;
      if (!a.isLocalCapable && b.isLocalCapable) return 1;
    }
    return a.fallbackPriority - b.fallbackPriority;
  });

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h1 className="text-base font-bold text-white uppercase tracking-wide">
              Centre de Contrôle BAREWA AI & Routeur Multi-Modèles
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Architecture AI ROUTER / PROVIDER : découplage complet entre les applications et les modèles d&apos;IA.
            Bascule automatique entre Cloud Gratuit, Open Source et Souveraineté Locale (0 FCFA).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-right">
            <div className="text-[10px] text-slate-400 uppercase">Coût Inférence</div>
            <div className="text-sm font-bold font-mono text-emerald-400 flex items-center justify-end gap-1">
              <Coins className="w-3.5 h-3.5" />
              <span>0 FCFA (Free-Tier)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Router Strategy Selector & Quota Policy */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              <span>Stratégie de Routage Actuelle</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Détermine comment le QG distribue les requêtes des services vers les différents moteurs d&apos;IA.
            </p>
          </div>

          {/* Strategy Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'free_tier_first', label: 'Priorité Gratuit / Free Tier', desc: '0 FCFA' },
              { id: 'lowest_latency', label: 'Plus Faible Latence', desc: 'LPUs rapides' },
              { id: 'local_sovereignty', label: 'Souveraineté Locale Niamey', desc: 'Ollama/vLLM' },
              { id: 'quality_first', label: 'Raisonnement Élevé', desc: 'Gemini Pro/Flash' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStrategy(s.id as AIRoutingStrategy)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  strategy === s.id
                    ? 'bg-amber-600 text-slate-950 font-semibold'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Fallback Chain Visualizer */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-mono mb-2 flex items-center gap-1.5">
            <span>Chaîne de secours séquentielle (Fallback Cascade) :</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {sortedChain.map((p, index) => (
              <React.Fragment key={p.id}>
                <div className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-slate-200">{p.name}</span>
                  <span
                    className={`text-[9px] font-mono px-1 rounded uppercase ${
                      p.status === 'active'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">~{p.latencyMs}ms</span>
                </div>
                {index < sortedChain.length - 1 && (
                  <span className="text-amber-500 font-bold font-mono">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Providers Grid (4 Core Engines) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
              provider.status === 'active'
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-slate-950/60 border-slate-800/60 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                    {provider.providerType.replace('_', ' ')}
                  </span>
                  <h3 className="text-xs font-bold text-white leading-tight">{provider.name}</h3>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleProviderStatus(provider.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase border transition-colors ${
                    provider.status === 'active'
                      ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {provider.status}
                </button>
              </div>

              <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed mb-3">
                {provider.description}
              </p>

              {/* Engine Metrics */}
              <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[10px] font-mono mb-3">
                <div>
                  <span className="text-slate-500 block">Modèle Défaut</span>
                  <span className="text-slate-200 truncate block">{provider.defaultModel}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Latence Moyenne</span>
                  <span className="text-emerald-400">{provider.latencyMs} ms</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Limite Free Tier</span>
                  <span className="text-amber-300">{provider.freeTierRpmLimit} RPM</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Exécution Locale</span>
                  <span className={provider.isLocalCapable ? 'text-emerald-400' : 'text-slate-400'}>
                    {provider.isLocalCapable ? 'OUI (Niamey)' : 'NON (Cloud)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Provider Priority Controls */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Priorité de repli :</span>
              <div className="flex items-center gap-1 font-mono">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateProviderPriority(provider.id, Math.max(1, provider.fallbackPriority - 1))
                  }
                  className="w-5 h-5 rounded bg-slate-800 text-slate-200 flex items-center justify-center hover:bg-slate-700"
                >
                  -
                </button>
                <span className="px-1.5 font-bold text-amber-400">{provider.fallbackPriority}</span>
                <button
                  type="button"
                  onClick={() => onUpdateProviderPriority(provider.id, provider.fallbackPriority + 1)}
                  className="w-5 h-5 rounded bg-slate-800 text-slate-200 flex items-center justify-center hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive AI Router Test Console */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Console de Test & Diagnostic en Direct de l&apos;AI Router
              </h2>
              <p className="text-[11px] text-slate-400">
                Teste l&apos;acheminement réel, la latence et le système de repli automatique en temps réel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Forcer Fournisseur :</span>
            <select
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
            >
              <option value="auto">Auto (Selon Stratégie)</option>
              <option value="gemini">Google Gemini (Native)</option>
              <option value="groq">Groq Cloud (Llama 3)</option>
              <option value="mistral">Mistral AI</option>
              <option value="ollama_local">Ollama Local Niamey</option>
            </select>
          </div>
        </div>

        {/* Prompt Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] text-slate-500 font-mono mr-1 uppercase">Scénarios Sahel :</span>
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTestPrompt(preset.prompt)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors"
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Input Textarea & Run Button */}
        <div className="space-y-2">
          <textarea
            rows={3}
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="Saisissez un prompt ou une requête d'inférence BAREWA..."
            className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
          />

          <div className="flex justify-between items-center">
            <div className="text-[11px] text-slate-500 font-mono">
              Mode API sécurisé serveur (process.env.GEMINI_API_KEY) • 0 FCFA garanti
            </div>

            <button
              type="button"
              disabled={isLoading || !testPrompt.trim()}
              onClick={handleRunTest}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors shadow-md"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Routage & Inférence en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Envoyer au Routeur IA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {testError && (
          <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Erreur du Routeur IA :</div>
              <div>{testError}</div>
            </div>
          </div>
        )}

        {/* Live Router Response Display */}
        {testResult && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            {/* Telemetry Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Résultat du Routeur :</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-mono text-[10px] font-bold">
                  {testResult.providerName}
                </span>
                <span className="font-mono text-slate-400 text-[10px]">[{testResult.modelUsed}]</span>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-slate-400">
                  Latence : <strong className="text-amber-400">{testResult.latencyMs} ms</strong>
                </span>
                <span className="text-slate-400">
                  Tokens : <strong className="text-slate-200">~{testResult.tokensEstimated}</strong>
                </span>
                <span className="text-slate-400">
                  Coût : <strong className="text-emerald-400">0.00 FCFA</strong>
                </span>
                {testResult.fallbackTriggered && (
                  <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 text-[10px]">
                    Fallback Activé
                  </span>
                )}
              </div>
            </div>

            {/* Fallback chain taken */}
            {testResult.fallbackChain && testResult.fallbackChain.length > 0 && (
              <div className="text-[10px] font-mono text-slate-500">
                Chemin d&apos;évaluation : {testResult.fallbackChain.join(' → ')}
              </div>
            )}

            {/* Generated Output */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
              {testResult.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
