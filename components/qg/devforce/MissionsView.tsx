'use client';

import React, { useState } from 'react';
import {
  Target,
  Plus,
  GitPullRequest,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Shield,
  Layers,
  MessageSquare,
  FileText,
  X,
} from 'lucide-react';
import { DevForceMission, BarewaAgent } from '@/types/barewa';

interface MissionsViewProps {
  missions: DevForceMission[];
  agents: BarewaAgent[];
  onOpenWarRoomForMission: (missionId: string) => void;
  onCreateMission: (mission: Partial<DevForceMission>) => void;
}

export function MissionsView({
  missions,
  agents,
  onOpenWarRoomForMission,
  onCreateMission,
}: MissionsViewProps) {
  const [selectedMission, setSelectedMission] = useState<DevForceMission | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Mission Form state
  const [newTitle, setNewTitle] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newApp, setNewApp] = useState('Barewa Mobility');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [newRisk, setNewRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'RESTRICTED'>('MEDIUM');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateMission({
      title: newTitle.trim(),
      objective: newObjective.trim() || 'Mission technique d optimisation pour l écosystème.',
      application: newApp,
      priority: newPriority,
      risk: newRisk,
    });

    setNewTitle('');
    setNewObjective('');
    setShowCreateModal(false);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 rounded bg-red-950 border border-red-800 text-red-300 text-[10px] font-mono font-bold">
            CRITIQUE
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 text-[10px] font-mono font-bold">
            HAUTE
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-300 text-[10px] font-mono">
            MOYENNE
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
            BASSE
          </span>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-400 text-[10px] font-mono flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            EN COURS
          </span>
        );
      case 'WAITING_APPROVAL':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-800 text-red-400 text-[10px] font-mono flex items-center gap-1 font-bold">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            ATTENTE APPROBATION
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono flex items-center gap-1 font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            TERMINÉE
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Action */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold text-lg">
            🎯
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-serif">
              Missions & Tâches — BAREWA DEV FORCE
            </h3>
            <p className="text-[11px] text-slate-400">
              Supervisez les objectifs, l&apos;avancement, les pull requests et le cycle de vie des
              développements.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Mission</span>
        </button>
      </div>

      {/* Missions List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {missions.map((mission) => {
          const assignedAgentObjs = agents.filter((a) =>
            mission.assignedAgents.includes(a.agent_id)
          );

          return (
            <div
              key={mission.mission_id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all shadow-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      #{mission.mission_id}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      {mission.application}
                    </span>
                  </div>
                  {getStatusBadge(mission.status)}
                </div>

                {/* Title & Objective */}
                <h4 className="text-sm font-bold text-white mb-1.5 font-serif line-clamp-2">
                  {mission.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-3 mb-3 leading-relaxed">
                  {mission.objective}
                </p>

                {/* Progress Bar */}
                <div className="mb-3.5 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Progression globale
                    </span>
                    <span className="font-mono font-bold text-amber-400 text-xs">
                      {mission.progress}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        mission.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${mission.progress}%` }}
                    />
                  </div>
                </div>

                {/* Constraints Count & Assigned Agents */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono uppercase text-[10px]">Priorité :</span>
                    {getPriorityBadge(mission.priority)}
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono uppercase text-[10px]">Risque :</span>
                    <span className="text-[10px] font-mono text-slate-300 px-1.5 py-0.2 rounded bg-slate-800">
                      {mission.risk}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono uppercase text-[10px]">Agents assignés :</span>
                    <div className="flex items-center gap-1">
                      {assignedAgentObjs.map((ag) => (
                        <span
                          key={ag.agent_id}
                          title={`${ag.name} (${ag.role})`}
                          className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-[11px]"
                        >
                          {ag.avatar}
                        </span>
                      ))}
                    </div>
                  </div>
                  {mission.testResults && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono uppercase text-[10px]">Tests :</span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {mission.testResults.passed}/{mission.testResults.total} (Couv.{' '}
                        {mission.testResults.coverage})
                      </span>
                    </div>
                  )}
                  {mission.prUrl && (
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono uppercase text-[10px]">Pull Request :</span>
                      <span className="text-[10px] text-blue-400 font-mono flex items-center gap-1">
                        <GitPullRequest className="w-3 h-3 text-blue-400" />
                        PR #42 (Ouverte)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => onOpenWarRoomForMission(mission.mission_id)}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>War Room</span>
                </button>

                <button
                  onClick={() => setSelectedMission(mission)}
                  className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                >
                  Détails
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mission Detail Modal */}
      {selectedMission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">
                  #{selectedMission.mission_id}
                </span>
                <h3 className="text-base font-bold text-white font-serif">
                  {selectedMission.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMission(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {selectedMission.objective}
              </p>

              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-1.5">
                Contraintes BAREWA appliquées :
              </h4>
              <ul className="space-y-1 mb-4 text-xs text-slate-300">
                {selectedMission.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400">✓</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>

              {selectedMission.finalReport && (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-[10px] text-amber-400 uppercase font-mono font-bold block mb-1">
                    Rapport de mission :
                  </span>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedMission.finalReport}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedMission(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  const mId = selectedMission.mission_id;
                  setSelectedMission(null);
                  onOpenWarRoomForMission(mId);
                }}
                className="px-3 py-1.5 rounded-lg bg-red-900 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <span>Rejoindre la War Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Mission Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-serif">
                  Définir une Nouvelle Mission DEV FORCE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Titre de la mission :</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ex: Intégration Paiement QR Vélo-Taxi"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Application cible :</label>
                <select
                  value={newApp}
                  onChange={(e) => setNewApp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-600"
                >
                  <option value="Barewa Mobility">Barewa Mobility (Taxis & Logistique)</option>
                  <option value="Barewa Health">Barewa Health (Santé & Urgence)</option>
                  <option value="Barewa Météo">Barewa Météo (Climat & Agrométéo)</option>
                  <option value="Barewa Académie">Barewa Académie (Éducation)</option>
                  <option value="Barewa Store">Barewa Store (Commerce local)</option>
                  <option value="Barewa Core">Barewa Core (Fondation globale)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Objectif opérationnel :</label>
                <textarea
                  rows={3}
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  placeholder="Décrivez les objectifs et les contraintes techniques..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Priorité :</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="LOW">Basse</option>
                    <option value="MEDIUM">Moyenne</option>
                    <option value="HIGH">Haute</option>
                    <option value="CRITICAL">Critique</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Risque :</label>
                  <select
                    value={newRisk}
                    onChange={(e) => setNewRisk(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none"
                  >
                    <option value="LOW">Faible</option>
                    <option value="MEDIUM">Modéré</option>
                    <option value="HIGH">Élevé</option>
                    <option value="RESTRICTED">Restreint</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Créer & Mobiliser DEV FORCE
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
