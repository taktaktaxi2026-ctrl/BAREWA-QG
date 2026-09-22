'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  Users,
  Shield,
  Layers,
  ArrowRight,
  Plus,
  Radio,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  BarewaAgent,
  Conversation,
  DevForceMission,
  ApprovalRequest,
  ChatMessage,
  ConversationType,
} from '@/types/barewa';

interface AgentChatViewProps {
  agents: BarewaAgent[];
  conversations: Conversation[];
  missions: DevForceMission[];
  approvals: ApprovalRequest[];
  onSendMessage: (conversationId: string, text: string, targetAgentId?: string) => Promise<void>;
  onCreateMissionFromChat: (proposalData: Partial<DevForceMission>) => void;
  onOpenApproval: (approvalId: string) => void;
  onSwitchToWarRoom: () => void;
  onSelectAgentChat: (agentId: string) => void;
}

export function AgentChatView({
  agents,
  conversations,
  missions,
  approvals,
  onSendMessage,
  onCreateMissionFromChat,
  onOpenApproval,
  onSwitchToWarRoom,
  onSelectAgentChat,
}: AgentChatViewProps) {
  const [activeConvId, setActiveConvId] = useState<string>(
    conversations[0]?.conversation_id || 'conv-dev-individual'
  );
  const [filterType, setFilterType] = useState<'ALL' | ConversationType>('ALL');
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation =
    conversations.find((c) => c.conversation_id === activeConvId) || conversations[0];
  const linkedMission = missions.find((m) => m.mission_id === activeConversation?.mission_id);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const filteredConversations = conversations.filter((c) => {
    if (filterType === 'ALL') return true;
    return c.type === filterType;
  });

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isSubmitting || !activeConversation) return;

    const textToSend = inputText.trim();
    setInputText('');
    setIsSubmitting(true);

    try {
      // If individual chat, target the non-user participant
      const targetAgentId =
        activeConversation.type === 'INDIVIDUAL'
          ? activeConversation.participants.find((p) => p !== 'user')
          : undefined;

      await onSendMessage(activeConversation.conversation_id, textToSend, targetAgentId);
    } catch (err) {
      console.error('Erreur envoi message:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickPrompts = [
    {
      label: 'Vélo-Taxi QR Code',
      text: 'Analyse le composant de réservation et propose une table PostgreSQL avec contraintes RLS pour Barewa Taxi.',
    },
    {
      label: 'Audit Zéro Régression',
      text: "Vérifie l'absence totale de régression sur BAREWA CORE et le maintien de la compatibilité des routes existantes.",
    },
    {
      label: 'Résilience 2G Sahel',
      text: 'Simule une interruption réseau 2G sahélienne pendant la validation du panier et valide la réconciliation PWA.',
    },
    {
      label: 'Demande Approbation QG',
      text: "Génère le script DDL de migration pour Barewa Mobility et soumets la demande d'approbation au QG.",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-14rem)] min-h-[580px]">
      {/* LEFT COLUMN: Conversations Directory */}
      <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
        {/* Header & Filter */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Canaux & Salons QG
              </h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {conversations.length} actifs
            </span>
          </div>

          {/* Filter Pills */}
          <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-[10px]">
            <button
              onClick={() => setFilterType('ALL')}
              className={`py-1 rounded text-center font-medium transition-colors ${
                filterType === 'ALL'
                  ? 'bg-amber-600 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterType('INDIVIDUAL')}
              className={`py-1 rounded text-center font-medium transition-colors ${
                filterType === 'INDIVIDUAL'
                  ? 'bg-amber-600 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Agents
            </button>
            <button
              onClick={() => setFilterType('TEAM')}
              className={`py-1 rounded text-center font-medium transition-colors ${
                filterType === 'TEAM'
                  ? 'bg-amber-600 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              War Room
            </button>
            <button
              onClick={() => setFilterType('MISSION')}
              className={`py-1 rounded text-center font-medium transition-colors ${
                filterType === 'MISSION'
                  ? 'bg-amber-600 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Missions
            </button>
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-slate-800/40">
          {filteredConversations.map((conv) => {
            const isSelected = conv.conversation_id === activeConvId;
            const isWarRoom = conv.type === 'TEAM';
            const lastMsg = conv.messages[conv.messages.length - 1];

            return (
              <button
                key={conv.conversation_id}
                onClick={() => setActiveConvId(conv.conversation_id)}
                className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-amber-950/40 border border-amber-600/60 shadow-sm'
                    : 'bg-slate-900/60 border border-slate-800/80 hover:bg-slate-800/60'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border ${
                    isWarRoom
                      ? 'bg-red-950/80 border-red-700/80 text-red-400'
                      : conv.type === 'MISSION'
                      ? 'bg-purple-950/80 border-purple-700/80 text-purple-400'
                      : 'bg-amber-950/80 border-amber-700/80 text-amber-400'
                  }`}
                >
                  {isWarRoom ? '⚔️' : conv.type === 'MISSION' ? '🎯' : '🤖'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-amber-300' : 'text-slate-200'
                      }`}
                    >
                      {conv.title}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {lastMsg?.timestamp || ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                        isWarRoom
                          ? 'bg-red-900/60 text-red-300'
                          : conv.type === 'MISSION'
                          ? 'bg-purple-900/60 text-purple-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {conv.applicationConcerned}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {conv.messages.length} msgs
                    </span>
                  </div>

                  {lastMsg && (
                    <p className="text-[11px] text-slate-400 truncate mt-1">
                      <strong className="text-slate-300 font-medium">
                        {lastMsg.senderName.split(' ')[0]}:{' '}
                      </strong>
                      {lastMsg.text}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick Agent Start Bar */}
        <div className="p-2.5 border-t border-slate-800 bg-slate-950/80">
          <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider mb-1.5">
            Démarrer un chat direct :
          </p>
          <div className="grid grid-cols-6 gap-1">
            {agents.map((ag) => (
              <button
                key={ag.agent_id}
                onClick={() => onSelectAgentChat(ag.agent_id)}
                title={`Discuter en direct avec ${ag.name} (${ag.role})`}
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-600/60 flex flex-col items-center gap-0.5 transition-colors group"
              >
                <span className="text-sm group-hover:scale-110 transition-transform">
                  {ag.avatar}
                </span>
                <span className="text-[9px] font-mono text-slate-400 group-hover:text-amber-300 uppercase">
                  {ag.role.slice(0, 3)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Active Chat Thread & Action Controls */}
      <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
        {/* Active Chat Header */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-base border ${
                activeConversation?.type === 'TEAM'
                  ? 'bg-red-950/80 border-red-700/80 text-red-400'
                  : activeConversation?.type === 'MISSION'
                  ? 'bg-purple-950/80 border-purple-700/80 text-purple-400'
                  : 'bg-amber-950/80 border-amber-700/80 text-amber-400'
              }`}
            >
              {activeConversation?.type === 'TEAM'
                ? '⚔️'
                : activeConversation?.type === 'MISSION'
                ? '🎯'
                : '🤖'}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-serif">
                  {activeConversation?.title}
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-[9px] font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  BAP v1.0 ACTIF
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                <span>
                  App :{' '}
                  <strong className="text-slate-200">
                    {activeConversation?.applicationConcerned}
                  </strong>
                </span>
                {linkedMission && (
                  <>
                    <span>•</span>
                    <span className="text-purple-300 font-mono">
                      Mission #{linkedMission.mission_id} ({linkedMission.progress}%)
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="text-slate-400 font-mono">
                  {activeConversation?.participants.length} participants
                </span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {activeConversation?.type !== 'TEAM' && (
              <button
                onClick={onSwitchToWarRoom}
                className="px-2.5 py-1.5 rounded-lg bg-red-950/80 border border-red-800 hover:border-red-600 text-red-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Mobiliser tous les agents dans la War Room"
              >
                <span>⚔️</span>
                <span>Ouvrir War Room</span>
              </button>
            )}

            <button
              onClick={() =>
                onCreateMissionFromChat({
                  title: `Mission issue du chat : ${activeConversation?.title}`,
                  application: activeConversation?.applicationConcerned,
                  objective:
                    activeConversation?.messages[activeConversation.messages.length - 1]?.text ||
                    'Optimisation technique',
                })
              }
              className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Convertir les échanges de ce chat en mission formelle pour DEV FORCE"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer Mission</span>
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-slate-950/40 to-slate-900/40">
          {activeConversation?.messages.map((msg) => {
            const isUser = msg.senderId === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-sm font-bold ${
                    isUser
                      ? 'bg-amber-600 border-amber-500 text-slate-950'
                      : 'bg-slate-800 border-slate-700 text-slate-200'
                  }`}
                >
                  {isUser ? '👤' : msg.senderAvatar || '🤖'}
                </div>

                {/* Bubble Container */}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-xl p-3 border shadow-sm ${
                    isUser
                      ? 'bg-amber-950/40 border-amber-800/80 text-slate-100'
                      : 'bg-slate-900/90 border-slate-800 text-slate-200'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{msg.senderName}</span>
                      {msg.senderRole && (
                        <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] font-mono text-amber-400 uppercase">
                          {msg.senderRole}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                  </div>

                  {/* Body Text */}
                  <p className="text-xs leading-relaxed whitespace-pre-line text-slate-300">
                    {msg.text}
                  </p>

                  {/* Action Payload: Mission Proposal */}
                  {msg.actionPayload?.type === 'MISSION_PROPOSAL' && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-amber-950/50 border border-amber-700/80 text-amber-200">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          Proposition de Mission DEV FORCE
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-900/80 text-amber-300 font-mono">
                          Prêt pour exécution
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white mb-2">
                        {String(msg.actionPayload.data.title || 'Amélioration Barewa')}
                      </p>
                      <button
                        onClick={() =>
                          onCreateMissionFromChat({
                            title: String(msg.actionPayload?.data.title),
                            application: String(
                              msg.actionPayload?.data.application ||
                                activeConversation.applicationConcerned
                            ),
                            objective: msg.text,
                            priority: 'HIGH',
                            risk: 'MEDIUM',
                          })
                        }
                        className="w-full py-1.5 px-3 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <span>Créer la Mission et Mobiliser la War Room</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Action Payload: Security Approval Request Required */}
                  {msg.requiresApproval && msg.approvalId && (
                    <div className="mt-2.5 p-2.5 rounded-lg bg-red-950/60 border border-red-700/80 text-red-200">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          Approbation Requise par le QG
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-900/80 text-red-300 font-mono">
                          ID: #{msg.approvalId}
                        </span>
                      </div>
                      <p className="text-xs text-red-300 mb-2">
                        Cette opération modifie les structures sensibles ou les politiques RLS.
                        L&apos;exécution restera en attente jusqu&apos;à votre décision.
                      </p>
                      <button
                        onClick={() => onOpenApproval(msg.approvalId!)}
                        className="py-1 px-2.5 rounded bg-red-800 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        <span>Inspecter & Décider dans le Centre d&apos;Approbation</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-1.5 bg-slate-950 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[10px] text-slate-500 font-mono shrink-0 uppercase">
            Suggestions :
          </span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(q.text)}
              className="px-2 py-0.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-600/60 text-slate-300 whitespace-nowrap text-[10px] transition-colors"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={`Donner une instruction à ${
                activeConversation?.type === 'TEAM'
                  ? "l'équipe BAREWA DEV FORCE..."
                  : activeConversation?.title
              }`}
              rows={2}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-amber-600 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSubmitting}
              className="h-10 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-sm"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Transmettre</span>
                </>
              )}
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mt-1.5 px-0.5">
            <span>Shift + Entrée pour nouvelle ligne • Protocole BAP chiffré</span>
            <span className="text-emerald-400">Zero-Trust • RLS Enforcement</span>
          </div>
        </form>
      </div>
    </div>
  );
}
