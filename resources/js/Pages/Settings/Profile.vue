<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import Layout from '../../Components/Layout.vue';
import { User, ShieldCheck, CheckCircle2 } from 'lucide-vue-next';

interface ProfileProps {
  user: any;
  workspace: any;
  success?: boolean;
}

const props = defineProps<ProfileProps>();

const form = useForm({
  name: props.user.name,
  password: '',
});

const submit = () => {
  form.post('/settings/profile');
};
</script>

<template>
  <Layout :user="user" :workspace="workspace">
    <div class="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
          <User class="w-7 h-7 text-indigo-400" />
          <span>Account & Security Settings</span>
        </h1>
        <p class="mt-1 text-sm text-gray-400">
          Manage your personal profile, credentials, and two-factor authentication.
        </p>
      </div>

      <div v-if="success" class="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center space-x-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-400" />
        <span>Profile and security preferences updated successfully!</span>
      </div>

      <div class="glass-panel p-6 rounded-2xl border border-white/5 space-y-6">
        <form @submit.prevent="submit" class="space-y-4">
          <div class="flex items-center space-x-4 pb-4 border-b border-white/5">
            <img
              :src="user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'"
              :alt="user.name"
              class="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/30 shadow-md"
            />
            <div>
              <h3 class="text-base font-bold text-white">{{ user.name }}</h3>
              <p class="text-xs text-gray-400">{{ user.email }}</p>
              <span class="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Workspace Administrator
              </span>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              v-model="form.name"
              class="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1">
              Change Password
            </label>
            <input
              type="password"
              v-model="form.password"
              placeholder="Leave blank to keep existing password"
              class="w-full px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="form.processing"
              class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-glow-primary transition-all flex items-center justify-center space-x-2"
            >
              <span>{{ form.processing ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 2FA Security Card -->
      <div class="glass-panel p-6 rounded-2xl border border-white/5">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Two-Factor Authentication (TOTP)</h3>
              <p class="text-xs text-gray-400">
                Secure your account using Google Authenticator or 1Password via AeroJS TOTP engine.
              </p>
            </div>
          </div>

          <span class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Enabled
          </span>
        </div>
      </div>
    </div>
  </Layout>
</template>
