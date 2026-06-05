<template>
  <component :is="icon" :size="size" :stroke-width="strokeWidth" />
</template>

<script setup lang="ts">
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronUp, Clock, Copy,
  Eye, EyeOff, File, Github, Heading2, Linkedin, List, LogOut, Mail,
  Maximize2, Minimize2, Moon, Pencil, Plus, Quote, Save, Search,
  Settings, Share2, Sun, Trash2, TrendingUp, Twitter, Bold, Italic,
  Link, Code, Code2, X, AlignLeft, Bell, Calendar, AlertCircle,
} from 'lucide-vue-next'

const icons: Record<string, any> = {
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  check: Check,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  clock: Clock,
  copy: Copy,
  eye: Eye,
  eyeOff: EyeOff,
  file: File,
  github: Github,
  heading: Heading2,
  linkedin: Linkedin,
  list: List,
  logout: LogOut,
  mail: Mail,
  maximize: Maximize2,
  minimize: Minimize2,
  moon: Moon,
  pencil: Pencil,
  plus: Plus,
  quote: Quote,
  save: Save,
  search: Search,
  settings: Settings,
  share: Share2,
  sun: Sun,
  trash: Trash2,
  trending: TrendingUp,
  twitter: Twitter,
  bold: Bold,
  italic: Italic,
  link: Link,
  code: Code,
  codeBlock: Code2,
  x: X,
  wordcount: AlignLeft,
  bell: Bell,
  calendar: Calendar,
  alertCircle: AlertCircle,
}

const props = withDefaults(defineProps<{
  name: string
  size?: number
  strokeWidth?: number
}>(), {
  size: 18,
  strokeWidth: 1.75,
})

const icon = computed(() => icons[props.name] ?? File)
</script>
