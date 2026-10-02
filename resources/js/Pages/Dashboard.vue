<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Layout from '../Components/Layout.vue';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Plus,
  Activity,
} from 'lucide-vue-next';

interface DashboardProps {
  user: any;
  workspace: any;
  stats: {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    teamMembersCount: number;
    completionRate: number;
  };
  priorityDistribution: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  projectSummaries: Array<{
    id: number;
    name: string;
    color: string;
    description: string;
    totalTasks: number;
    completedTasks: number;
    progress: number;
  }>;
  recentActivities: Array<{
    id: number;
    action: string;
    details: string;
    user_name: string;
    user_avatar: string;
    created_at: string;
  }>;
}

const props = defineProps<DashboardProps>();

const statCards = [
  {
    title: 'Total Projects',
    value: props.stats.totalProjects,
    change: '+2 this month',
    icon: FolderKanban,
    color: 'from-indigo-600 to-violet-600',
    badge: 'Active',
  },
  {
    title: 'Completed Tasks',
    value: props.stats.completedTasks,
    change: `${props.stats.completionRate}% completion`,
    icon: CheckCircle2,
    color: 'from-emerald-600 to-teal-600',
    badge: 'Done',
  },
  {
    title: 'In Progress',
    value: props.stats.inProgressTasks,
    change: 'Active sprint tasks',
    icon: Clock,
    color: 'from-amber-600 to-orange-600',
    badge: 'WIP',
  },
  {
    title: 'Team Members',
    value: props.stats.teamMembersCount,
    change: 'Collaborating now',
    icon: Users,
    color: 'from-sky-600 to-blue-600',
    badge: 'Online',
  },
];
</script>

