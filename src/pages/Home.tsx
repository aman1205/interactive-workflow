import { Grid } from "@mantine/core";
import { useState } from "react";

import WorkflowCanvas from "../components/Canvas";
import NodePalette from "../components/NodePalette";
import PropertyPanel from "../components/PropertyPanel";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { WorkflowNode } from "../types";
import AnalyticsPanel from "../components/AnalyticsPanel";

export default function Home() {
  const { setNodes } = useWorkflowStore();
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const onNodeSelect = (node: WorkflowNode) => {
    setSelectedNode(node);
  };

  const updateNode = (updatedNode: WorkflowNode) => {
    setNodes((nodes) => {
      const newNodes = nodes.map((node) =>
        node.id === updatedNode.id ? { ...node, ...updatedNode } : node
      );
      return newNodes;
    });
    setSelectedNode(updatedNode);
  };
  return (
    <Grid gutter={0} h={"100"}>
      <Grid.Col span={1}>
        <NodePalette />
      </Grid.Col>
      <Grid.Col span={9}>
        <WorkflowCanvas onNodeSelect={onNodeSelect}  hoveredNodeId={hoveredNodeId}/>
      </Grid.Col>
      <Grid.Col span={2}>
        <PropertyPanel selectedNode={selectedNode} onUpdateNode={updateNode} />
      </Grid.Col>
      <Grid.Col span={12}>
      <AnalyticsPanel setHoveredNodeId={setHoveredNodeId} />
      </Grid.Col>
    </Grid>
  );
}
