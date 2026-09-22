import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  ChatMessage,
  BAPEvent,
  ApprovalRequest,
  BarewaAgent,
  DevForceMission,
} from '@/types/barewa';
import { INITIAL_AGENTS, INITIAL_MISSIONS } from '@/lib/demo-data';
import { getAgentPersonaPrompt } from '@/lib/bap-gateway';

// Lazy client holder for Gemini
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      action,
      conversationId,
      senderName,
      text,
      targetAgentId,
      isTeamWarRoom,
      missionId,
      applicationConcerned,
      proposalData,
      approvalId,
      decision,
      decisionNotes,
    } = body;

    const timestamp = new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // ----------------------------------------------------
    // Action 1: Create Mission from Conversation
    // ----------------------------------------------------
    if (action === 'create_mission') {
      const newMissionId = `BAREWA-MISSION-${Date.now().toString().slice(-4)}`;
      const newMission: DevForceMission = {
        mission_id: proposalData?.mission_id || newMissionId,
        title: proposalData?.title || `Nouvelle Mission DEV FORCE : ${text?.slice(0, 40) || 'Optimisation'}`,
        objective: proposalData?.objective || text || 'Mise en œuvre technique coordonnée par BAREWA DEV FORCE.',
        application: proposalData?.application || applicationConcerned || 'Barewa Core',
        priority: proposalData?.priority || 'HIGH',
        risk: proposalData?.risk || 'MEDIUM',
        status: 'IN_PROGRESS',
        assignedAgents: proposalData?.assignedAgents || ['DEV-001', 'ARCH-001', 'DB-001', 'QA-001', 'SEC-001'],
        constraints: [
          'Zéro régression sur BAREWA CORE',
          'Vérification des règles Row Level Security (RLS)',
          'Optimisation bande passante 2G/3G Sahel',
          'Validation préalable obligatoire pour tout changement critique',
        ],
        progress: 15,
        deploymentStatus: 'PENDING',
        conversationId: conversationId || 'conv-team-warroom',
        createdAt: new Date().toLocaleDateString('fr-FR') + ' ' + timestamp,
        updatedAt: new Date().toLocaleDateString('fr-FR') + ' ' + timestamp,
        finalReport: 'Mission initialisée depuis le Cockpit QG. Agents mobilisés en War Room.',
      };

      const event: BAPEvent = {
        id: `bap-ev-${Date.now()}`,
        timestamp,
        agentId: 'ARCH-001',
        agentName: 'Barewa Architecte Système',
        agentRole: 'architect',
        eventType: 'TASK_STARTED',
        description: `Mission #${newMission.mission_id} (${newMission.title}) officiellement enregistrée et transmise à DEV FORCE.`,
        missionId: newMission.mission_id,
        state: 'working',
      };

      return NextResponse.json({
        success: true,
        mission: newMission,
        event,
      });
    }

    // ----------------------------------------------------
    // Action 2: Submit Approval Decision (Approval Center)
    // ----------------------------------------------------
    if (action === 'submit_approval') {
      const isApproved = decision === 'APPROVED';
      const event: BAPEvent = {
        id: `bap-ev-${Date.now()}`,
        timestamp,
        agentId: 'SEC-001',
        agentName: 'Barewa SecOps Guardian',
        agentRole: 'security',
        eventType: isApproved ? 'DEPLOYED' : 'ERROR',
        description: isApproved
          ? `Décision QG : Demande #${approvalId} APPROUVÉE par l'Architecte Principal. Verrou levé pour exécution.`
          : `Décision QG : Demande #${approvalId} REJETÉE. Opération bloquée et archivée dans le journal d'audit.`,
        missionId: missionId || 'BAREWA-TAXI-QR-001',
        state: isApproved ? 'finished' : 'error',
      };

      return NextResponse.json({
        success: true,
        approvalId,
        decision,
        decidedAt: new Date().toLocaleDateString('fr-FR') + ' ' + timestamp,
        decidedBy: 'taktaktaxi2026@gmail.com (Architecte QG)',
        decisionNotes: decisionNotes || (isApproved ? 'Validé par le Cockpit QG' : 'Non autorisé'),
        event,
      });
    }

    // ----------------------------------------------------
    // Action 3: Chat with Agents (Individual or Team War Room)
    // ----------------------------------------------------
    const targetAgent: BarewaAgent =
      INITIAL_AGENTS.find((a) => a.agent_id === targetAgentId) || INITIAL_AGENTS[0];
    const mission = INITIAL_MISSIONS.find((m) => m.mission_id === missionId);

    const generatedMessages: ChatMessage[] = [];
    const generatedEvents: BAPEvent[] = [];
    let approvalRequest: ApprovalRequest | undefined = undefined;

    const ai = getGeminiClient();

    if (isTeamWarRoom) {
      // --------------------------------------------------
      // WAR ROOM MODE (Multi-Agent Collaborative Exchange)
      // --------------------------------------------------
      // Multiple agents participate sequentially:
      // 1. ARCHITECT / DEV responds
      // 2. DATABASE or SECURITY adds constraints
      // 3. QA summarizes tests

      let devResponseText = '';
      if (ai) {
        try {
          const prompt = `${getAgentPersonaPrompt(targetAgent, mission)}
Message de l'Architecte QG dans la War Room : "${text}"
Réponds de manière technique en concertation avec tes collègues (Architecte, Database, QA, Security).`;
          const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });
          devResponseText = result.text || '';
        } catch (e) {
          console.warn('Gemini call fallback in War Room:', e);
        }
      }

      if (!devResponseText) {
        devResponseText = `Bien reçu l'instruction concernant ${applicationConcerned || 'le service'}. Je synchronise la structure de composants avec les contraintes d'isolation BAREWA CORE. L'implémentation est prête pour intégration dans la branche de travail.`;
      }

      // DEV Message
      generatedMessages.push({
        id: `msg-dev-${Date.now()}`,
        conversationId,
        senderId: targetAgent.agent_id,
        senderName: targetAgent.name,
        senderRole: targetAgent.role,
        senderAvatar: targetAgent.avatar,
        text: devResponseText,
        timestamp,
      });

      generatedEvents.push({
        id: `bap-ev-${Date.now()}-1`,
        timestamp,
        agentId: targetAgent.agent_id,
        agentName: targetAgent.name,
        agentRole: targetAgent.role,
        eventType: 'CODE_GENERATION',
        description: `${targetAgent.name} a analysé la demande et synchronisé le plan d'action.`,
        missionId,
        state: 'working',
      });

      // DATABASE / SECURITY intervention if database/migration or sensitive mentioned
      const lower = text.toLowerCase();
      const mentionsDB =
        lower.includes('base') ||
        lower.includes('table') ||
        lower.includes('sql') ||
        lower.includes('schéma') ||
        lower.includes('données') ||
        lower.includes('réservation') ||
        lower.includes('taxi');

      if (mentionsDB) {
        const dbAgent = INITIAL_AGENTS.find((a) => a.role === 'database') || INITIAL_AGENTS[2];
        generatedMessages.push({
          id: `msg-db-${Date.now() + 1}`,
          conversationId,
          senderId: dbAgent.agent_id,
          senderName: dbAgent.name,
          senderRole: dbAgent.role,
          senderAvatar: dbAgent.avatar,
          text: `J'ai vérifié le schéma PostgreSQL. Pour garantir le cloisonnement RLS, la table associée appliquera 'ENABLE ROW LEVEL SECURITY' avec vérification obligatoire du token de session. Aucun accès en bypass n'est permis.`,
          timestamp,
        });

        // Security check
        const secAgent = INITIAL_AGENTS.find((a) => a.role === 'security') || INITIAL_AGENTS[4];
        const newAppId = `APP-${Date.now().toString().slice(-4)}`;
        approvalRequest = {
          id: newAppId,
          mission_id: missionId || 'BAREWA-TAXI-QR-001',
          requesterAgentId: dbAgent.agent_id,
          requesterAgentName: dbAgent.name,
          title: `Validation Schéma DDL & Politiques RLS pour ${applicationConcerned || 'Barewa Taxi'}`,
          description: `Création sécurisée des tables et activation des règles RLS auth.uid(). Requiert l'approbation formelle de l'Architecte QG.`,
          targetResource: `PostgreSQL Supabase (Production) — ${applicationConcerned || 'Barewa Mobility'}`,
          riskLevel: 'MEDIUM',
          status: 'PENDING',
          createdAt: new Date().toLocaleDateString('fr-FR') + ' ' + timestamp,
          proposedDiff: `-- DDL généré par BAREWA DEV FORCE
ALTER TABLE public.barewa_taxi_trips ADD COLUMN IF NOT EXISTS qr_token VARCHAR(64) UNIQUE;
CREATE TABLE IF NOT EXISTS public.barewa_taxi_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES public.barewa_taxi_trips(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.barewa_taxi_bookings ENABLE ROW LEVEL SECURITY;`,
        };

        generatedMessages.push({
          id: `msg-sec-${Date.now() + 2}`,
          conversationId,
          senderId: secAgent.agent_id,
          senderName: secAgent.name,
          senderRole: secAgent.role,
          senderAvatar: secAgent.avatar,
          text: `⚠️ Alerte de gouvernance : Toute modification DDL ou de sécurité nécessite la validation formelle du Cockpit QG. Demande d'approbation #${newAppId} émise vers le Centre d'Approbation !`,
          timestamp,
          requiresApproval: true,
          approvalId: newAppId,
        });

        generatedEvents.push({
          id: `bap-ev-${Date.now()}-2`,
          timestamp,
          agentId: secAgent.agent_id,
          agentName: secAgent.name,
          agentRole: secAgent.role,
          eventType: 'APPROVAL_REQUIRED',
          description: `Demande d'approbation #${newAppId} soumise au QG pour validation DDL/RLS.`,
          missionId,
          state: 'approval_requested',
        });
      } else {
        // QA Agent feedback
        const qaAgent = INITIAL_AGENTS.find((a) => a.role === 'qa') || INITIAL_AGENTS[3];
        generatedMessages.push({
          id: `msg-qa-${Date.now() + 3}`,
          conversationId,
          senderId: qaAgent.agent_id,
          senderName: qaAgent.name,
          senderRole: qaAgent.role,
          senderAvatar: qaAgent.avatar,
          text: `Je lance la suite de tests unitaires et de simulation 2G pour vérifier l'absence d'impact négatif sur les modules existants. Tous les voyants sont au vert.`,
          timestamp,
        });

        generatedEvents.push({
          id: `bap-ev-${Date.now()}-3`,
          timestamp,
          agentId: qaAgent.agent_id,
          agentName: qaAgent.name,
          agentRole: qaAgent.role,
          eventType: 'TEST_RUN',
          description: `Tests de non-régression exécutés avec succès.`,
          missionId,
          state: 'working',
        });
      }
    } else {
      // --------------------------------------------------
      // INDIVIDUAL CHAT MODE (Direct 1-on-1 with Agent)
      // --------------------------------------------------
      let agentResponseText = '';
      if (ai) {
        try {
          const prompt = `${getAgentPersonaPrompt(targetAgent, mission)}
Message de l'utilisateur : "${text}"
Réponds de manière directe, technique et constructive.`;
          const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });
          agentResponseText = result.text || '';
        } catch (e) {
          console.warn('Gemini individual agent fallback:', e);
        }
      }

      if (!agentResponseText) {
        // High quality contextual fallback
        if (targetAgent.role === 'dev') {
          agentResponseText = `J'ai analysé votre demande : "${text}". Côté code, l'architecture Next.js App Router nous permet d'ajouter cette fonctionnalité via un composant isolé sans impacter les routes existantes. Voulez-vous que je formule une proposition de mission formelle pour l'équipe ?`;
        } else if (targetAgent.role === 'architect') {
          agentResponseText = `Du point de vue de l'architecture BAREWA CORE, votre demande est compatible avec le principe de modularité découplée. Je recommande de mobiliser l'agent Database pour les modèles de données et SecOps pour valider la non-exposition de secrets.`;
        } else if (targetAgent.role === 'database') {
          agentResponseText = `Pour répondre à votre requête tout en respectant notre contrainte de 0 FCFA et de sécurité maximale sur Supabase, nous devons appliquer le schéma relationnel avec des politiques Row Level Security (RLS) strictes indexées sur auth.uid().`;
        } else if (targetAgent.role === 'qa') {
          agentResponseText = `J'ai modélisé les cas de test pour cette fonction : tests unitaires Jest, validation de la charge hors-ligne en mode PWA et audit de résilience aux micro-coupures réseau 2G sahéliennes.`;
        } else if (targetAgent.role === 'security') {
          agentResponseText = `Sur le plan de la sécurité : aucun jeton sensible ne sera exposé côté client. Toutes les requêtes sensibles passeront par notre couche d'autorisation QG avec signature cryptographique.`;
        } else {
          agentResponseText = `Bien reçu ! Je prépare le plan de conteneurisation Cloud Run et la configuration de télémétrie BAP pour ce déploiement.`;
        }
      }

      // Check if user is asking to create a mission
      const isAskingMission =
        text.toLowerCase().includes('mission') ||
        text.toLowerCase().includes('projet') ||
        text.toLowerCase().includes('créer') ||
        text.toLowerCase().includes('ajouter') ||
        text.toLowerCase().includes('plan');

      const messageObj: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: targetAgent.agent_id,
        senderName: targetAgent.name,
        senderRole: targetAgent.role,
        senderAvatar: targetAgent.avatar,
        text: agentResponseText,
        timestamp,
      };

      if (isAskingMission) {
        messageObj.actionPayload = {
          type: 'MISSION_PROPOSAL',
          data: {
            title: `Mission ${targetAgent.name} : ${text.slice(0, 45)}...`,
            objective: text,
            application: applicationConcerned || 'Barewa Core',
            priority: 'HIGH',
            risk: 'MEDIUM',
          },
        };
      }

      generatedMessages.push(messageObj);

      generatedEvents.push({
        id: `bap-ev-${Date.now()}`,
        timestamp,
        agentId: targetAgent.agent_id,
        agentName: targetAgent.name,
        agentRole: targetAgent.role,
        eventType: 'ANALYSIS',
        description: `Échange direct avec le Cockpit QG : analyse complétée avec succès.`,
        missionId,
        state: 'working',
      });
    }

    return NextResponse.json({
      success: true,
      messages: generatedMessages,
      events: generatedEvents,
      approvalRequest,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne passerelle BAP';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
