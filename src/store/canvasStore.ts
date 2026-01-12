import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export interface StickyNote {
  id: string;
  content: string;
  color?: string;
  createdAt: number;
}

export interface CanvasBlock {
  key: string;
  title: string;
  description: string;
  themeColor: string;
  notes: StickyNote[];
}

export interface CanvasState {
  blocks: {
    key_partners: CanvasBlock;
    key_activities: CanvasBlock;
    key_resources: CanvasBlock;
    value_propositions: CanvasBlock;
    customer_relationships: CanvasBlock;
    channels: CanvasBlock;
    customer_segments: CanvasBlock;
    cost_structure: CanvasBlock;
    revenue_streams: CanvasBlock;
    [key: string]: CanvasBlock;
  };
}

const defaultBlocks: { [key: string]: Omit<CanvasBlock, 'notes'> } = {
  key_partners: {
    key: 'key_partners',
    title: '重要合作',
    description: '谁是我们的重要伙伴？谁是重要供应商？',
    themeColor: 'theme-backstage',
  },
  key_activities: {
    key: 'key_activities',
    title: '关键业务',
    description: '为了提供价值主张，我们需要做什么？',
    themeColor: 'theme-backstage',
  },
  key_resources: {
    key: 'key_resources',
    title: '核心资源',
    description: '我们需要什么样的核心资源？',
    themeColor: 'theme-backstage',
  },
  value_propositions: {
    key: 'value_propositions',
    title: '价值主张',
    description: '我们为客户创造了什么价值？',
    themeColor: 'theme-value',
  },
  customer_relationships: {
    key: 'customer_relationships',
    title: '客户关系',
    description: '我们与客户建立什么样的关系？',
    themeColor: 'theme-frontstage',
  },
  channels: {
    key: 'channels',
    title: '渠道通路',
    description: '我们通过哪些渠道接触客户？',
    themeColor: 'theme-frontstage',
  },
  customer_segments: {
    key: 'customer_segments',
    title: '客户群体',
    description: '我们要为谁创造价值？谁是重要客户？',
    themeColor: 'theme-frontstage',
  },
  cost_structure: {
    key: 'cost_structure',
    title: '成本结构',
    description: '商业模式中最重要的固有成本是什么？',
    themeColor: 'theme-finance',
  },
  revenue_streams: {
    key: 'revenue_streams',
    title: '收入来源',
    description: '客户愿意为哪些价值付费？',
    themeColor: 'theme-finance',
  },
};

export const useCanvasStore = defineStore('canvas', {
  state: (): CanvasState => {
    // Try to load from localStorage
    const savedBlocks = localStorage.getItem('canvas_blocks');
    if (savedBlocks) {
      try {
        const parsed = JSON.parse(savedBlocks);
        // Merge with default structure to ensure all keys exist
        const mergedBlocks: any = {};
        for (const key in defaultBlocks) {
          mergedBlocks[key] = { 
            ...defaultBlocks[key], 
            notes: parsed[key]?.notes || [] 
          };
        }
        return { blocks: mergedBlocks };
      } catch (e) {
        console.error('Failed to parse saved canvas blocks', e);
      }
    }

    // Initialize blocks with empty notes
    const blocks: any = {};
    for (const key in defaultBlocks) {
      blocks[key] = { ...defaultBlocks[key], notes: [] };
    }
    return { blocks };
  },
  actions: {
    // Helper to save state
    saveState() {
      localStorage.setItem('canvas_blocks', JSON.stringify(this.blocks));
    },

    addNote(blockKey: string, content: string = '新想法') {
      const block = this.blocks[blockKey];
      if (block) {
        block.notes.push({
          id: uuidv4(),
          content,
          createdAt: Date.now(),
          color: ['yellow', 'blue', 'green', 'pink', 'purple'][Math.floor(Math.random() * 5)]
        });
        this.saveState();
      }
    },
    
    updateNote(blockKey: string, noteId: string, content: string) {
      const block = this.blocks[blockKey];
      if (block) {
        const note = block.notes.find((n: any) => n.id === noteId);
        if (note) {
          note.content = content;
          this.saveState();
        }
      }
    },
    
    deleteNote(blockKey: string, noteId: string) {
      const block = this.blocks[blockKey];
      if (block) {
        block.notes = block.notes.filter((n: any) => n.id !== noteId);
        this.saveState();
      }
    },

    moveNote(fromBlockKey: string, toBlockKey: string, noteId: string, newIndex?: number) {
      // Find and remove from source
      const sourceBlock = this.blocks[fromBlockKey];
      if (!sourceBlock) return;
      
      const noteIndex = sourceBlock.notes.findIndex(n => n.id === noteId);
      if (noteIndex === -1) return;
      
      const deletedNotes = sourceBlock.notes.splice(noteIndex, 1);
      const note = deletedNotes[0];
      
      if (!note) return;
      
      // Add to destination
      const destBlock = this.blocks[toBlockKey];
      if (!destBlock) return;

      if (newIndex !== undefined && newIndex >= 0) {
        destBlock.notes.splice(newIndex, 0, note);
      } else {
        destBlock.notes.push(note);
      }
      this.saveState();
    },

    resetCanvas() {
      const blocks: any = {};
      for (const key in defaultBlocks) {
        blocks[key] = { ...defaultBlocks[key], notes: [] };
      }
      this.blocks = blocks;
      this.saveState();
    }
  },
});
