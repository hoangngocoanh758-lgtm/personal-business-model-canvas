<template>
  <div class="min-h-screen font-sans selection:bg-blue-100/50">
    <!-- Navbar -->
    <header class="fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-md border-b border-white/40 z-50 flex items-center justify-between px-6 shadow-sm">
      <div class="flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" class="w-8 h-8 rounded-lg shadow-lg" />
        <h1 class="font-bold text-xl tracking-tight text-slate-800">个人商业模式画布</h1>
      </div>
      
      <div class="flex items-center gap-3">
        <button 
          @click="toggleAi"
          class="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-white font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
        >
          <span>✨</span>
          <span class="hidden sm:inline">AI 商业顾问</span>
        </button>
        
        <button 
          @click="exportCanvas"
          class="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 text-slate-700 font-medium shadow-sm hover:bg-gray-50 transition-colors active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          <span class="hidden sm:inline">导出图片</span>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="pt-24 pb-12 px-4 min-h-screen overflow-x-hidden" id="canvas-area">
      
      <!-- Mobile Tabs (Visible on small screens) -->
      <div class="md:hidden mb-6">
        <div class="flex p-1 bg-white/50 backdrop-blur rounded-xl shadow-inner overflow-x-auto">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="currentTab = tab.id"
            class="flex-1 py-2 px-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
            :class="currentTab === tab.id ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Canvas Grid (Desktop) -->
      <div class="canvas-grid hidden md:grid" v-auto-animate>
        <div class="area-kp"><CanvasBlock :block="store.blocks.key_partners" /></div>
        <div class="area-ka"><CanvasBlock :block="store.blocks.key_activities" /></div>
        <div class="area-kr"><CanvasBlock :block="store.blocks.key_resources" /></div>
        <div class="area-vp"><CanvasBlock :block="store.blocks.value_propositions" /></div>
        <div class="area-cr"><CanvasBlock :block="store.blocks.customer_relationships" /></div>
        <div class="area-ch"><CanvasBlock :block="store.blocks.channels" /></div>
        <div class="area-cs"><CanvasBlock :block="store.blocks.customer_segments" /></div>
        <div class="area-co"><CanvasBlock :block="store.blocks.cost_structure" /></div>
        <div class="area-rs"><CanvasBlock :block="store.blocks.revenue_streams" /></div>
      </div>

      <!-- Mobile View (Filtered Blocks) -->
      <div class="md:hidden flex flex-col gap-4" v-auto-animate>
        <CanvasBlock 
          v-for="block in mobileBlocks" 
          :key="block.key" 
          :block="block" 
          class="min-h-[300px]"
        />
      </div>

    </main>

    <!-- AI Sidebar (Chat Interface) -->
    <div 
      class="fixed inset-y-0 right-0 w-96 bg-white/95 backdrop-blur-2xl shadow-2xl transform transition-transform duration-300 z-50 flex flex-col border-l border-white/50"
      :class="showAi ? 'translate-x-0' : 'translate-x-full'"
    >
      <!-- Chat Header -->
      <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-white/50">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <h2 class="font-bold text-lg text-slate-800">DeepSeek 商业顾问</h2>
        </div>
        <div class="flex items-center gap-1">
          <button 
            @click="showSettings = !showSettings" 
            class="p-2 hover:bg-gray-100 rounded-full text-slate-500 transition-colors"
            :class="{'bg-gray-100 text-slate-800': showSettings}"
            title="设置"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
          <button @click="showAi = false" class="p-2 hover:bg-gray-100 rounded-full text-slate-500 transition-colors" title="关闭">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>
      
      <!-- Settings Panel -->
      <div v-if="showSettings" class="flex-1 p-6 bg-slate-50 overflow-y-auto" v-auto-animate>
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
            模型配置
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">DeepSeek API Key</label>
              <div class="relative">
                <input 
                  v-model="tempApiKey" 
                  type="password" 
                  placeholder="sk-..." 
                  class="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all"
                />
                <div class="absolute right-3 top-2.5 text-slate-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
              </div>
              <p class="text-xs text-slate-500 mt-2 leading-relaxed">
                您的 Key 仅存储在本地浏览器中，不会上传到任何服务器。
                <a href="https://platform.deepseek.com/api_keys" target="_blank" class="text-indigo-500 hover:text-indigo-600 hover:underline">获取 API Key &rarr;</a>
              </p>
            </div>

            <div class="pt-2 flex flex-col gap-3">
              <button 
                @click="saveSettings"
                class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-indigo-200"
              >
                保存配置
              </button>
              
              <div class="flex gap-3">
                <button 
                  v-if="apiKey"
                  @click="clearSettings"
                  class="flex-1 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl transition-colors"
                >
                  清除 Key
                </button>
                <button 
                  @click="clearAllCache"
                  class="flex-1 px-4 py-2.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-sm font-medium rounded-xl transition-colors"
                >
                  重置所有数据
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
          <h4 class="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">关于 DeepSeek</h4>
          <p class="text-xs text-blue-700/80 leading-relaxed">
            DeepSeek 是深度求索公司开发的先进人工智能模型。配置 API Key 后，您将获得更精准的商业模式分析和建议。
          </p>
        </div>
      </div>

      <!-- Chat Messages Area -->
      <div v-else class="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth" ref="chatContainer">
        <div v-for="msg in chatHistory" :key="msg.id" class="flex flex-col gap-2">
          
          <!-- User Message -->
          <div v-if="msg.role === 'user'" class="self-end max-w-[85%]">
            <div class="bg-slate-800 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm shadow-sm">
              {{ msg.content }}
            </div>
          </div>

          <!-- Assistant Message -->
          <div v-else class="self-start max-w-[95%] flex gap-3">
            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs shrink-0 shadow-sm mt-1">
              DS
            </div>
            <div class="flex flex-col gap-2 w-full">
              <!-- Text Content with Typing Effect -->
              <div 
                class="bg-slate-50 border border-slate-100 text-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm text-sm shadow-sm leading-relaxed markdown-content"
                v-html="renderMarkdown(msg.isTyping ? msg.displayedContent : msg.content)"
              ></div>
              
              <!-- Action Cards (Suggestions) -->
              <div v-if="msg.actions && msg.actions.length > 0 && !msg.isTyping" class="flex flex-col gap-2 mt-1">
                <div 
                  v-for="action in msg.actions" 
                  :key="action.id"
                  @click="!action.isAdded && applySuggestion(action)"
                  class="p-3 bg-white border border-indigo-100 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all group relative cursor-pointer flex items-start gap-3"
                  :class="{'opacity-50 pointer-events-none bg-gray-50': action.isAdded}"
                >
                  <div class="mt-0.5 text-indigo-500">
                    <svg v-if="action.isAdded" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-slate-800">{{ action.text }}</p>
                    <p class="text-xs text-slate-500 mt-1">添加到: {{ getBlockName(action.targetBlock) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isGenerating" class="self-start flex items-center gap-2 ml-11">
          <div class="flex space-x-1">
            <div class="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
          <span class="text-xs text-slate-400">DeepSeek 思考中...</span>
        </div>
      </div>

      <!-- Input Area -->
      <div v-if="!showSettings" class="p-4 border-t border-gray-100 bg-white">
        <!-- Quick Prompts -->
        <div class="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
          <button 
            v-for="prompt in quickPrompts" 
            :key="prompt"
            @click="sendMessage(prompt)"
            class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full whitespace-nowrap transition-colors"
          >
            {{ prompt }}
          </button>
        </div>
        
        <div class="relative">
          <textarea 
            v-model="inputMessage"
            @keydown.enter.prevent="sendMessage(inputMessage)"
            placeholder="输入您的指令，或选择上方快捷指令..."
            class="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-800 focus:border-transparent outline-none resize-none text-sm min-h-[50px] max-h-[120px]"
            rows="1"
          ></textarea>
          <button 
            @click="sendMessage(inputMessage)"
            :disabled="!inputMessage.trim() || isGenerating"
            class="absolute right-2 bottom-2 p-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Overlay for mobile/sidebar -->
    <div 
      v-if="showAi" 
      @click="showAi = false"
      class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import { useCanvasStore } from './store/canvasStore';
import CanvasBlock from './components/CanvasBlock.vue';
import { toPng } from 'html-to-image';
import { v4 as uuidv4 } from 'uuid';
import { marked } from 'marked';

// Types
interface SuggestionAction {
  id: string;
  text: string;
  targetBlock: string;
  isAdded?: boolean;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  displayedContent?: string; // For typing effect
  isTyping?: boolean;
  actions?: SuggestionAction[];
}

const store = useCanvasStore();
const showAi = ref(false);
const showSettings = ref(false);
const apiKey = ref(localStorage.getItem('deepseek_api_key') || '');
const tempApiKey = ref('');
const isGenerating = ref(false);
const inputMessage = ref('');
const chatContainer = ref<HTMLElement | null>(null);

// Initialize temp key when opening settings
watch(showSettings, (newVal) => {
  if (newVal) {
    tempApiKey.value = apiKey.value;
  }
});

const saveSettings = () => {
  if (tempApiKey.value.trim()) {
    apiKey.value = tempApiKey.value.trim();
    localStorage.setItem('deepseek_api_key', apiKey.value);
    showSettings.value = false;
    
    // Add system message if it's the first time
    if (!chatHistory.value.some(m => m.id === 'system-key-set')) {
      chatHistory.value.push({
        id: 'system-key-set',
        role: 'assistant',
        content: 'API Key 已配置成功！我现在可以为您提供更智能的商业分析服务了。',
        isTyping: false
      });
      scrollToBottom();
    }
  }
};

const clearSettings = () => {
  apiKey.value = '';
  tempApiKey.value = '';
  localStorage.removeItem('deepseek_api_key');
};

const clearAllCache = () => {
  if (confirm('⚠️ 确定要重置所有数据吗？\n\n这将清除：\n1. 所有画布内容\n2. 聊天记录\n3. API Key配置\n\n此操作无法撤销！')) {
    // Clear LocalStorage
    localStorage.removeItem('deepseek_api_key');
    localStorage.removeItem('chat_history');
    localStorage.removeItem('canvas_blocks');
    
    // Reset States
    apiKey.value = '';
    tempApiKey.value = '';
    
    // Reset Chat
    chatHistory.value = [
      {
        id: 'welcome',
        role: 'assistant',
        content: '你好！我是你的个人商业模式顾问。我可以帮你分析当前画布，或者提供灵感建议。请告诉我你想从哪个板块开始？',
        displayedContent: '你好！我是你的个人商业模式顾问。我可以帮你分析当前画布，或者提供灵感建议。请告诉我你想从哪个板块开始？',
        isTyping: false
      }
    ];
    
    // Reset Canvas
    store.resetCanvas();
    
    alert('应用已重置，所有数据已清除。');
    showSettings.value = false;
  }
};

// Chat State
const loadChatHistory = () => {
  const saved = localStorage.getItem('chat_history');
  if (saved) {
    try {
      const history = JSON.parse(saved);
      // Ensure no typing effect on load
      history.forEach((msg: ChatMessage) => {
        msg.isTyping = false;
        msg.displayedContent = msg.content;
      });
      return history;
    } catch (e) {
      console.error('Failed to parse chat history', e);
    }
  }
  return [
    {
      id: 'welcome',
      role: 'assistant',
      content: '你好！我是你的个人商业模式顾问。我可以帮你分析当前画布，或者提供灵感建议。请告诉我你想从哪个板块开始？',
      displayedContent: '你好！我是你的个人商业模式顾问。我可以帮你分析当前画布，或者提供灵感建议。请告诉我你想从哪个板块开始？',
      isTyping: false
    }
  ];
};

const chatHistory = ref<ChatMessage[]>(loadChatHistory());

// Persist chat history
watch(chatHistory, (newVal) => {
  localStorage.setItem('chat_history', JSON.stringify(newVal));
}, { deep: true });

const quickPrompts = [
  '分析我的核心资源',
  '生成价值主张建议',
  '优化客户细分',
  '寻找收入来源'
];

// Mobile Tabs
const currentTab = ref('value');
const tabs = [
  { id: 'value', label: '价值' },
  { id: 'backstage', label: '后台' },
  { id: 'frontstage', label: '前台' },
  { id: 'finance', label: '财务' },
];

const mobileBlocks = computed(() => {
  switch (currentTab.value) {
    case 'value': return [store.blocks.value_propositions];
    case 'backstage': return [store.blocks.key_partners, store.blocks.key_activities, store.blocks.key_resources];
    case 'frontstage': return [store.blocks.customer_relationships, store.blocks.channels, store.blocks.customer_segments];
    case 'finance': return [store.blocks.cost_structure, store.blocks.revenue_streams];
    default: return [];
  }
});

const toggleAi = () => {
  showAi.value = !showAi.value;
  if (showAi.value) {
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
};

const getBlockName = (key: string) => {
  const block = store.blocks[key];
  return block ? block.title : key;
};

// Markdown rendering
const renderMarkdown = (text: string = '') => {
  return marked.parse(text);
};

// Simulated Typewriter Effect
const typeMessage = async (msgId: string, fullContent: string, speed = 30) => {
  const message = chatHistory.value.find(m => m.id === msgId);
  if (!message) return;

  message.isTyping = true;
  message.displayedContent = '';
  
  let i = 0;
  return new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (i < fullContent.length) {
        message.displayedContent = (message.displayedContent || '') + fullContent.charAt(i);
        i++;
        scrollToBottom();
      } else {
        clearInterval(interval);
        message.isTyping = false;
        resolve();
      }
    }, speed);
  });
};

