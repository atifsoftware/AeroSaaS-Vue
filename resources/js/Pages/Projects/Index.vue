<script setup lang="ts">
import { ref } from 'vue';
import { Link, useForm } from '@inertiajs/vue3';
import Layout from '../../Components/Layout.vue';
import {
  FolderKanban,
  Plus,
  ArrowRight,
  CheckCircle2,
  X,
} from 'lucide-vue-next';

interface ProjectsProps {
  user: any;
  workspace: any;
  projects: Array<{
    id: number;
    name: string;
    description: string;
    color: string;
    status: string;
    taskCount: number;
    completedCount: number;
    progress: number;
  }>;
}

const props = defineProps<ProjectsProps>();

const modalOpen = ref(false);
const form = useForm({
  name: '',
  description: '',
  color: '#6366F1',
});

const colors = ['#6366F1', '#10B981', '#F59E0B', '#F43F5E', '#0EA5E9', '#8B5CF6'];

const submit = () => {
  form.post('/projects', {
    onSuccess: () => {
      form.reset();
      modalOpen.value = false;
    },
  });
};
</script>

<template>
  <Layout :user="user" :workspace="workspace">
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
            <FolderKanban class="w-7 h-7 text-indigo-400" />
            <span>Projects</span>
          </h1>
          <p class="mt-1 text-sm text-gray-400">
            Manage your engineering sprints, workflows, and task pipelines.
          </p>
        </div>

        <button
          @click="modalOpen = true"
          class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-glow-primary transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus class="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      <!-- Project Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Link
          v-for="proj in projects"
          :key="proj.id"
          :href="`/projects/${proj.id}`"
          class="glass-panel p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between group hover:-translate-y-1"
        >
          <div>
            <div class="flex items-center justify-between mb-4">
              <div
                class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                :style="{ backgroundColor: proj.color }"
              >
                <FolderKanban class="w-5 h-5" />
              </div>
              <span class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {{ proj.status }}
              </span>
            </div>

            <h3 class="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
              {{ proj.name }}
            </h3>
            <p class="mt-1 text-xs text-gray-400 line-clamp-2">
              {{ proj.description || 'No description provided.' }}
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-white/5">
            <div class="flex justify-between items-center text-xs mb-2">
              <div class="flex items-center space-x-1.5 text-gray-400">
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {{ proj.completedCount }}/{{ proj.taskCount }} tasks done
                </span>
              </div>
              <span class="font-bold text-white">{{ proj.progress }}%</span>
            </div>

            <div class="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-4">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{
                  width: `${proj.progress}%`,
                  backgroundColor: proj.color,
                }"
              />
            </div>

            <div class="flex items-center justify-between text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
              <span>Open Kanban Board</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </div>
          </div>
        </Link>
      </div>

      <!-- Create Project Modal -->
      <div v-if="modalOpen" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl relative">
          <button
            @click="modalOpen = false"
            class="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X class="w-5 h-5" />
          </button>

          <h2 class="text-lg font-bold text-white mb-1">Create New Project</h2>
          <p class="text-xs text-gray-400 mb-5">
            Organize your tasks into a dedicated workspace initiative.
          </p>

          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                required
                v-model="form.name"
                placeholder="e.g. Next-Gen Mobile App"
                class="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows="3"
                v-model="form.description"
                placeholder="Brief scope and objectives..."
                class="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-300 mb-2">
                Theme Color
              </label>
              <div class="flex items-center space-x-3">
                <button
                  v-for="c in colors"
                  :key="c"
                  type="button"
                  @click="form.color = c"
                  :class="`w-7 h-7 rounded-full transition-transform ${
                    form.color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0B0F17]' : 'hover:scale-110'
                  }`"
                  :style="{ backgroundColor: c }"
                />
              </div>
            </div>

            <div class="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                @click="modalOpen = false"
                class="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="form.processing"
                class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow-primary transition-all"
              >
                {{ form.processing ? 'Creating...' : 'Create Project' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>
