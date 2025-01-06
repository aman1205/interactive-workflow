import { Box, Title, Divider, Text, Paper, Tooltip, Grid, Card } from "@mantine/core";

import { useWorkflowStore } from '../state/useWorkflowStore';

const nodeTypes = [
  { 
    type: "task", 
    label: "Task", 
    backgroundColor: "#B39C4D", 
    shape: 'rectangle' 
  },
  { 
    type: "decision", 
    label: "Decision", 
    backgroundColor: "#768948", 
    shape: 'diamond' 
  },
  { 
    type: "start", 
    label: "Start", 
    backgroundColor: "#607744", 
    shape: 'circle' 
  },
  { 
    type: "end", 
    label: "End", 
    backgroundColor: "#34623F", 
    shape: 'circle' 
  },
];

export default function NodePalette() {
  const { setDraggedNodeType } = useWorkflowStore();  

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    setDraggedNodeType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Render node shapes based on their type
  const renderNodeShape = (node: typeof nodeTypes[0]) => {
    switch (node.shape) {
      case 'circle':
        return (
          <Box
            style={{
              width: 80,
              height: 80,
              backgroundColor: node.backgroundColor,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            {node.label}
          </Box>
        );
      case 'diamond':
        return (
          <Box
            style={{
              width: 70,
              height: 70,
              backgroundColor: node.backgroundColor,
              transform: 'rotate(45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            <Text style={{ transform: 'rotate(-45deg)' }}>
              {node.label}
            </Text>
          </Box>
        );
      case 'rectangle':
      default:
        return (
          <Box
            style={{
              width: 90,
              height: 50,
              backgroundColor: node.backgroundColor,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            {node.label}
          </Box>
        );
    }
  };

  return (
    <Paper p="sm" radius="md"  w={'100%'} h={'100%'}>
      <Title order={3} ta="center" p="sm">
        Node Palette
      </Title>
      <Divider mt="sm" mb="lg" />
      <Grid gutter="md">
        {nodeTypes.map((nodeType) => (
          <Grid.Col span={12} key={nodeType.label}>
            <Tooltip label={`Drag to add ${nodeType.label}`} withArrow>
              <Card
                shadow="xs"
                padding="lg"
                radius="md"
                style={{ cursor: "move", textAlign: "center" }}
                onDragStart={(event) => onDragStart(event, nodeType.type)} 
                draggable
              >
                {renderNodeShape(nodeType)}
              </Card>
            </Tooltip>
          </Grid.Col>
        ))}
      </Grid>
    </Paper>
  );
}
