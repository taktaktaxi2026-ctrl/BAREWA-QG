'use client';

import React, { useState } from 'react';
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode,
  ArrowRight,
  Clock,
  User,
  X,
} from 'lucide-react';
import { ApprovalRequest } from '@/types/barewa';

interface ApprovalCenterViewProps {
  approvals: ApprovalRequest[];
  onApprove: (approvalId: string, notes?: string) => Promise<void>;
  onReject: (approvalId: string, notes?: string) => Promise<void>;
}

export function ApprovalCenterView({
  approvals,
  onApprove,
  onReject,
}: ApprovalCenterViewProps) {
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingApprovals = approvals.filter((a) => a.status === 'PENDING');
  const pastApprovals = approvals.filter((a) => a.status !== 'PENDING');

  const handleApprove = async (id: string) => {
    setIsProcessing(true);
    try {
      await onApprove(id, decisionNotes || 'Validé et autorisé par l Architecte Principal BAREWA QG');
      setSelectedApproval(null);
      setDecisionNotes('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    setIsProcessing(true);
    try {
      await onReject(id, decisionNotes || 'Refusé : non conforme aux politiques de sécurité actuelles');
      setSelectedApproval(null);
      setDecisionNotes('');
    } finally {
      setIsProcessing(false);
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 font-mono text-[10px] font-bold">
            RISQUE CRITIQUE
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 font-mono text-[10px] font-bold">
            RISQUE ÉLEVÉ
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 font-mono text-[10px]">
            RISQUE MODÉRÉ
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
            RISQUE FAIBLE
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center font-bold text-lg">
            🛡️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-serif">
                Centre d&apos;Approbation des Opérations Sensibles (QG Governance)
              </h3>
              {pendingApprovals.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-400 text-[10px] font-mono font-bold animate-pulse">
                  {pendingApprovals.length} en attente
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Aucun agent ne peut altérer la base PostgreSQL, les règles RLS ou déployer en
              production sans votre signature explicite.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/80 px-3 py-1.5 rounded-lg">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Zero-Trust Protocol Enforced</span>
        </div>
      </div>

      {/* PENDING APPROVALS */}
      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          <span>Demandes en attente de décision ({pendingApprovals.length})</span>
        </h4>

        {pendingApprovals.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-white">Toutes les opérations sensibles sont à jour.</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Aucune modification de base de données ou de déploiement en attente de validation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingApprovals.map((req) => (
              <div
                key={req.id}
                className="bg-slate-900/90 border border-amber-800/60 hover:border-amber-700/80 rounded-xl p-4 transition-all shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2.5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold text-red-400">
                        Demande #{req.id}
                      </span>
                      <span className="text-slate-600">•</span>
                      {getRiskBadge(req.riskLevel)}
                      {req.mission_id && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-[10px] font-mono text-purple-300">
                            Mission #{req.mission_id}
                          </span>
                        </>
                      )}
                    </div>
                    <h5 className="text-sm font-bold text-white font-serif">{req.title}</h5>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">{req.createdAt}</span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {req.description}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] space-y-1 mb-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-mono uppercase text-[10px]">Demandeur :</span>
                    <span className="text-slate-200 font-mono">{req.requesterAgentName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-mono uppercase text-[10px]">Cible d&apos;impact :</span>
                    <span className="text-amber-300 font-mono font-semibold">{req.targetResource}</span>
                  </div>
                </div>

                {/* Proposed Diff Preview */}
                {req.proposedDiff && (
                  <div className="mb-3.5 bg-slate-950 rounded-lg p-2.5 border border-slate-800 overflow-x-auto text-[11px] font-mono text-slate-300 max-h-36">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 pb-1 border-b border-slate-800">
                      <span>Aperçu du script DDL / Requête soumise :</span>
                      <FileCode className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <pre className="text-emerald-400 leading-normal">{req.proposedDiff}</pre>
                  </div>
                )}

                {/* Actions: Voir / Approuver / Refuser */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedApproval(req)}
                    className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    Examiner en détail
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleReject(req.id)}
                    className="py-1.5 px-3 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Refuser</span>
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleApprove(req.id)}
                    className="py-1.5 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approuver l&apos;Opération</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* HISTORIQUE DES DÉCISIONS PASSÉES */}
      <div className="space-y-3 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
          Historique des décisions passées ({pastApprovals.length})
        </h4>

        <div className="space-y-2">
          {pastApprovals.map((req) => (
            <div
              key={req.id}
              className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                {req.status === 'APPROVED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
                <div>
                  <span className="font-semibold text-white">{req.title}</span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                    <span>ID: #{req.id}</span>
                    <span>•</span>
                    <span>Décidé le : {req.decidedAt || req.createdAt}</span>
                    {req.decidedBy && (
                      <>
                        <span>•</span>
                        <span className="text-slate-300">Par : {req.decidedBy}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  req.status === 'APPROVED'
                    ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                    : 'bg-red-950 border border-red-800 text-red-400'
                }`}
              >
                {req.status === 'APPROVED' ? 'APPROUVÉ' : 'REJETÉ'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detailed Inspection */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-red-400 font-bold">
                  Approbation #{selectedApproval.id}
                </span>
                <h3 className="text-base font-bold text-white font-serif">
                  {selectedApproval.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedApproval(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">{selectedApproval.description}</p>

              {selectedApproval.proposedDiff && (
                <div>
                  <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                    Script complet proposé :
                  </label>
                  <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-emerald-400 text-[11px] font-mono max-h-48 overflow-y-auto">
                    {selectedApproval.proposedDiff}
                  </pre>
                </div>
              )}

              <div>
                <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                  Note d&apos;autorisation ou motif de refus :
                </label>
                <input
                  type="text"
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  placeholder="ex: Conforme au schéma Supabase et aux politiques RLS."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                disabled={isProcessing}
                onClick={() => setSelectedApproval(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Fermer
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleReject(selectedApproval.id)}
                className="px-3 py-1.5 rounded-lg bg-red-950 text-red-200 border border-red-800 font-semibold text-xs flex items-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Refuser</span>
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleApprove(selectedApproval.id)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirmer l&apos;Approbation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
