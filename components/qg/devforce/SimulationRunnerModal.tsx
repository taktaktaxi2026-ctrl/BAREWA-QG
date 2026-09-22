'use client';

import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  MessageSquare,
  Users,
  Target,
  Sparkles,
  X,
  FastForward,
} from 'lucide-react';

interface SimulationRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunStep: (stepNumber: number) => Promise<void>;
  onResetSimulation: () => void;
  currentStep: number;
}

const STEPS = [
  {
    step: 1,
    title: 'Accès au Command Center BAREWA DEV FORCE',
    description: "Le Cockpit QG active la vue DEV FORCE et initialise l'écoute des battements de cœur BAP.",
    tag: 'Navigation QG',
  },
  {
    step: 2,
    title: 'Sélection de l’Agent DEV (DEV-001)',
    description: "Affichage des outils, modèle (Gemini/Codestral) et capacités de l'agent de développement.",
    tag: 'Agent Registry',
  },
  {
    step: 3,
    title: 'Dialogue Direct & Spécification',
    description: "L'Architecte QG transmet l'instruction : 'Ajoute la réservation express QR Code dans Barewa Taxi'.",
    tag: 'Chat Individuel',
  },
  {
    step: 4,
    title: 'Conversion du Chat en Mission Structurée',
    description: "Génération de la mission #BAREWA-TAXI-QR-001 avec priorité, risque et contraintes BAREWA CORE.",
    tag: 'Mission Control',
  },
  {
    step: 5,
    title: 'Ouverture de la War Room Multi-Agents',
    description: "Mobilisation simultanée de DEV-001, ARCH-001, DB-001, QA-001 et SEC-001.",
    tag: 'War Room',
  },
  {
    step: 6,
    title: 'Concertation Technique Inter-Agents',
    description: "L'Architecte propose le découplage, DEV demande le schéma, Database pose les règles RLS.",
    tag: 'Collab Inter-Agents',
  },
  {
    step: 7,
    title: 'Exécution Technique DEV FORCE',
    description: "Génération du code TypeScript/React et préparation des migrations PostgreSQL Supabase.",
    tag: 'Exécution BAP',
  },
  {
    step: 8,
    title: 'Flux d’Événements en Temps Réel',
    description: "Réception des états d'activité : thinking → working → waiting sur la timeline du QG.",
    tag: 'Live Timeline',
  },
  {
    step: 9,
    title: 'Alerte SecOps & Demande d’Approbation',
    description: "SecOps détecte une altération DDL de la base : demande d'approbation #APP-001 émise.",
    tag: 'Approval Center',
  },
  {
    step: 10,
    title: 'Signature & Approbation de l’Architecte QG',
    description: "L'Architecte inspecte le diff SQL RLS et valide l'opération avec sa clé administrateur.",
    tag: 'Gouvernance QG',
  },
  {
    step: 11,
    title: 'Reprise Automatique de l’Exécution',
    description: "Le verrou BAP est levé, le schéma est appliqué et le conteneur passe en phase de test.",
    tag: 'Déblocage BAP',
  },
  {
    step: 12,
    title: 'Validation QA & Rapport Final',
    description: "24/24 tests passent au vert (94.5% couverture). Rapport de mission généré pour le QG.",
    tag: 'Rapport Final',
  },
  {
    step: 13,
    title: 'Archivage Immuable & Persistance',
    description: "La mission, les dialogues et le journal d'audit restent consultables dans l'historique.",
    tag: 'Persistance BAREWA',
  },
];

export function SimulationRunnerModal({
  isOpen,
  onClose,
  onRunStep,
  onResetSimulation,
  currentStep,
}: SimulationRunnerModalProps) {
  const [isRunningAll, setIsRunningAll] = useState(false);

  if (!isOpen) return null;

  const handleNextStep = async () => {
    if (currentStep < 13) {
      await onRunStep(currentStep + 1);
    }
  };

  const handleRunAll = async () => {
    setIsRunningAll(true);
    for (let s = currentStep + 1; s <= 13; s++) {
      await onRunStep(s);
      // Small pause between steps for realistic visual pacing
      await new Promise((res) => setTimeout(res, 600));
    }
    setIsRunningAll(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-600/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-lg">
              🚀
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                Scénario de Démonstration Intégral — BAREWA DEV FORCE
              </h3>
              <p className="text-[11px] text-slate-400">
                Cycle complet en 13 étapes : du chat initial à l&apos;approbation QG et au rapport
                final.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-slate-400">
              Progression du Scénario : Étape {Math.min(currentStep, 13)} / 13
            </span>
            <span className="text-amber-400 font-bold">
              {Math.round((Math.min(currentStep, 13) / 13) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${(Math.min(currentStep, 13) / 13) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps Scrollable List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {STEPS.map((st) => {
            const isCompleted = currentStep >= st.step;
            const isCurrent = currentStep + 1 === st.step;

            return (
              <div
                key={st.step}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-amber-950/40 border-amber-500 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-950/80 border-slate-800 opacity-90'
                    : 'bg-slate-950/30 border-slate-800/50 opacity-50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-mono text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : isCurrent
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : st.step}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5
                      className={`text-xs font-bold ${
                        isCurrent ? 'text-amber-300' : isCompleted ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {st.title}
                    </h5>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                      {st.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Control Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
          <button
            onClick={onResetSimulation}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              disabled={isRunningAll || currentStep >= 13}
              onClick={handleRunAll}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>Exécuter Tout (Auto)</span>
            </button>

            {currentStep < 13 ? (
              <button
                disabled={isRunningAll}
                onClick={handleNextStep}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Étape Suivante ({currentStep + 1}/13)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Terminer et Explorer le Cockpit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
