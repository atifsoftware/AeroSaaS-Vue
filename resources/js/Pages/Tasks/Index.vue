<script setup lang="ts">
import { ref, computed } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import Layout from '../../Components/Layout.vue';
import {
  CheckSquare,
  Search,
  Trash2,
} from 'lucide-vue-next';

interface TasksIndexProps {
  user: any;
  workspace: any;
  tasks: Array<{
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    project_id: number;
    project_name: string;
    project_color: string;
    assignee_name?: string | null;
    assignee_avatar?: string | null;
    created_at: string;
  }>;
  projects: Array<{
    id: number;
    name: string;
    color: string;
  }>;
}

const props = defineProps<TasksIndexProps>();

const search = ref('');
const statusFilter = ref('all');
const projectFilter = ref('all');

const filteredTasks = computed(() => {
  return props.tasks.filter((t) => {
    if (search.value && !t.title.toLowerCase().includes(search.value.toLowerCase())) return false;
    if (statusFilter.value !== 'all' && t.status !== statusFilter.value) return false;
    if (projectFilter.value !== 'all' && String(t.project_id) !== projectFilter.value) return false;
    return true;
  });
});

const deleteTask = (id: number) => {
  if (!confirm('Are you sure you want to delete this task?')) return;
  router.delete(`/tasks/${id}`);
};

const getStatusBadgeClass = (status: string) => {
  const colors: Record<string, string> = {
    backlog: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    todo: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    in_review: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    done: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  return colors[status] || colors.todo;
};
</script>

<template>
  <Layout :user="user" :workspace="workspace">
    <div class="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
          <CheckSquare class="w-7 h-7 text-indigo-400" />
          <span>All Tasks</span>
        </h1>
        <p class="mt-1 text-sm text-gray-400">
          Global view across all projects in {{ workspace.name }}.
        </p>
      </div>

      <!-- Filter Bar -->
      <div class="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        <div class="relative w-full md:w-80">
          <Search class="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            v-model="search"
            placeholder="Search tasks..."
            class="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <!-- Status Filter -->
          <select
            v-model="statusFilter"
            class="px-3 py-2 rounded-xl bg-gray-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="done">Done</option>
          </select>

          <!-- Project Filter -->
          <select
            v-model="projectFilter"
            class="px-3 py-2 rounded-xl bg-gray-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Projects</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>

          <span class="text-xs text-gray-400 ml-auto md:ml-2">
            Showing <strong class="text-white">{{ filteredTasks.length }}</strong> tasks
          </span>
        </div>
      </div>

      <!-- Tasks Table -->
      <div class="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-white/[0.02] border-b border-white/5 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th class="py-3.5 px-4">Task</th>
                <th class="py-3.5 px-4">Project</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4">Priority</th>
                <th class="py-3.5 px-4">Assignee</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-gray-300">
              <tr v-if="filteredTasks.length === 0">
                <td :colspan="6" class="py-12 text-center text-gray-500">
                  No matching tasks found.
                </td>
              </tr>
              <tr
                v-for="t in filteredTasks"
                :key="t.id"
                class="hover:bg-white/[0.02] transition-colors group"
              >
                <td class="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                  <Link
                    :href="`/projects/${t.project_id}`"
                    class="hover:text-indigo-400 transition-colors"
                  >
                    {{ t.title }}
                  </Link>
                </td>
                <td class="py-3.5 px-4">
                  <Link
                    :href="`/projects/${t.project_id}`"
                    class="inline-flex items-center space-x-1.5 hover:underline"
                  >
                    <span
                      class="w-2.5 h-2.5 rounded-full"
                      :style="{ backgroundColor: t.project_color || '#6366F1' }"
                    />
                    <span>{{ t.project_name }}</span>
                  </Link>
                </td>
                <td class="py-3.5 px-4">
                  <span
                    :class="`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${getStatusBadgeClass(t.status)}`"
                  >
                    {{ t.status.replace('_', ' ') }}
                  </span>
                </td>
                <td class="py-3.5 px-4">
                  <span class="capitalize font-semibold text-[11px] text-gray-300">
                    {{ t.priority }}
                  </span>
                </td>
                <td class="py-3.5 px-4">
                  <div v-if="t.assignee_name" class="flex items-center space-x-2">
                    <img
                      :src="t.assignee_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'"
                      :alt="t.assignee_name"
                      class="w-5 h-5 rounded-full object-cover border border-white/20"
                    />
                    <span>{{ t.assignee_name }}</span>
                  </div>
                  <span v-else class="text-gray-500">Unassigned</span>
                </td>
                <td class="py-3.5 px-4 text-right">
                  <button
                    @click="deleteTask(t.id)"
                    class="text-gray-500 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete task"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Layout>
</template>