// Sync suggestions state with store
const syncSuggestionsState = (blocks: any) => {
  if (!blocks) return;
  chatHistory.value.forEach(msg => {
    if (msg.actions) {
      msg.actions.forEach(action => {
        const block = blocks[action.targetBlock];
        if (block && block.notes) {
          // Check if the note content exists in the block
          const exists = block.notes.some((n: any) => n.content === action.text);
          action.isAdded = exists;
        } else {
          action.isAdded = false;
        }
      });
    }
  });
};

watch(() => store.blocks, (newBlocks) => {
  syncSuggestionsState(newBlocks);
}, { deep: true, immediate: true });

const sendMessage = async (content: string) => {
  if (!content.trim() || isGenerating.value) return;

  // Add User Message
  chatHistory.value.push({
    id: uuidv4(),
    role: 'user',
    content: content
  });
  inputMessage.value = '';
  scrollToBottom();

  // Check for API Key
  if (!apiKey.value) {
    setTimeout(() => {
      chatHistory.value.push({
        id: uuidv4(),
        role: 'assistant',
        content: '请先配置 DeepSeek API Key 以便我为您提供服务。点击右上角的设置图标 ⚙️ 即可配置。',
        isTyping: false
      });
      scrollToBottom();
    }, 500);
    return;
  }

  isGenerating.value = true;

  try {
    // Prepare Context from Store
    const canvasContext = Object.values(store.blocks).map((block: any) => {
      const items = block.notes ? block.notes.map((n: any) => n.content).join(', ') : '';
      return `${block.title}: ${items || '(空)'}`;
    }).join('\n');

    const systemPrompt = `你是一个专业的商业模式画布顾问。你的任务是帮助用户完善他们的个人商业模式画布。
当前画布的内容如下：
${canvasContext}

请根据用户的输入提供建议或分析。如果用户要求生成内容，请给出具体的、有针对性的建议。
保持回答专业、简洁且富有洞察力。
**重要指令**：
如果你的回答中包含可以添加到画布的具体建议（例如价值主张、合作伙伴等），请在回答的最后，务必以JSON格式输出这些建议。
JSON格式必须严格如下，不要包含Markdown代码块标记（如\`\`\`json）：
$$SUGGESTIONS_START$$
[
  {"text": "建议内容1", "targetBlock": "value_propositions"},
  {"text": "建议内容2", "targetBlock": "key_partners"}
]
$$SUGGESTIONS_END$$
其中 targetBlock 必须是以下key之一：key_partners, key_activities, key_resources, value_propositions, customer_relationships, channels, customer_segments, cost_structure, revenue_streams。`;

    // Call DeepSeek API
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.value}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory.value
            .filter(m => m.id !== 'welcome' && m.id !== 'system-key-set' && !m.id.startsWith('system-'))
            .map(m => ({ 
              role: m.role, 
              content: m.content 
            }))
            .slice(-10) // Context window
        ],
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    let aiContent = data.choices[0].message.content;
    let actions: SuggestionAction[] = [];

    // Parse suggestions
    const suggestionStart = aiContent.indexOf('$$SUGGESTIONS_START$$');
    if (suggestionStart !== -1) {
      const suggestionEnd = aiContent.indexOf('$$SUGGESTIONS_END$$');
      if (suggestionEnd !== -1) {
        try {
          const jsonStr = aiContent.substring(suggestionStart + 21, suggestionEnd);
          const suggestions = JSON.parse(jsonStr);
          actions = suggestions.map((s: any) => ({
            id: uuidv4(),
            text: s.text,
            targetBlock: s.targetBlock,
            isAdded: false
          }));
          // Remove JSON from displayed content
          aiContent = aiContent.substring(0, suggestionStart).trim();
        } catch (e) {
          console.error('Failed to parse suggestions JSON', e);
        }
      }
    }

    const aiMsgId = uuidv4();
    chatHistory.value.push({
      id: aiMsgId,
      role: 'assistant',
      content: aiContent,
      displayedContent: '',
      isTyping: true,
      actions: actions
    });

    isGenerating.value = false;
    await typeMessage(aiMsgId, aiContent);

  } catch (error) {
    console.error('DeepSeek API Error:', error);
    isGenerating.value = false;
    
    chatHistory.value.push({
      id: uuidv4(),
      role: 'assistant',
      content: `抱歉，连接 DeepSeek 服务时出现错误：${error instanceof Error ? error.message : '未知错误'}。请检查您的 API Key 或网络连接。`,
      isTyping: false
    });
    scrollToBottom();
  }
};

