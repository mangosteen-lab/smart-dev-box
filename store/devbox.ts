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
  sidebarMini: boolean;
  mobileSidebarOpen: boolean;
  isDark: boolean;
  isAiLoading: boolean;
  aiEnabled: boolean;
  onboardingSplitInput: string | null;
  onboardingStep: number;   // -1 = guide not active
  recentToolIds: string[];   // last N unique tool ids used
  pinnedToolIds: string[];   // user-pinned tool ids

  setInput: (input: string) => void;
  setActiveToolId: (id: string | null) => void;
  setDetectionResults: (results: DetectionResult[]) => void;
  addOutput: (output: ToolOutput) => void;
  clearOutputs: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSidebarMini: (mini: boolean) => void;
  toggleSidebarMini: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  setIsDark: (dark: boolean) => void;
  toggleTheme: () => void;
  setIsAiLoading: (loading: boolean) => void;
  setAiEnabled: (enabled: boolean) => void;
  clearHistory: () => void;
  setOnboardingSplitInput: (input: string | null) => void;
  setOnboardingStep: (step: number) => void;
  advanceOnboardingStep: () => void;
  addRecentTool: (toolId: string) => void;
  togglePinnedTool: (toolId: string) => void;
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
      sidebarMini: false,
      mobileSidebarOpen: false,
      isDark: true,
      isAiLoading: false,
      aiEnabled: false,
      onboardingSplitInput: null,
      onboardingStep: -1,
      recentToolIds: [],
      pinnedToolIds: [],

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
      setSidebarMini: (mini) => set({ sidebarMini: mini }),
      toggleSidebarMini: () => set((state) => ({ sidebarMini: !state.sidebarMini })),
      setMobileSidebarOpen: (open) => set({ mobileSidebarOpen: open }),
      toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
      setIsDark: (dark) => set({ isDark: dark }),
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setIsAiLoading: (loading) => set({ isAiLoading: loading }),
      setAiEnabled: (enabled) => set({ aiEnabled: enabled }),
      clearHistory: () => set({ history: [] }),
      setOnboardingSplitInput: (input) => set({ onboardingSplitInput: input }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      advanceOnboardingStep: () => set((state) => ({ onboardingStep: state.onboardingStep + 1 })),
      addRecentTool: (toolId) =>
        set((state) => ({
          recentToolIds: [toolId, ...state.recentToolIds.filter((id) => id !== toolId)].slice(0, 10),
        })),
      togglePinnedTool: (toolId) =>
        set((state) => ({
          pinnedToolIds: state.pinnedToolIds.includes(toolId)
            ? state.pinnedToolIds.filter((id) => id !== toolId)
            : [toolId, ...state.pinnedToolIds].slice(0, 20),
        })),
    }),
    {
      name: 'devbox-storage',
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        sidebarMini: state.sidebarMini,
        isDark: state.isDark,
        history: state.history,
        recentToolIds: state.recentToolIds,
        pinnedToolIds: state.pinnedToolIds,
      }),
    }
  )
);
