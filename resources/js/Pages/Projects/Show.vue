<script setup lang="ts">
import { ref, watch } from 'vue';
import { useForm, router } from '@inertiajs/vue3';
import Layout from '../../Components/Layout.vue';
import {
  FolderKanban,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-vue-next';

interface TaskItem {
  id: number;
  project_id: number;
  workspace_id: number;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee_id?: number | null;
  assignee_name?: string | null;
  assignee_avatar?: string | null;
  due_date?: string | null;
  position: number;
}

interface ProjectShowProps {
  user: any;
  workspace: any;
  project: {
    id: number;
    name: string;
    description: string;
    color: string;
    status: string;
  };
  tasks: TaskItem[];
  teamMembers: Array<{
    id: number;
    user_id: number;
    name: string;
    email: string;
    avatar?: string;
  }>;
}

const props = defineProps<ProjectShowProps>();

const COLUMNS = [
  { key: 'backlog', title: 'Backlog', color: 'border-gray-500/30 text-gray-400' },
  { key: 'todo', title: 'To Do', color: 'border-sky-500/30 text-sky-400' },
  { key: 'in_progress', title: 'In Progress', color: 'border-amber-500/30 text-amber-400' },
  { key: 'in_review', title: 'In Review', color: 'border-purple-500/30 text-purple-400' },
  { key: 'done', title: 'Done', color: 'border-emerald-500/30 text-emerald-400' },
] as const;

const tasks = ref<TaskItem[]>([...props.tasks]);
watch(() => props.tasks, (newTasks) => {
  tasks.value = [...newTasks];
});

const modalOpen = ref(false);

const form = useForm({
  project_id: props.project.id,
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignee_id: '',
  due_date: '',
});

const openAddTaskModal = (status: string = 'todo') => {
  form.status = status;
  modalOpen.value = true;
};

const handleCreateTask = () => {
  form.post('/tasks', {
    onSuccess: () => {
      form.reset();
      modalOpen.value = false;
      router.reload({ only: ['tasks'] });
    },
  });
};

const moveTask = async (task: TaskItem, newStatus: TaskItem['status']) => {
  // Optimistic UI update
  tasks.value = tasks.value.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t));

  try {
    await fetch(`/tasks/${task.id}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        status: newStatus,
        position: task.position,
      }),
    });
  } catch {
    router.reload({ only: ['tasks'] });
  }
};

const deleteTask = async (taskId: number) => {
  if (!confirm('Are you sure you want to delete this task?')) return;
  tasks.value = tasks.value.filter((t) => t.id !== taskId);
  router.delete(`/tasks/${taskId}`);
};
</script>

<template>
  <Layout :user="user" :workspace="workspace">
    <div class="h-full flex flex-col space-y-6">
      <!-- Project Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
            :style="{ backgroundColor: project.color }"
          >
            <FolderKanban class="w-5 h-5" />
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center space-x-2">
              <span>{{ project.name }}</span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Sprint Board
              </span>
            </h1>
            <p class="text-xs text-gray-400 mt-0.5">{{ project.description }}</p>
          </div>
        </div>

        <button
          @click="openAddTaskModal('todo')"
          class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-glow-primary transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <Plus class="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      <!-- 5-Column Kanban Board -->
      <div class="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
        <div
          v-for="(col, colIdx) in COLUMNS"
          :key="col.key"
          class="glass-panel p-3.5 rounded-2xl flex flex-col h-full min-h-[500px]"
        >
          <!-- Column Header -->
          <div class="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <div class="flex items-center space-x-2">
              <span :class="`text-xs font-bold uppercase tracking-wider ${col.color}`">
                {{ col.title }}
              </span>
              <span class="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400">
                {{ tasks.filter((t) => t.status === col.key).length }}
              </span>
            </div>

            <button
              @click="openAddTaskModal(col.key)"
              class="p-1 rounded-md text-gray-500 hover:text-white hover:bg-white/5"
              :title="`Add task to ${col.title}`"
            >
              <Plus class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Tasks List -->
          <div class="flex-1 space-y-3 overflow-y-auto pr-1">
            <div
              v-if="tasks.filter((t) => t.status === col.key).length === 0"
              class="h-32 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-xs text-gray-600"
            >
              Empty column
            </div>

            <div
              v-for="t in tasks.filter((t) => t.status === col.key)"
              :key="t.id"
              class="glass-card p-3.5 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-all group relative"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <span class="text-xs font-semibold text-white leading-snug">
                  {{ t.title }}
                </span>
                <button
                  @click="deleteTask(t.id)"
                  class="text-gray-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                  title="Delete task"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>

              <p v-if="t.description" class="text-[11px] text-gray-400 line-clamp-2 mb-3">
                {{ t.description }}
              </p>

              <div class="flex items-center justify-between pt-2 border-t border-white/5">
                <div class="flex items-center space-x-2">
                  <span
                    v-if="t.priority === 'urgent'"
                    class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center space-x-1"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    <span>Urgent</span>
                  </span>
                  <span
                    v-else-if="t.priority === 'high'"
                    class="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  >
                    High
                  </span>
                  <span
                    v-else-if="t.priority === 'medium'"
                    class="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  >
                    Med
                  </span>
                  <span
                    v-else
                    class="text-[10px] font-normal uppercase tracking-wider px-2 py-0.5 rounded bg-gray-500/10 text-gray-400 border border-gray-500/20"
                  >
                    Low
                  </span>

                  <img
                    v-if="t.assignee_avatar"
                    :src="t.assignee_avatar"
                    :alt="t.assignee_name || 'Assignee'"
                    class="w-5 h-5 rounded-full object-cover border border-white/20"
                    :title="t.assignee_name || 'Assignee'"
                  />
                </div>

                <!-- Quick Shift Arrows -->
                <div class="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    v-if="colIdx > 0"
                    @click="moveTask(t, COLUMNS[colIdx - 1]?.key!)"
                    class="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                    :title="`Move to ${COLUMNS[colIdx - 1]?.title}`"
                  >
                    <ChevronLeft class="w-3 h-3" />
                  </button>
                  <button
                    v-if="colIdx < COLUMNS.length - 1"
                    @click="moveTask(t, COLUMNS[colIdx + 1]?.key!)"
                    class="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                    :title="`Move to ${COLUMNS[colIdx + 1]?.title}`"
                  >
                    <ChevronRight class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Task Modal -->
      <div v-if="modalOpen" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl relative">
          <button
            @click="modalOpen = false"
            class="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X class="w-5 h-5" />
          </button>

          <h2 class="text-lg font-bold text-white mb-1">Add Sprint Task</h2>
          <p class="text-xs text-gray-400 mb-5">
            Add an actionable item to {{ project.name }}.
          </p>

          <form @submit.prevent="handleCreateTask" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-gray-300 mb-1">
                Task Title
              </label>
              <input
                type="text"
                required
                v-model="form.title"
                placeholder="e.g. Implement OAuth Flow"
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
                placeholder="Requirements, acceptance criteria, or links..."
                class="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  v-model="form.status"
                  class="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="backlog">Backlog</option>
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  v-model="form.priority"
                  class="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-medium text-gray-300 mb-1">
                Assignee
              </label>
              <select
                v-model="form.assignee_id"
                class="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="">Unassigned</option>
                <option v-for="m in teamMembers" :key="m.user_id" :value="m.user_id">
                  {{ m.name }} ({{ m.email }})
                </option>
              </select>
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
                {{ form.processing ? 'Creating...' : 'Create Task' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Layout>
</template>