<template>
  <Layout :user="user" :workspace="workspace">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Good afternoon, {{ user.name.split(' ')[0] }}</span>
            <span class="text-2xl">👋</span>
          </h1>
          <p class="mt-1 text-sm text-gray-400">
            Here is what's happening across <strong class="text-indigo-400">{{ workspace.name }}</strong> today.
          </p>
        </div>

        <div class="flex items-center space-x-3">
          <Link
            href="/projects"
            class="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white text-xs font-semibold transition-colors flex items-center space-x-2"
          >
            <FolderKanban class="w-4 h-4 text-indigo-400" />
            <span>All Projects</span>
          </Link>
          <Link
            href="/projects"
            class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-glow-primary transition-all flex items-center space-x-2"
          >
            <Plus class="w-4 h-4" />
            <span>Create Project</span>
          </Link>
        </div>
      </div>

      <!-- 4 Quick Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="stat in statCards"
          :key="stat.title"
          class="glass-card p-5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-400">{{ stat.title }}</span>
            <div
              :class="`w-9 h-9 rounded-xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shadow-md`"
            >
              <component :is="stat.icon" class="w-4 h-4" />
            </div>
          </div>
          <div class="mt-4 flex items-baseline justify-between">
            <div class="text-2xl font-bold text-white tracking-tight">{{ stat.value }}</div>
            <span class="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {{ stat.change }}
            </span>
          </div>
        </div>
      </div>

      <!-- Projects Overview & Priority Split -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Active Projects (2 columns) -->
        <div class="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-2">
              <FolderKanban class="w-5 h-5 text-indigo-400" />
              <h2 class="text-base font-bold text-white">Active Projects</h2>
            </div>
            <Link
              href="/projects"
              class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>View all</span>
              <ArrowUpRight class="w-3.5 h-3.5" />
            </Link>
          </div>

          <div class="space-y-4">
            <Link
              v-for="p in projectSummaries"
              :key="p.id"
              :href="`/projects/${p.id}`"
              class="block p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all group"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-3.5 h-3.5 rounded-md shadow-sm"
                    :style="{ backgroundColor: p.color || '#6366F1' }"
                  />
                  <div>
                    <h3 class="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {{ p.name }}
                    </h3>
                    <p class="text-xs text-gray-400 mt-0.5 line-clamp-1">{{ p.description }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs font-bold text-white">{{ p.progress }}%</span>
                  <div class="text-[10px] text-gray-500">
                    {{ p.completedTasks }}/{{ p.totalTasks }} done
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="mt-3 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{
                    width: `${p.progress}%`,
                    backgroundColor: p.color || '#6366F1',
                  }"
                />
              </div>
            </Link>
          </div>
        </div>

        <!-- Priority Distribution Card -->
        <div class="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div class="flex items-center space-x-2 mb-6">
              <TrendingUp class="w-5 h-5 text-emerald-400" />
              <h2 class="text-base font-bold text-white">Workload Breakdown</h2>
            </div>

            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs mb-1.5">
                  <span class="text-rose-400 font-medium flex items-center space-x-1.5">
                    <span class="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Urgent</span>
                  </span>
                  <span class="text-white font-semibold">{{ priorityDistribution.urgent }} tasks</span>
                </div>
                <div class="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-rose-500 h-full rounded-full"
                    :style="{
                      width: `${(priorityDistribution.urgent / (stats.totalTasks || 1)) * 100}%`,
                    }"
                  />
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs mb-1.5">
                  <span class="text-amber-400 font-medium flex items-center space-x-1.5">
                    <span class="w-2 h-2 rounded-full bg-amber-500" />
                    <span>High Priority</span>
                  </span>
                  <span class="text-white font-semibold">{{ priorityDistribution.high }} tasks</span>
                </div>
                <div class="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-amber-500 h-full rounded-full"
                    :style="{
                      width: `${(priorityDistribution.high / (stats.totalTasks || 1)) * 100}%`,
                    }"
                  />
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs mb-1.5">
                  <span class="text-indigo-400 font-medium flex items-center space-x-1.5">
                    <span class="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>Medium Priority</span>
                  </span>
                  <span class="text-white font-semibold">{{ priorityDistribution.medium }} tasks</span>
                </div>
                <div class="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-indigo-500 h-full rounded-full"
                    :style="{
                      width: `${(priorityDistribution.medium / (stats.totalTasks || 1)) * 100}%`,
                    }"
                  />
                </div>
              </div>

              <div>
                <div class="flex justify-between text-xs mb-1.5">
                  <span class="text-gray-400 font-medium flex items-center space-x-1.5">
                    <span class="w-2 h-2 rounded-full bg-gray-500" />
                    <span>Low Priority</span>
                  </span>
                  <span class="text-white font-semibold">{{ priorityDistribution.low }} tasks</span>
                </div>
                <div class="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    class="bg-gray-500 h-full rounded-full"
                    :style="{
                      width: `${(priorityDistribution.low / (stats.totalTasks || 1)) * 100}%`,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div class="text-xs text-gray-400 flex items-center space-x-2">
              <AlertCircle class="w-4 h-4 text-indigo-400 flex-shrink-0" />
              <span>
                Team velocity is up <strong class="text-white">18%</strong> compared to last sprint.
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Activity Feed -->
      <div class="glass-panel p-6 rounded-2xl">
        <div class="flex items-center space-x-2 mb-6">
          <Activity class="w-5 h-5 text-indigo-400" />
          <h2 class="text-base font-bold text-white">Recent Team Activities</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="act in recentActivities"
            :key="act.id"
            class="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center space-x-3"
          >
            <img
              :src="act.user_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'"
              :alt="act.user_name"
              class="w-9 h-9 rounded-full object-cover border border-white/10"
            />
            <div class="flex-1 truncate">
              <div class="text-xs font-semibold text-white">
                {{ act.user_name }} <span class="font-normal text-gray-400">{{ act.details }}</span>
              </div>
              <div class="text-[10px] text-gray-500 mt-0.5">
                {{ new Date(act.created_at).toLocaleString([], {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
