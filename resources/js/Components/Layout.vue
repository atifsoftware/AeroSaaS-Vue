<script setup lang="ts">
import { ref } from 'vue';
import { Link, usePage } from '@inertiajs/vue3';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  User,
  LogOut,
  Sparkles,
  BookOpen,
  Menu,
  X,
  ChevronRight,
} from 'lucide-vue-next';

interface Props {
  user: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  workspace: {
    id: number;
    name: string;
    slug: string;
    plan?: string;
    logo?: string;
  };
}

defineProps<Props>();

const page = usePage();
const mobileMenuOpen = ref(false);

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderKanban },
  { name: 'All Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Team & Invites', href: '/settings/team', icon: Users },
  { name: 'Account Settings', href: '/settings/profile', icon: User },
];

const isActive = (path: string) => {
  if (path === '/dashboard' && page.url === '/dashboard') return true;
  if (path !== '/dashboard' && page.url.startsWith(path)) return true;
  return false;
};
</script>

<template>
  <div class="flex h-screen bg-[#0B0F17] text-gray-100 overflow-hidden font-sans">
    <!-- Ambient glowing decorative backgrounds -->
    <div class="ambient-glow -top-40 -left-40 w-96 h-96 bg-indigo-600 rounded-full"></div>
    <div class="ambient-glow -bottom-40 right-20 w-96 h-96 bg-emerald-600 rounded-full"></div>

    <!-- Desktop Sidebar -->
    <aside class="hidden md:flex flex-col w-64 glass-panel border-r border-white/5 z-20">
      <!-- Brand / Logo -->
      <div class="h-16 flex items-center px-6 border-b border-white/5 justify-between">
        <Link href="/dashboard" class="flex items-center space-x-3 group">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform">
            <Sparkles class="w-5 h-5 text-white" />
          </div>
          <div>
            <span class="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-indigo-200 bg-clip-text text-transparent">
              AeroSaaS
            </span>
            <span class="ml-2 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Vue 3
            </span>
          </div>
        </Link>
      </div>

      <!-- Workspace Card -->
      <div class="p-4">
        <div class="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between hover:bg-white/[0.05] transition-colors">
          <div class="flex items-center space-x-3 overflow-hidden">
            <div class="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-sm">
              {{ workspace?.logo || '⚡' }}
            </div>
            <div class="truncate">
              <div class="text-sm font-semibold truncate text-white">
                {{ workspace?.name || 'Workspace' }}
              </div>
              <div class="text-xs text-emerald-400 flex items-center space-x-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span class="capitalize">{{ workspace?.plan || 'Pro' }} Plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 space-y-1 overflow-y-auto">
        <div class="px-3 pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Workspace
        </div>
        <Link
          v-for="item in navItems"
          :key="item.name"
          :href="item.href"
          :class="[
            'flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
            isActive(item.href)
              ? 'bg-indigo-600 text-white shadow-glow-primary'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
          ]"
        >
          <component :is="item.icon" :class="['w-4 h-4', isActive(item.href) ? 'text-white' : 'text-gray-400']" />
          <span>{{ item.name }}</span>
          <ChevronRight v-if="isActive(item.href)" class="w-3.5 h-3.5 ml-auto text-white/70" />
        </Link>

        <div class="pt-6 px-3 pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Developer
        </div>
        <a
          href="/docs"
          target="_blank"
          rel="noreferrer"
          class="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all"
        >
          <BookOpen class="w-4 h-4 text-emerald-400" />
          <span>Swagger API Docs</span>
          <span class="ml-auto text-[10px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
            OpenAPI
          </span>
        </a>
      </nav>

      <!-- User footer -->
      <div class="p-4 border-t border-white/5">
        <div class="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
          <div class="flex items-center space-x-3 overflow-hidden">
            <img
              :src="user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'"
              :alt="user?.name"
              class="w-8 h-8 rounded-full border border-indigo-500/30 object-cover"
            />
            <div class="truncate">
              <div class="text-xs font-semibold text-white truncate">{{ user?.name }}</div>
              <div class="text-[10px] text-gray-400 truncate">{{ user?.email }}</div>
            </div>
          </div>
          <Link
            href="/logout"
            method="post"
            as="button"
            class="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Sign Out"
          >
            <LogOut class="w-4 h-4" />
          </Link>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden relative z-10">
      <!-- Mobile Header -->
      <header class="md:hidden h-14 glass-panel border-b border-white/5 flex items-center justify-between px-4">
        <div class="flex items-center space-x-2">
          <div class="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles class="w-4 h-4 text-white" />
          </div>
          <span class="font-bold text-white text-base">AeroSaaS (Vue)</span>
        </div>
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="p-2 text-gray-400 hover:text-white"
        >
          <X v-if="mobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </header>

      <!-- Mobile Dropdown -->
      <div v-if="mobileMenuOpen" class="md:hidden glass-panel border-b border-white/10 p-4 space-y-2">
        <Link
          v-for="item in navItems"
          :key="item.name"
          :href="item.href"
          @click="mobileMenuOpen = false"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5"
        >
          <component :is="item.icon" class="w-4 h-4" />
          <span>{{ item.name }}</span>
        </Link>
        <Link
          href="/logout"
          method="post"
          as="button"
          class="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-rose-400 w-full"
        >
          <LogOut class="w-4 h-4" />
          <span>Log Out</span>
        </Link>
      </div>

      <!-- Main viewport -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>
