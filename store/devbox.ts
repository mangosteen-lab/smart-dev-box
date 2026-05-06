'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DetectionResult, ToolOutput } from '@/lib/tools/types';

interface DevboxState {
  input: string;
  activeToolId: string | null;
  detectionResults: DetectionResult[];
  outputs: ToolOutput[];
  history: Array<{ input: string; toolId: string; timestamp: number }>;
  sidebarOpen: boolean;
  isDark: boolean;
  isAiLoading: boolean;
  aiEnabled: boolean;

  setInput: (input: string) => void;
  setActiveToolId: (id: string | null) => void;
  setDetectionResults: (results: DetectionResult[]) => void;
  addOutput: (output: ToolOutput) => void;
  clearOutputs: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setIsDark: (dark: boolean) => void;
  toggleTheme: () => void;
  setIsAiLoading: (loading: boolean) => void;
  setAiEnabled: (enabled: boolean) => void;
  clearHistory: () => void;
}

export const useDevboxStore = create<DevboxState>()(
  persist(
    (set) => ({
      input: '',
      activeToolId: null,
      detectionResults: [],
      outputs: [],
      history: [],
      sidebarOpen: true,
      isDark: true,
      isAiLoading: false,
      aiEnabled: false,

      setInput: (input) => set({ input }),
      setActiveToolId: (id) => set({ activeToolId: id }),
      setDetectionResults: (results) => set({ detectionResults: results }),
      addOutput: (output) =>
        set((state) => ({
          outputs: [
            ...state.outputs.filter((o) => o.toolId !== output.toolId),
            output,
          ],
          history: [
            { input: state.input, toolId: output.toolId, timestamp: output.timestamp },
            ...state.history.slice(0, 49),
          ],
        })),
      clearOutputs: () => set({ outputs: [] }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setIsDark: (dark) => set({ isDark: dark }),
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setIsAiLoading: (loading) => set({ isAiLoading: loading }),
      setAiEnabled: (enabled) => set({ aiEnabled: enabled }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'devbox-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        isDark: state.isDark,
        history: state.history,
      }),
    }
  )
);
