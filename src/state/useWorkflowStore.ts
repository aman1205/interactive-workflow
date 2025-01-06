import { create } from "zustand";
import { Edge } from "@xyflow/react";

import { WorkflowNode } from "../types";

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: Edge[];
  draggedNodeType: string | null;
  unsavedChanges: boolean;
  setUnsavedChanges: (value: boolean) => void;
  addNode: (newNode: WorkflowNode) => void;
  setEdges: (edges: Edge[]) => void;
  setNodes: (nodes: WorkflowNode[] | ((nodes: WorkflowNode[]) => WorkflowNode[])) => void;
  updateNode: (node: WorkflowNode) => void;
  setDraggedNodeType: (nodeType: string | null) => void;
  saveWorkflow: () => void;
  resetWorkflow: () => void;
}

const loadWorkflowFromStorage = () => {
  const workflow = localStorage.getItem("workflow");
  if (workflow) {
    try {
      const parsedWorkflow = JSON.parse(workflow);
      const validNodes = Array.isArray(parsedWorkflow.nodes) ? parsedWorkflow.nodes : [];
      const validEdges = Array.isArray(parsedWorkflow.edges) ? parsedWorkflow.edges : [];

      return { nodes: validNodes, edges: validEdges };
    } catch (error) {
      console.error("Error parsing workflow from storage:", error);
      return { nodes: [], edges: [] };
    }
  }
  return { nodes: [], edges: [] };
};

export const useWorkflowStore = create<WorkflowState>((set) => {
  const { nodes, edges } = loadWorkflowFromStorage();

  return {
    nodes,
    edges,
    draggedNodeType: null,
    unsavedChanges: false,
    setUnsavedChanges: (value) => set({ unsavedChanges: value }),
    addNode: (newNode) => {
      set((state) => ({
        nodes: [...state.nodes, newNode],
        unsavedChanges: true,
      }));
    },
    setEdges: (edges) => set({ edges, unsavedChanges: true }),
    setNodes: (nodesOrUpdater) => {
      set((state) => {
        const nodes = typeof nodesOrUpdater === "function"
          ? nodesOrUpdater(state.nodes)
          : nodesOrUpdater;

        const validEdges = state.edges.filter(edge =>
          nodes.some(n => n.id === edge.source) &&
          nodes.some(n => n.id === edge.target)
        );

        return {
          nodes,
          edges: validEdges,
          unsavedChanges: true,
        };
      });
    },
    updateNode: (node) => {
      set((state) => ({
        nodes: state.nodes.map((n) => (n.id === node.id ? node : n)),
        unsavedChanges: true,
      }));
    },
    setDraggedNodeType: (nodeType) => set({ draggedNodeType: nodeType }),

    saveWorkflow: () => {
      const { nodes, edges } = useWorkflowStore.getState();
      localStorage.setItem("workflow", JSON.stringify({ nodes, edges }));
      set({ unsavedChanges: false });
    },

    resetWorkflow: () => {
      set({ nodes: [], edges: [], unsavedChanges: false });
      localStorage.removeItem("workflow");
    }
  };
});
