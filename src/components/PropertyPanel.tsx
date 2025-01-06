import {
  Box,
  TextInput,
  NumberInput,
  Select,
  Button,
  Text,
  Group,
  Card,
  Stack,
} from "@mantine/core";
import { useState, useEffect } from "react";

import { WorkflowNode } from "../types/index";

interface PropertyPanelProps {
  selectedNode: WorkflowNode | null;
  onUpdateNode: (updatedNode: WorkflowNode) => void;
}

export default function PropertyPanel({
  selectedNode,
  onUpdateNode,
}: PropertyPanelProps) {
  const [nodeName, setNodeName] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [nodeType, setNodeType] = useState<string>("");

  useEffect(() => {
    if (selectedNode) {
      setNodeName(selectedNode.data.label || "");
      setExecutionTime(selectedNode.data.executionTime || 0);
      setNodeType(selectedNode.type || "task");
    }
  }, [selectedNode]);

  const handleUpdate = () => {
    if (selectedNode) {
      const updatedNode = {
        ...selectedNode,
        data: {
          label: nodeName,
          executionTime,
        },
        type: nodeType,
      };
      console.log("Updated Node", updatedNode);
      onUpdateNode(updatedNode);
    }
  };

  if (!selectedNode) {
    return (
      <Box p="md" w={"100%"}>
        <Text size="lg" fw={500} color="dimmed">
          Select a node to edit properties
        </Text>
      </Box>
    );
  }

  return (
    <Card padding="lg" radius="md" w={"100%"}>
      <Text size="xl" fw={700} mb="md">
        Edit Node Properties
      </Text>
      <Stack p="md">
        <TextInput
          label="Node Name"
          value={nodeName}
          onChange={(e) => setNodeName(e.currentTarget.value)}
          placeholder="Enter node name"
          required
        />
        <NumberInput
          label="Execution Time (ms)"
          value={executionTime}
          onChange={(val) => setExecutionTime(Number(val) || 0)}
          min={0}
          required
        />
        <Select
          label="Node Type"
          data={[
            { value: "task", label: "Task" },
            { value: "decision", label: "Decision" },
            { value: "start", label: "Start" },
            { value: "end", label: "End" },
          ]}
          value={nodeType}
          onChange={(val) => setNodeType(val || "task")}
          required
        />
      </Stack>
      <Group mt="lg">
        <Button
          variant="outline"
          color="gray"
          onClick={() => {
            setNodeName("");
            setExecutionTime(0);
            setNodeType("task");
          }}
        >
          Reset
        </Button>
        <Button onClick={handleUpdate} color="blue">
          Update Node
        </Button>
      </Group>
    </Card>
  );
}
