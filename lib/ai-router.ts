import { AIProvider, AIRoutingStrategy } from '@/types/barewa';

export interface AIRouteRequest {
  prompt: string;
  strategy: AIRoutingStrategy;
  preferredProviderId?: string;
  contextLanguage?: 'fr' | 'ha' | 'zarma' | 'en';
  maxTokens?: number;
}

export interface AIRouteResponse {
  success: boolean;
  providerUsed: string;
  providerName: string;
  modelUsed: string;
  fallbackTriggered: boolean;
  fallbackChain: string[];
  latencyMs: number;
  tokensEstimated: number;
  costCfa: number;
  text: string;
  timestamp: string;
  error?: string;
}

/**
 * AI ROUTER BAREWA — Sélectionne dynamiquement le fournisseur idéal
 * selon la stratégie de coût (0 FCFA), la latence, la disponibilité et les quotas.
 */
export function resolveProviderOrder(
  providers: AIProvider[],
  strategy: AIRoutingStrategy,
  preferredId?: string
): AIProvider[] {
  // Filter active or standby providers
  const usable = providers.filter((p) => p.status === 'active' || p.status === 'standby');

  if (preferredId) {
    const preferred = usable.find((p) => p.id === preferredId);
    if (preferred && preferred.status === 'active') {
      const remaining = usable.filter((p) => p.id !== preferredId);
      return [preferred, ...remaining];
    }
  }

  switch (strategy) {
    case 'free_tier_first':
      // Priority 1: Free tier cloud (Gemini) or Free Open Source (Groq/Mistral)
      return [...usable].sort((a, b) => a.fallbackPriority - b.fallbackPriority);

    case 'lowest_latency':
      // Priority: Lowest latency ms
      return [...usable].sort((a, b) => a.latencyMs - b.latencyMs);

    case 'local_sovereignty':
      // Priority: Local execution first (Ollama/vLLM)
      return [...usable].sort((a, b) => {
        if (a.isLocalCapable && !b.isLocalCapable) return -1;
        if (!a.isLocalCapable && b.isLocalCapable) return 1;
        return a.fallbackPriority - b.fallbackPriority;
      });

    case 'quality_first':
      // Priority: Gemini or advanced models
      return [...usable].sort((a, b) => a.fallbackPriority - b.fallbackPriority);

    default:
      return usable;
  }
}
