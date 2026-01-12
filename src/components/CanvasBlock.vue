<template>
  <div class="glass-panel h-full relative group transition-all duration-300 hover:shadow-lg flex flex-col">
    <!-- Header -->
    <div class="px-4 py-3 flex items-center justify-between shrink-0 transition-colors" :class="block.themeColor">
      <div class="flex items-center gap-2">
        <h3 class="font-bold text-lg leading-tight">{{ block.title }}</h3>
        <!-- Tooltip trigger -->
        <div class="relative group/tooltip cursor-help">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed text-center">
            {{ block.description }}
            <div class="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
          </div>
        </div>
      </div>
      
      <!-- Add Button -->
      <button 
        @click="addNote"
        class="p-1.5 rounded-full hover:bg-black/5 transition-colors active:scale-95"
        title="添加想法"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>
    </div>

    <!-- Notes Area -->
    <div 
      class="flex-1 p-3 overflow-y-auto min-h-0 custom-scrollbar"
      @dblclick.self="addNote"
    >
      <VueDraggable
        v-model="notesModel"
        group="canvas-notes"
        :animation="200"
        ghost-class="opacity-40"
        class="h-full min-h-[100px] flex flex-col gap-3 pb-4"
      >
        <StickyNoteComponent
          v-for="note in block.notes"
          :key="note.id"
          :note="note"
          :block-theme="block.themeColor"
          @delete="deleteNote"
          @update="updateNote"
        />
      </VueDraggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import StickyNoteComponent from './StickyNote.vue';
import { useCanvasStore, type CanvasBlock } from '../store/canvasStore';

const props = defineProps<{
  block: CanvasBlock;
}>();

const store = useCanvasStore();

const notesModel = computed({
  get: () => props.block.notes,
  set: (val) => {
    props.block.notes = val;
  }
});

const addNote = () => {
  store.addNote(props.block.key);
};

const deleteNote = (id: string) => {
  store.deleteNote(props.block.key, id);
};

const updateNote = (id: string, content: string) => {
  store.updateNote(props.block.key, id, content);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
