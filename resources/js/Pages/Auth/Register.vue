<script setup lang="ts">
import { useForm, Link } from '@inertiajs/vue3';
import { Sparkles, ArrowRight, Lock, Mail, User, Building } from 'lucide-vue-next';

defineProps<{
  error?: string | null;
}>();

const form = useForm({
  name: '',
  email: '',
  password: '',
  workspaceName: '',
});

const submit = () => {
  form.post('/register');
};
</script>

<template>
  <div class="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 relative overflow-hidden">
    <div class="ambient-glow -top-32 left-1/4 w-96 h-96 bg-indigo-600 rounded-full" />
    <div class="ambient-glow -bottom-32 right-1/4 w-96 h-96 bg-emerald-600 rounded-full" />

    <div class="w-full max-w-md relative z-10">
      <div class="text-center mb-8">
        <div class="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 items-center justify-center shadow-glow-primary mb-4">
          <Sparkles class="w-7 h-7 text-white" />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight text-white">
          Create your Workspace
        </h1>
        <p class="mt-2 text-sm text-gray-400">
          Start collaborating with your team in seconds
        </p>
      </div>

      <div class="glass-panel p-8 rounded-2xl border border-white/10 shadow-2xl">
        <div v-if="error" class="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
          {{ error }}
        </div>

        <form @submit.prevent="submit" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1.5">
              Full Name
            </label>
            <div class="relative">
              <User class="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                v-model="form.name"
                placeholder="Jane Developer"
                class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1.5">
              Work Email
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                v-model="form.email"
                placeholder="jane@company.com"
                class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1.5">
              Workspace Name
            </label>
            <div class="relative">
              <Building class="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                v-model="form.workspaceName"
                placeholder="Acme Innovations"
                class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-300 mb-1.5">
              Password
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-gray-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                v-model="form.password"
                placeholder="••••••••"
                class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="form.processing"
            class="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-glow-primary transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{{ form.processing ? 'Creating account...' : 'Create Account' }}</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </form>

        <div class="mt-6 pt-6 border-t border-white/5 text-center text-xs text-gray-400">
          Already have an account?
          <Link href="/login" class="ml-1 text-indigo-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  </div>
</template>
