import { useCallback, useEffect, useMemo } from "react";
import { Button, Divider, Group } from "@mantine/core";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  BackgroundVariant,
  Edge,
} from "@xyflow/react";

import { useWorkflowStore } from "../state/useWorkflowStore";
import { StartNode, EndNode, DecisionNode, TaskNode } from "./CustumNode";
import { WorkflowNode } from "../types";

interface WorkflowCanvasProps {
  onNodeSelect: (node: WorkflowNode) => void;
  hoveredNodeId: string | null;
}

let id = 0;
const getId = () => `dndnode_${id++}`;
type NodeType = "start" | "end" | "task" | "decision";

function WorkflowCanvas({ onNodeSelect, hoveredNodeId }: WorkflowCanvasProps) {
  const {
    nodes: storeNodes,
    edges: storeEdges,
    draggedNodeType,
    setDraggedNodeType,
    saveWorkflow,
    unsavedChanges,
    resetWorkflow,
    setUnsavedChanges,
  } = useWorkflowStore();

  const [nodes, setNodesState, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);
  const { screenToFlowPosition } = useReactFlow();

  const nodeTypes = useMemo(
    () => ({
      start: StartNode,
      end: EndNode,
      task: TaskNode,
      decision: DecisionNode,
    }),
    []
  );

  // Sync Zustand store to local state
  useEffect(() => {
    const { nodes, edges } = useWorkflowStore.getState();
    setNodesState(nodes);
    setEdges(edges);
  }, [storeNodes, storeEdges, setNodesState, setEdges]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        event.preventDefault();
        event.returnValue =
          "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  const onConnect = useCallback(
    (params: any) => {
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        useWorkflowStore.setState({ edges: newEdges });
        setUnsavedChanges(true);
        return newEdges;
      });
    },
    [setEdges, setUnsavedChanges]
  );

  const handleNodeClick = useCallback(
    (_: any, node: WorkflowNode) => {
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      if (!draggedNodeType) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: WorkflowNode = {
        id: getId(),
        type: draggedNodeType,
        position,
        data: {
          label: `${
            draggedNodeType.charAt(0).toUpperCase() + draggedNodeType.slice(1)
          } Node`,
          executionTime: Math.random() * 100,
        },
      };

      setNodesState((nds) => nds.concat(newNode));
      useWorkflowStore.setState({ nodes: [...storeNodes, newNode] });
      setDraggedNodeType(null);
      setUnsavedChanges(true);
    },
    [
      draggedNodeType,
      screenToFlowPosition,
      setNodesState,
      storeNodes,
      setDraggedNodeType,
      setUnsavedChanges,
    ]
  );

  // Validation to check for duplicate node types and disconnected nodes
  const validateWorkflow = useCallback(
    (nodes: WorkflowNode[], edges: Edge[]) => {
      const connectedNodeIds = new Set<string>();

      edges.forEach((edge) => {
        connectedNodeIds.add(edge.source);
        connectedNodeIds.add(edge.target);
      });

      const nodeTypeCount: Record<NodeType, number> = {
        start: 0,
        end: 0,
        task: 0,
        decision: 0,
      };

      const updatedNodes: WorkflowNode[] = nodes.map((node) => {
        const isDisconnected = !connectedNodeIds.has(node.id);

        // Ensure node.type is a valid NodeType before using it as a key
        const nodeType = node.type as NodeType;

        const hasDuplicateType = nodeTypeCount[nodeType] > 1;

        // Update nodeTypeCount for duplicate check
        nodeTypeCount[nodeType] = (nodeTypeCount[nodeType] || 0) + 1;

        return {
          ...(node as WorkflowNode),
          data: {
            ...node.data,
            label: node.data.label || "Untitled",
            executionTime: node.data.executionTime || 0,
          },
          style: {
            ...node.style,
            border:
              node.id === hoveredNodeId
                ? "2px solid #4caf50"
                : hasDuplicateType || isDisconnected
                ? "1px solid red"
                : "none",
            boxShadow:
              node.id === hoveredNodeId
                ? "0px 0px 10px rgba(0,0,0,0.3)"
                : "none",
            transition: "all 0.2s ease-in-out",
          },
        };
      });

      setNodesState(updatedNodes);
    },
    [hoveredNodeId, setNodesState]
  );

  useEffect(() => {
    validateWorkflow(nodes, edges);
  }, [nodes, edges, validateWorkflow]);

  return (
    <div
      style={{
        height: "850px",
        width: "100%",
        border: "1px solid #ddd",
        position: "relative",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={handleNodeClick}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        style={{ backgroundColor: "#F7F9FB" }}
        colorMode="dark"
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} />
      </ReactFlow>

      <Group mt="md">
        <Button onClick={saveWorkflow} disabled={!unsavedChanges}>
          Save Workflow
        </Button>

        <Button onClick={resetWorkflow}>Reset Workflow</Button>
      </Group>
      <Divider mt={"lg"} />
    </div>
  );
}

export default WorkflowCanvas;
