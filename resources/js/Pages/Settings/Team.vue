<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from '@inertiajs/vue3';
import Layout from '../../Components/Layout.vue';
import {
  Users,
  UserPlus,
  Copy,
  Check,
  Key,
  Mail,
} from 'lucide-vue-next';

interface TeamProps {
  user: any;
  workspace: any;
  members: Array<{
    id: number;
    user_id: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    created_at: string;
  }>;
  invitations: Array<{
    id: number;
    email: string;
    role: string;
    expires_at: string;
  }>;
  latestInviteUrl?: string | null;
}

const props = defineProps<TeamProps>();

const copied = ref(false);
const form = useForm({
  email: '',
  role: 'member',
});

const handleInvite = () => {
  form.post('/settings/team/invite', {
    onSuccess: () => form.reset(),
  });
};

const copyInviteUrl = () => {
  if (props.latestInviteUrl) {
    navigator.clipboard.writeText(props.latestInviteUrl);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }
};
</script>

<template>
  <Layout :user="user" :workspace="workspace">
    <div class="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
          <Users class="w-7 h-7 text-indigo-400" />
          <span>Team & Access Control</span>
        </h1>
        <p class="mt-1 text-sm text-gray-400">
          Manage workspace members, role permissions, and tamper-proof signed invites.
        </p>
      </div>

      <!-- Signed URL Generated Alert -->
      <div v-if="latestInviteUrl" class="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-2">
        <div class="flex items-center space-x-2 text-xs font-semibold text-indigo-300">
          <Key class="w-4 h-4 text-indigo-400" />
          <span>Tamper-Proof Signed Invitation URL Generated (AeroJS SignedUrl):</span>
        </div>
        <div class="flex items-center space-x-2">
          <input
            type="text"
            readonly
            :value="latestInviteUrl"
            class="flex-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-gray-300 font-mono select-all focus:outline-none"
          />
          <button
            type="button"
            @click="copyInviteUrl"
            class="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Check v-if="copied" class="w-4 h-4 text-white" />
            <Copy v-else class="w-4 h-4" />
            <span>{{ copied ? 'Copied' : 'Copy' }}</span>
          </button>
        </div>
        <p class="text-[11px] text-gray-500">
          This URL includes an HMAC cryptographic signature valid for 7 days.
        </p>
      </div>

      <!-- Invite Member Card -->
      <div class="glass-panel p-6 rounded-2xl border border-white/5">
        <div class="flex items-center space-x-2 mb-4">
          <UserPlus class="w-5 h-5 text-indigo-400" />
          <h2 class="text-base font-bold text-white">Invite Team Member</h2>
        </div>

        <form @submit.prevent="handleInvite" class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <Mail class="w-4 h-4 text-gray-500 absolute left-3 top-3" />
            <input
              type="email"
              required
              v-model="form.email"
              placeholder="colleague@company.com"
              class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            v-model="form.role"
            class="px-3 py-2.5 rounded-xl bg-gray-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            :disabled="form.processing"
            class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow-primary transition-all flex items-center justify-center space-x-2 whitespace-nowrap"
          >
            <span>{{ form.processing ? 'Generating...' : 'Send Signed Invite' }}</span>
          </button>
        </form>
      </div>

      <!-- Active Members Table -->
      <div class="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div class="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 class="text-sm font-bold text-white">Active Members ({{ members.length }})</h2>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-white/[0.02] border-b border-white/5 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th class="py-3 px-4">Member</th>
                <th class="py-3 px-4">Role</th>
                <th class="py-3 px-4">Joined</th>
                <th class="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-gray-300">
              <tr v-for="m in members" :key="m.id" class="hover:bg-white/[0.02] transition-colors">
                <td class="py-3 px-4">
                  <div class="flex items-center space-x-3">
                    <img
                      :src="m.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'"
                      :alt="m.name"
                      class="w-8 h-8 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div class="font-semibold text-white">{{ m.name }}</div>
                      <div class="text-[10px] text-gray-500">{{ m.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="py-3 px-4">
                  <span class="capitalize font-semibold text-xs text-indigo-300">
                    {{ m.role }}
                  </span>
                </td>
                <td class="py-3 px-4 text-gray-500">
                  {{ new Date(m.created_at).toLocaleDateString([], {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }) }}
                </td>
                <td class="py-3 px-4 text-right">
                  <span class="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Layout>
</template>
