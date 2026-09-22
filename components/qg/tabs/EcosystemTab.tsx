'use client';

import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Wrench,
  Power,
  SlidersHorizontal,
  ExternalLink,
  Shield,
  Activity,
  X,
  Radio,
} from 'lucide-react';
import { BarewaService, ServiceStatusType } from '@/types/barewa';

interface EcosystemTabProps {
  services: BarewaService[];
  onToggleServiceEnabled: (id: string) => void;
  onToggleServiceMaintenance: (id: string) => void;
  onUpdateService: (updated: BarewaService) => void;
  onAddService: (newService: BarewaService) => void;
}

export function EcosystemTab({
  services,
  onToggleServiceEnabled,
  onToggleServiceMaintenance,
  onUpdateService,
  onAddService,
}: EcosystemTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingService, setEditingService] = useState<BarewaService | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New service form state
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCode, setNewServiceCode] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<'core' | 'intelligence' | 'social' | 'commerce' | 'mobility' | 'infrastructure'>('social');
  const [newServiceEndpoint, setNewServiceEndpoint] = useState('');
  const [newServiceConnectionMode, setNewServiceConnectionMode] = useState<'REST_API' | 'WEBSOCKET' | 'DIRECT_DB' | 'WEBHOOK'>('REST_API');

  const categories = [
    { id: 'all', label: 'Tous les services' },
    { id: 'intelligence', label: 'Intelligence' },
    { id: 'social', label: 'Social & Éducatif' },
    { id: 'commerce', label: 'Commerce' },
    { id: 'mobility', label: 'Mobilité' },
    { id: 'infrastructure', label: 'Infrastructure & SIG' },
  ];

  const filteredServices = services.filter((svc) => {
    const matchesCategory = selectedCategory === 'all' || svc.category === selectedCategory;
    const matchesSearch =
      svc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      svc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: ServiceStatusType, isMaintenance: boolean, isEnabled: boolean) => {
    if (!isEnabled) {
      return (
        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-mono font-semibold flex items-center gap-1">
          <Power className="w-3 h-3 text-slate-500" /> DÉSACTIVÉ
        </span>
      );
    }
    if (isMaintenance) {
      return (
        <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 text-[10px] font-mono font-semibold flex items-center gap-1">
          <Wrench className="w-3 h-3" /> MAINTENANCE
        </span>
      );
    }
    switch (status) {
      case 'online':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] font-mono font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> EN LIGNE
          </span>
        );
      case 'degraded':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-amber-400 text-[10px] font-mono font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> DÉGRADÉ
          </span>
        );
      case 'deploying':
        return (
          <span className="px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-sky-400 text-[10px] font-mono font-semibold flex items-center gap-1">
            <Radio className="w-3 h-3 text-sky-400" /> DÉPLOIEMENT
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-red-950/80 border border-red-800 text-red-400 text-[10px] font-mono font-semibold flex items-center gap-1">
            HORS-LIGNE
          </span>
        );
    }
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const code = newServiceCode.trim() || `BAREWA_${newServiceName.toUpperCase().replace(/\s+/g, '_')}`;
    const newSvc: BarewaService = {
      id: `srv-${Date.now()}`,
      code,
      name: newServiceName.trim(),
      description: newServiceDesc.trim() || 'Service applicatif connecté au noyau BAREWA CORE.',
      category: newServiceCategory,
      status: 'online',
      version: 'v1.0.0',
      uptimePercent: 100.0,
      lastPingTime: 'À l instant',
      endpointUrl: newServiceEndpoint.trim() || `https://${code.toLowerCase().replace(/_/g, '-')}.barewa.ne/api`,
      connectionMode: newServiceConnectionMode,
      activeUsers24h: 0,
      requestsPerMinute: 0,
      errorRatePercent: 0.0,
      isMaintenance: false,
      isEnabled: true,
      region: 'Sahel Grid (Niamey)',
      tags: ['Nouveau', 'Barewa Core', newServiceCategory],
    };

    onAddService(newSvc);
    setIsAddModalOpen(false);
    setNewServiceName('');
    setNewServiceCode('');
    setNewServiceDesc('');
    setNewServiceEndpoint('');
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-amber-500" />
            <h1 className="text-base font-bold text-white uppercase tracking-wide">
              Écosystème & Registre des Applications Barewa
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Supervision, kill-switch, maintenance et configuration des 8 micro-services connectés à BAREWA CORE.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Enregistrer un Nouveau Service</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-slate-950 font-semibold'
                  : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, code ou tag..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Services Grid (8 Services Cards + Any newly created ones) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
              !svc.isEnabled
                ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                : svc.isMaintenance
                ? 'bg-slate-900/90 border-amber-800/60'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md'
            }`}
          >
            {/* Top info */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                    {svc.code}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight mt-0.5">{svc.name}</h3>
                </div>
                {getStatusBadge(svc.status, svc.isMaintenance, svc.isEnabled)}
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
                {svc.description}
              </p>

              {/* Service Meta Specifications */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] mb-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">Version</span>
                  <span className="font-mono text-slate-200 font-semibold">{svc.version}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Disponibilité (SLA)</span>
                  <span className="font-mono text-emerald-400 font-semibold">{svc.uptimePercent}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Dernière Activité</span>
                  <span className="font-mono text-slate-300">{svc.lastPingTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Mode Connexion</span>
                  <span className="font-mono text-amber-300">{svc.connectionMode}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {svc.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 text-[9px] font-mono"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions Toolbar */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onToggleServiceEnabled(svc.id)}
                  title={svc.isEnabled ? 'Désactiver le service (Kill-Switch)' : 'Activer le service'}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    svc.isEnabled
                      ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:text-red-400'
                      : 'bg-red-950/80 border-red-800 text-red-400 hover:text-emerald-400'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onToggleServiceMaintenance(svc.id)}
                  title={svc.isMaintenance ? 'Désactiver la maintenance' : 'Basculer en maintenance'}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    svc.isMaintenance
                      ? 'bg-amber-950 border-amber-800 text-amber-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-amber-300'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setEditingService(svc)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <SlidersHorizontal className="w-3 h-3 text-amber-400" />
                <span>Configurer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Service Configuration Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-white">
                  Configuration : {editingService.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Point de Terminaison Principal (Endpoint URL)
                </label>
                <input
                  type="text"
                  value={editingService.endpointUrl}
                  onChange={(e) =>
                    setEditingService({ ...editingService, endpointUrl: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Version Active</label>
                  <input
                    type="text"
                    value={editingService.version}
                    onChange={(e) =>
                      setEditingService({ ...editingService, version: e.target.value })
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Protocole d&apos;Échange</label>
                  <select
                    value={editingService.connectionMode}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        connectionMode: e.target.value as 'REST_API' | 'WEBSOCKET' | 'DIRECT_DB' | 'WEBHOOK',
                      })
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="REST_API">REST API (HTTP/2)</option>
                    <option value="WEBSOCKET">WebSocket (Temps réel)</option>
                    <option value="DIRECT_DB">PostgreSQL Direct / Supabase</option>
                    <option value="WEBHOOK">Webhook Event Push</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Région Déploiement</label>
                <input
                  type="text"
                  value={editingService.region}
                  onChange={(e) =>
                    setEditingService({ ...editingService, region: e.target.value })
                  }
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-800/50 text-[11px] text-amber-200">
                <strong>Intégration BAREWA CORE :</strong> Ce service hérite des règles d&apos;authentification
                centralisées et des politiques Row Level Security (RLS).
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateService(editingService);
                  setEditingService(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs"
              >
                Enregistrer les paramètres
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Service Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-white">
                  Enregistrer un Nouveau Service dans BAREWA CORE
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Nom du Service Applicatif *
                </label>
                <input
                  type="text"
                  required
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Ex: Barewa Énergie, Barewa Agro..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Code Service</label>
                  <input
                    type="text"
                    value={newServiceCode}
                    onChange={(e) => setNewServiceCode(e.target.value)}
                    placeholder="BAREWA_ENERGIE"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Catégorie</label>
                  <select
                    value={newServiceCategory}
                    onChange={(e) =>
                      setNewServiceCategory(e.target.value as 'core' | 'intelligence' | 'social' | 'commerce' | 'mobility' | 'infrastructure')
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="social">Social & Communauté</option>
                    <option value="intelligence">Intelligence & IA</option>
                    <option value="commerce">Commerce & Finance</option>
                    <option value="mobility">Mobilité & Transport</option>
                    <option value="infrastructure">Infrastructure & SIG</option>
                    <option value="core">Système Core</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  placeholder="Finalité du service pour les usagers sahéliens..."
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Endpoint d&apos;API</label>
                  <input
                    type="text"
                    value={newServiceEndpoint}
                    onChange={(e) => setNewServiceEndpoint(e.target.value)}
                    placeholder="https://service.barewa.ne/api"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Protocole</label>
                  <select
                    value={newServiceConnectionMode}
                    onChange={(e) =>
                      setNewServiceConnectionMode(e.target.value as 'REST_API' | 'WEBSOCKET' | 'DIRECT_DB' | 'WEBHOOK')
                    }
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="REST_API">REST API</option>
                    <option value="WEBSOCKET">WebSocket</option>
                    <option value="DIRECT_DB">Direct DB (Supabase)</option>
                    <option value="WEBHOOK">Webhook Push</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enregistrer dans le Registre</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
