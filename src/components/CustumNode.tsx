import { Handle, Position } from "@xyflow/react";
import { Box } from "@mantine/core";

interface ICustomNodeProps {
  data: {
    label: string;
  };
}

export const StartNode = ({ data }: ICustomNodeProps) => {
  return (
    <>
      <Box >{data.label}</Box>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export const EndNode = ({ data }: ICustomNodeProps) => {
  return (
    <>
      <Box>{data.label}</Box>
      <Handle type="target" position={Position.Top} />
    </>
  );
};

export const TaskNode = ({ data }: ICustomNodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Box>{data.label}</Box>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

export const DecisionNode = ({ data }: ICustomNodeProps) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Box>{data.label}</Box>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};
