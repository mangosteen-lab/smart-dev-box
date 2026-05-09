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
  mobileSidebarOpen: boolean;
  isDark: boolean;
  isAiLoading: boolean;
  aiEnabled: boolean;
  onboardingSplitInput: string | null;
  onboardingStep: number;   // -1 = guide not active

  setInput: (input: string) => void;
  setActiveToolId: (id: string | null) => void;
  setDetectionResults: (results: DetectionResult[]) => void;
  addOutput: (output: ToolOutput) => void;
  clearOutputs: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
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
      mobileSidebarOpen: false,
      isDark: true,
      isAiLoading: false,
      aiEnabled: false,
      onboardingSplitInput: null,
      onboardingStep: -1,

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
