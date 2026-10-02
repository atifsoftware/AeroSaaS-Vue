import { Hash, DB } from 'aerojs';
import { User } from '../../app/models/User.js';
import { Workspace } from '../../app/models/Workspace.js';
import { WorkspaceMember } from '../../app/models/WorkspaceMember.js';
import { Project } from '../../app/models/Project.js';
import { Task } from '../../app/models/Task.js';
import { ActivityLog } from '../../app/models/ActivityLog.js';

export class DatabaseSeeder {
  public static async run(): Promise<void> {
    console.log('🌱 Seeding AeroSaaS database with demo data...');

    const hashedPassword = await Hash.make('secret123');

    // 1. Create Users
    const alex = await User.create({
      name: 'Alex Rivera',
      email: 'alex@aerosaas.dev',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });

    const sarah = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@aerosaas.dev',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    });

    const david = await User.create({
      name: 'David Kim',
      email: 'david@aerosaas.dev',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    });

    const elena = await User.create({
      name: 'Elena Rostova',
      email: 'elena@aerosaas.dev',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    });

    // 2. Create Workspace
    const workspace = await Workspace.create({
      name: 'Acme HyperScale',
      slug: 'acme-hyperscale',
      owner_id: alex.id,
      plan: 'enterprise',
      logo: '🚀',
    });

    // Update current workspace for users
    alex.current_workspace_id = workspace.id;
    await alex.save();
    sarah.current_workspace_id = workspace.id;
    await sarah.save();
    david.current_workspace_id = workspace.id;
    await david.save();
    elena.current_workspace_id = workspace.id;
    await elena.save();

    // 3. Workspace Memberships
    await WorkspaceMember.create({ workspace_id: workspace.id, user_id: alex.id, role: 'owner' });
    await WorkspaceMember.create({ workspace_id: workspace.id, user_id: sarah.id, role: 'admin' });
    await WorkspaceMember.create({ workspace_id: workspace.id, user_id: david.id, role: 'member' });
    await WorkspaceMember.create({ workspace_id: workspace.id, user_id: elena.id, role: 'member' });

    // 4. Create Projects
    const mobileProject = await Project.create({
      workspace_id: workspace.id,
      name: 'Mobile App v2.0',
      description: 'Next-generation iOS & Android application with offline synchronization.',
      color: '#6366F1',
      status: 'active',
    });

    const aiProject = await Project.create({
      workspace_id: workspace.id,
      name: 'AI Automation Engine',
      description: 'Autonomous multi-agent workflow orchestrator built on LLMs.',
      color: '#10B981',
      status: 'active',
    });

    const securityProject = await Project.create({
      workspace_id: workspace.id,
      name: 'SOC2 & ISO Compliance',
      description: 'Audit preparation, automated policy verification, and access controls.',
      color: '#F59E0B',
      status: 'active',
    });

    // 5. Create Tasks for Mobile Project
    const tasksData = [
      {
        project_id: mobileProject.id,
        workspace_id: workspace.id,
        title: 'Design Biometric Authentication Flow',
        description: 'Create Figma prototypes for FaceID & Fingerprint fallback with haptic feedback.',
        status: 'done',
        priority: 'high',
        assignee_id: sarah.id,
        position: 1,
      },
      {
        project_id: mobileProject.id,
        workspace_id: workspace.id,
        title: 'Optimize SQLite Offline Local Cache',
        description: 'Implement zero-latency read layer with background delta synchronization.',
        status: 'in_progress',
        priority: 'urgent',
        assignee_id: alex.id,
        position: 2,
      },
      {
        project_id: mobileProject.id,
        workspace_id: workspace.id,
        title: 'Integrate Real-Time Push Notifications',
        description: 'Connect APNS and FCM channels via AeroJS NotificationManager.',
        status: 'in_review',
        priority: 'medium',
        assignee_id: david.id,
        position: 3,
      },
      {
        project_id: mobileProject.id,
        workspace_id: workspace.id,
        title: 'App Store Screenshot Asset Generation',
        description: 'Export localized screenshots for 6.7" and 6.1" display form factors.',
        status: 'todo',
        priority: 'low',
        assignee_id: elena.id,
        position: 4,
      },
      {
        project_id: mobileProject.id,
        workspace_id: workspace.id,
        title: 'End-to-End Deep Linking Tests',
        description: 'Verify universal links across Android and iOS edge scenarios.',
        status: 'backlog',
        priority: 'medium',
        assignee_id: null,
        position: 5,
      },

      // Tasks for AI Project
      {
        project_id: aiProject.id,
        workspace_id: workspace.id,
        title: 'Agent Memory Vector Store Integration',
        description: 'Benchmark embedding lookups using HNSW indexing and cosine similarity.',
        status: 'in_progress',
        priority: 'urgent',
        assignee_id: alex.id,
        position: 1,
      },
      {
        project_id: aiProject.id,
        workspace_id: workspace.id,
        title: 'Implement Streaming SSE Gateway',
        description: 'Ensure chunked transfer encoding and zero buffer delay for LLM completions.',
        status: 'done',
        priority: 'high',
        assignee_id: sarah.id,
        position: 2,
      },
      {
        project_id: aiProject.id,
        workspace_id: workspace.id,
        title: 'Tool Calling Safety Sandbox',
        description: 'Enforce strict schema validation and execution time budgets on external tools.',
        status: 'todo',
        priority: 'high',
        assignee_id: david.id,
        position: 3,
      },

      // Tasks for Security Project
      {
        project_id: securityProject.id,
        workspace_id: workspace.id,
        title: 'Rotate Master AES-256 Keys in KeyVault',
        description: 'Automate periodic secret rotation with zero downtime for active sessions.',
        status: 'done',
        priority: 'high',
        assignee_id: sarah.id,
        position: 1,
      },
      {
        project_id: securityProject.id,
        workspace_id: workspace.id,
        title: 'Audit RBAC Policy Matrix with ctx.can()',
        description: 'Verify all project mutation endpoints enforce WorkspacePolicy rules.',
        status: 'in_review',
        priority: 'urgent',
        assignee_id: alex.id,
        position: 2,
      },
    ];

    for (const t of tasksData) {
      await Task.create(t);
    }

    // 6. Create Activity Logs
    const activities = [
      {
        workspace_id: workspace.id,
        user_id: alex.id,
        action: 'created_project',
        details: 'Created project "AI Automation Engine"',
        entity_type: 'project',
        entity_id: aiProject.id,
      },
      {
        workspace_id: workspace.id,
        user_id: sarah.id,
        action: 'completed_task',
        details: 'Completed task "Streaming SSE Gateway"',
        entity_type: 'task',
        entity_id: 7,
      },
      {
        workspace_id: workspace.id,
        user_id: alex.id,
        action: 'moved_task',
        details: 'Moved "Optimize SQLite Offline Local Cache" to In Progress',
        entity_type: 'task',
        entity_id: 2,
      },
      {
        workspace_id: workspace.id,
        user_id: david.id,
        action: 'joined_team',
        details: 'Joined team as Engineer',
        entity_type: 'workspace_member',
        entity_id: 3,
      },
    ];

    for (const a of activities) {
      await ActivityLog.create(a);
    }

    console.log('✅ Demo data successfully seeded!');
    console.log('Credentials:');
    console.log('  Email:    alex@aerosaas.dev');
    console.log('  Password: secret123\n');
  }
}
