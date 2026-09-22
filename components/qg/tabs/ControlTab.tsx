'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Users,
  ShieldCheck,
  Database,
  FileText,
  Copy,
  Check,
  Zap,
  Save,
  Lock,
  Plus,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import { AdministratorAccount, SystemSettings, ActivityLog } from '@/types/barewa';
import { BAREWA_SUPABASE_SCHEMA_SQL } from '@/lib/supabase-schema';

interface ControlTabProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  admins: AdministratorAccount[];
  onAddAdmin: (admin: AdministratorAccount) => void;
  onToggleAdminStatus: (id: string) => void;
  activityLogs: ActivityLog[];
}

export function ControlTab({
  settings,
  onUpdateSettings,
  admins,
  onAddAdmin,
  onToggleAdminStatus,
  activityLogs,
}: ControlTabProps) {
  const [activeSection, setActiveSection] = useState<'settings' | 'admins' | 'rbac' | 'supabase' | 'audit' | 'experiments'>('settings');
  const [copiedSql, setCopiedSql] = useState(false);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // New admin form state
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'super_admin' | 'secops' | 'ops_engineer' | 'auditor'>('ops_engineer');

  // Local settings copy
  const [formSettings, setFormSettings] = useState<SystemSettings>({ ...settings });

  // Experimental feature flags
  const [featureFlags, setFeatureFlags] = useState({
    ussdFallback: true, // Accès par code USSD *142# pour téléphones basiques sans internet
    voiceHausaZarma: true, // Reconnaissance vocale dialectale pour Barewa AI
    offlinePwaV2: true, // Synchronisation IndexedDB avancée
    satelliteAgroIngest: false, // Ingestion directe Sentinel-2 (bêta)
  });

  const handleCopySql = () => {
    navigator.clipboard.writeText(BAREWA_SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formSettings);
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) return;

    const newAdm: AdministratorAccount = {
      id: `adm-${Date.now()}`,
      name: newAdminName.trim(),
      email: newAdminEmail.trim(),
      role: newAdminRole,
      status: 'active',
      lastLogin: 'Jamais',
      twoFactorEnabled: true,
      allowedIps: ['*'],
    };

    onAddAdmin(newAdm);
    setIsAddAdminOpen(false);
    setNewAdminName('');
    setNewAdminEmail('');
  };

  // RBAC permissions matrix
  const permissionsMatrix = [
    { module: 'Tableau de Bord', superAdmin: true, secOps: true, opsEngineer: true, auditor: true },
    { module: 'Gestion des Services (Kill-switch)', superAdmin: true, secOps: false, opsEngineer: true, auditor: false },
    { module: 'Configuration AI Router & Quotas', superAdmin: true, secOps: false, opsEngineer: true, auditor: false },
    { module: 'Gestion des Files & Bus de Flux', superAdmin: true, secOps: false, opsEngineer: true, auditor: false },
    { module: 'Gouvernance Sécurité & Sessions', superAdmin: true, secOps: true, opsEngineer: false, auditor: true },
    { module: 'Création / Révocation Administrateurs', superAdmin: true, secOps: false, opsEngineer: false, auditor: false },
    { module: 'Modification Schéma PostgreSQL & RLS', superAdmin: true, secOps: true, opsEngineer: false, auditor: false },
    { module: 'Consultation des Journaux d Audit', superAdmin: true, secOps: true, opsEngineer: true, auditor: true },
  ];

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <SlidersHorizontal className="w-5 h-5 text-amber-500" />
            <h1 className="text-base font-bold text-white uppercase tracking-wide">
              Centre de Contrôle & Gouvernance Administrative
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Gestion globale des paramètres écosystème, administrateurs, sécurité RLS, base de données Supabase et audits.
          </p>
        </div>
      </div>

      {/* Control Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-800">
        {[
          { id: 'settings', label: 'Paramètres Globaux', icon: Sliders },
          { id: 'admins', label: 'Administrateurs', icon: Users },
          { id: 'rbac', label: 'Rôles & Permissions', icon: ShieldCheck },
          { id: 'supabase', label: 'Base de Données & Supabase', icon: Database },
          { id: 'audit', label: 'Journaux d Audit', icon: FileText },
          { id: 'experiments', label: 'Fonctions Expérimentales', icon: Zap },
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSection === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSection(sub.id as typeof activeSection)}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                isActive
                  ? 'bg-amber-600 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section 1: Paramètres Globaux */}
      {activeSection === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Paramètres Opérationnels de l&apos;Écosystème BAREWA
              </h2>
              <p className="text-[11px] text-slate-400">
                Ajustements sensibles répercutés sur l&apos;ensemble des microservices BAREWA CORE.
              </p>
            </div>

            {savedSettingsSuccess && (
              <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Enregistré avec succès !
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Nom Officiel de l&apos;Écosystème
              </label>
              <input
                type="text"
                value={formSettings.ecosystemName}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, ecosystemName: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Environnement</label>
              <select
                value={formSettings.environment}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    environment: e.target.value as 'production' | 'staging' | 'development',
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="production">Production (Sahel Live Grid)</option>
                <option value="staging">Staging / Préproduction</option>
                <option value="development">Développement Local</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Email de Réception des Alertes Critiques
              </label>
              <input
                type="email"
                value={formSettings.alertEmailRecipient}
                onChange={(e) =>
                  setFormSettings({ ...formSettings, alertEmailRecipient: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Expiration des Sessions Admin (Minutes)
              </label>
              <input
                type="number"
                min={5}
                max={120}
                value={formSettings.sessionTimeoutMinutes}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    sessionTimeoutMinutes: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            {/* Global Maintenance Kill Switch */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-red-400 flex items-center gap-1.5 text-xs">
                  <Lock className="w-4 h-4" />
                  <span>Mode Maintenance Globale de l&apos;Écosystème (Kill-Switch)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ferme temporairement l&apos;accès public à toutes les applications pour intervention d&apos;urgence.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormSettings({
                    ...formSettings,
                    globalMaintenanceMode: !formSettings.globalMaintenanceMode,
                  })
                }
                className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
                  formSettings.globalMaintenanceMode ? 'bg-red-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    formSettings.globalMaintenanceMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Low Bandwidth Mode */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold text-amber-300 flex items-center gap-1.5 text-xs">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Mode Économie de Bande Passante Sahélienne (2G / 3G)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Optimise automatiquement les charges utiles JSON et compresse les réponses pour connexions lentes.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormSettings({
                    ...formSettings,
                    sahelLowBandwidthMode: !formSettings.sahelLowBandwidthMode,
                  })
                }
                className={`w-11 h-6 rounded-full p-1 transition-colors relative ${
                  formSettings.sahelLowBandwidthMode ? 'bg-emerald-600' : 'bg-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    formSettings.sahelLowBandwidthMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Appliquer les Paramètres</span>
            </button>
          </div>
        </form>
      )}

      {/* Section 2: Administrateurs */}
      {activeSection === 'admins' && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                Comptes Administrateurs Autorisés sur BAREWA QG
              </h2>
              <p className="text-[11px] text-slate-400">
                Seuls ces comptes peuvent franchir la barrière d&apos;authentification du QG.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddAdminOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un Administrateur</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{admin.name}</span>
                    <span className="px-2 py-0.2 rounded bg-amber-950 border border-amber-800 text-amber-300 font-mono text-[10px] uppercase font-bold">
                      {admin.role.replace('_', ' ')}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1 rounded ${
                        admin.status === 'active'
                          ? 'bg-emerald-950 text-emerald-400'
                          : 'bg-red-950 text-red-400'
                      }`}
                    >
                      {admin.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{admin.email}</div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Dernière connexion : {admin.lastLogin} • 2FA :{' '}
                    {admin.twoFactorEnabled ? 'Activé (Obligatoire)' : 'Inactif'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleAdminStatus(admin.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-medium border transition-colors ${
                      admin.status === 'active'
                        ? 'bg-red-950/60 border-red-800 text-red-300 hover:bg-red-900'
                        : 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                    }`}
                  >
                    {admin.status === 'active' ? 'Suspendre' : 'Réactiver'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Admin Modal */}
          {isAddAdminOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
              <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white">Nouvel Administrateur BAREWA QG</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddAdminOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleCreateAdmin} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      placeholder="Ex: Ingénieur Réseaux Sahel"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Adresse Email *</label>
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@barewa.ne"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Rôle Attribué</label>
                    <select
                      value={newAdminRole}
                      onChange={(e) =>
                        setNewAdminRole(
                          e.target.value as 'super_admin' | 'secops' | 'ops_engineer' | 'auditor'
                        )
                      }
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="ops_engineer">Opérateur Technique (Ops)</option>
                      <option value="secops">Responsable Sécurité (SecOps)</option>
                      <option value="auditor">Auditeur Conformité</option>
                      <option value="super_admin">Super Administrateur</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddAdminOpen(false)}
                      className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold"
                    >
                      Créer le compte
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 3: Rôles & Permissions (RBAC) */}
      {activeSection === 'rbac' && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Matrice de Contrôle d&apos;Accès Basé sur les Rôles (RBAC)
            </h2>
            <p className="text-[11px] text-slate-400">
              Chaque privilège est strictement isolé et vérifié par middleware côté serveur.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Module / Périmètre</th>
                  <th className="p-3 text-center">Super Admin</th>
                  <th className="p-3 text-center">SecOps</th>
                  <th className="p-3 text-center">Ops Engineer</th>
                  <th className="p-3 text-center">Auditeur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {permissionsMatrix.map((perm, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="p-3 font-medium text-slate-200">{perm.module}</td>
                    <td className="p-3 text-center">
                      {perm.superAdmin ? (
                        <span className="text-emerald-400 font-bold">✓ Autorisé</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {perm.secOps ? (
                        <span className="text-emerald-400 font-bold">✓ Autorisé</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {perm.opsEngineer ? (
                        <span className="text-emerald-400 font-bold">✓ Autorisé</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {perm.auditor ? (
                        <span className="text-emerald-400 font-bold">✓ Lecture</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Section 4: Base de Données & Supabase */}
      {activeSection === 'supabase' && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Architecture PostgreSQL & Schéma Supabase V1
                </h2>
              </div>
              <p className="text-[11px] text-slate-400">
                Schéma relationnel complet incluant tables, contraintes, triggers et Row Level Security (RLS).
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopySql}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-sm"
            >
              {copiedSql ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Schéma SQL Copié !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copier le Schéma SQL DDL</span>
                </>
              )}
            </button>
          </div>

          {/* Setup Guide for Free Tier Supabase */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-2">
            <h3 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
              Procédure d&apos;Intégration Gratuite (0 FCFA) avec Supabase :
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed">
              <li>Créez un projet gratuit sur <strong>supabase.com</strong> (Free tier généreux pour le Sahel).</li>
              <li>Ouvrez le menu <strong>SQL Editor</strong> dans le dashboard de votre projet Supabase.</li>
              <li>Cliquez sur le bouton vert <strong>&quot;Copier le Schéma SQL DDL&quot;</strong> ci-dessus et collez-le.</li>
              <li>Exécutez la requête pour provisionner les 11 tables avec RLS et indexes optimisés.</li>
              <li>Ajoutez vos clés dans <code>.env.example</code> : <code>NEXT_PUBLIC_SUPABASE_URL</code> et <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</li>
            </ol>
          </div>

          {/* SQL Preview Box */}
          <div className="relative">
            <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
              {BAREWA_SUPABASE_SCHEMA_SQL}
            </pre>
          </div>
        </div>
      )}

      {/* Section 5: Journaux d'Activité */}
      {activeSection === 'audit' && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Journaux d&apos;Audit Immuables (Activity Logs)</span>
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">Chiffrement SHA-256</span>
          </div>

          <div className="space-y-2">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{log.action}</span>
                    <span className="text-slate-500">•</span>
                    <span className="font-mono text-amber-400 text-[11px]">{log.target}</span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1 rounded ${
                        log.severity === 'critical'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : log.severity === 'sensitive'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>
                </div>

                <div className="text-right shrink-0 font-mono text-[10px] text-slate-500">
                  <div>{log.timestamp}</div>
                  <div>IP : {log.ipAddress}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 6: Expérimentations (Feature Flags) */}
      {activeSection === 'experiments' && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Fonctionnalités Expérimentales & Drapeaux de Fonction (Feature Flags)</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Activez ou désactivez les fonctionnalités en cours de prototypage dans l&apos;écosystème.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                key: 'ussdFallback',
                title: 'Passerelle USSD / GSM (*142#)',
                description:
                  "Permet aux utilisateurs en zone rurale sahélienne sans smartphone ni 4G d'accéder aux services Barewa Météo et Santé par menu court.",
                active: featureFlags.ussdFallback,
              },
              {
                key: 'voiceHausaZarma',
                title: 'Synthèse & Reconnaissance Vocale Hausa / Zarma',
                description:
                  "Couche de transcription audio locale adaptée aux accents et langues locales sahéliennes pour les analphabètes.",
                active: featureFlags.voiceHausaZarma,
              },
              {
                key: 'offlinePwaV2',
                title: 'Synchronisation PWA Hors-ligne Avancée V2',
                description:
                  'Mise en cache intelligente des cartes Barewa Maps et cours Barewa Académie avec reprise automatique.',
                active: featureFlags.offlinePwaV2,
              },
              {
                key: 'satelliteAgroIngest',
                title: 'Flux d Imagerie Satellitaire Directe Sentinel-2 (Bêta)',
                description:
                  'Ingestion satellitaire automatique pour la détection de sécheresse et l indice de végétation NDVI au Niger.',
                active: featureFlags.satelliteAgroIngest,
              },
            ].map((flag) => (
              <div
                key={flag.key}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-semibold text-slate-200 text-xs">{flag.title}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5">{flag.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setFeatureFlags((prev) => ({
                      ...prev,
                      [flag.key]: !prev[flag.key as keyof typeof featureFlags],
                    }))
                  }
                  className={`w-11 h-6 rounded-full p-1 transition-colors relative shrink-0 ${
                    flag.active ? 'bg-amber-600' : 'bg-slate-800'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      flag.active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