const applySuggestion = (action: SuggestionAction) => {
  store.addNote(action.targetBlock, action.text);
  action.isAdded = true;
  // Could add a small toast here
};

const exportCanvas = async () => {
  const element = document.getElementById('canvas-area');
  if (!element) return;
  
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#F5F5F0',
      pixelRatio: 2,
    });
    
    const link = document.createElement('a');
    link.download = `商业模式画布-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Export failed:', err);
    alert('导出失败，请重试。');
  }
};
</script>

<style scoped>
.typing-cursor::after {
  content: '▋';
  display: inline-block;
  vertical-align: baseline;
  animation: blink 1s step-end infinite;
  opacity: 0.7;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Hide scrollbar for chrome/safari/opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.markdown-content :deep(h1), .markdown-content :deep(h2), .markdown-content :deep(h3) {
  font-weight: bold;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: #1e293b;
}

.markdown-content :deep(h1) { font-size: 1.25em; }
.markdown-content :deep(h2) { font-size: 1.1em; }
.markdown-content :deep(h3) { font-size: 1em; }

.markdown-content :deep(ul), .markdown-content :deep(ol) {
  padding-left: 1.5em;
  margin-bottom: 0.75em;
}

.markdown-content :deep(ul) { list-style-type: disc; }
.markdown-content :deep(ol) { list-style-type: decimal; }

.markdown-content :deep(li) {
  margin-bottom: 0.25em;
}

.markdown-content :deep(strong) {
  font-weight: 700;
  color: #0f172a;
}

.markdown-content :deep(p) {
  margin-bottom: 0.75em;
}

.markdown-content :deep(p:last-child) {
  margin-bottom: 0;
}
</style>