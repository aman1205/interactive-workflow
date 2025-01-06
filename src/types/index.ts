import { Node as BaseNode, } from "@xyflow/react";

export interface WorkflowNode extends BaseNode {
  data: {
    label: string;
    executionTime: number;
  };
}
