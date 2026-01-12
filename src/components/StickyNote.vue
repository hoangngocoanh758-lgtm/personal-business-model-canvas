<template>
  <div
    class="relative p-4 transition-all duration-300 shadow-sm group hover:z-10"
    :class="[
      noteColorClass,
      isEditing ? 'scale-105 shadow-xl z-20 ring-2 ring-black/5' : 'hover:scale-102 hover:shadow-md',
      'cursor-move'
    ]"
    :style="{ 
      transform: `rotate(${rotation}deg)`,
      borderRadius: '2px 2px 2px 20px' 
    }"
    @dblclick.stop="enableEdit"
  >
    <!-- Folded Corner Effect -->
    <div 
      class="absolute bottom-0 left-0 w-4 h-4 bg-black/5 rounded-bl-xl"
      style="border-top-right-radius: 100%; clip-path: polygon(0 100%, 100% 0, 0 0);"
    ></div>

    <!-- Delete Button -->
    <button
      @click.stop="$emit('delete', note.id)"
      class="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-full bg-white text-red-500 shadow-sm hover:bg-red-50 scale-90 hover:scale-100 z-10 border border-gray-100"
      title="删除"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    </button>

    <!-- Content -->
    <div v-if="!isEditing" class="font-handwriting text-lg leading-snug break-words whitespace-pre-wrap min-h-[1.5em] text-slate-700">
      {{ note.content }}
    </div>
    <textarea
      v-else
      ref="textareaRef"
      v-model="localContent"
      @blur="saveEdit"
      @keydown.enter.prevent="saveEdit"
      class="w-full h-full bg-transparent border-none outline-none resize-none font-handwriting text-lg leading-snug overflow-hidden text-slate-800 placeholder-slate-400"
      rows="3"
      placeholder="写下你的想法..."
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import type { StickyNote } from '../store/canvasStore';

const props = defineProps<{
  note: StickyNote;
  blockTheme?: string;
}>();

const emit = defineEmits<{
  (e: 'delete', id: string): void;
  (e: 'update', id: string, content: string): void;
}>();

const isEditing = ref(false);
const localContent = ref(props.note.content);
const rotation = ref(0);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

// Random rotation between -1.5 and 1.5 degree for realism
onMounted(() => {
  rotation.value = Math.random() * 3 - 1.5;
});

const noteColorClass = computed(() => {
  if (props.note.color) return props.note.color;
  
  // Intelligent color mapping based on block theme
  if (props.blockTheme?.includes('backstage')) return 'note-blue';
  if (props.blockTheme?.includes('value')) return 'note-pink'; // Use pink for value to stand out
  if (props.blockTheme?.includes('frontstage')) return 'note-green';
  if (props.blockTheme?.includes('finance')) return 'note-yellow';
  
  return 'note-yellow';
});

const enableEdit = () => {
  isEditing.value = true;
  localContent.value = props.note.content;
  nextTick(() => {
    textareaRef.value?.focus();
  });
};

const saveEdit = () => {
  isEditing.value = false;
  if (localContent.value.trim() !== props.note.content) {
    emit('update', props.note.id, localContent.value);
  }
};
</script>
