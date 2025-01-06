import { useMemo, useCallback, Dispatch, SetStateAction } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  YAxis,
  XAxis,
  Cell,
  CartesianGrid,
} from "recharts";
import { useWorkflowStore } from "../state/useWorkflowStore";
import { Box, Divider, Title } from "@mantine/core";

interface AnalyticsPanelProps {
  setHoveredNodeId: Dispatch<SetStateAction<string | null>>;
}

function AnalyticsPanel({ setHoveredNodeId }: AnalyticsPanelProps) {
  const { nodes } = useWorkflowStore();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const barChartData = useMemo(() => {
    return nodes.map((node) => ({
      id: node.id,
      name: node.data.label,
      executionTime: node.data.executionTime,
    }));
  }, [nodes]);

  const lineChartData = useMemo(() => {
    let cumulativeTime = 0;
    return nodes.map((node) => {
      cumulativeTime += node.data.executionTime;
      return {
        id: node.id,
        name: node.data.label,
        executionTime: cumulativeTime,
      };
    });
  }, [nodes]);

  const pieChartData = useMemo(() => {
    return nodes.map((node) => ({
      id: node.id,
      name: node.type,
      executionTime: node.data.executionTime,
    }));
  }, [nodes]);

  const handleMouseEnter = useCallback(
    (nodeId: string) => {
      setHoveredNodeId(nodeId);
    },
    [setHoveredNodeId]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredNodeId(null);
  }, [setHoveredNodeId]);

  return (
    <Box w={"100%"} h={"100%"} p={"lg"} mt={"4rem"}>
      <Title order={1} ta={"center"} fw={700} fz={"lg"}>
        Analytics Section
      </Title>

      {nodes.length > 0 ? (
        <>
          <ResponsiveContainer
            width="100%"
            height={250}
            style={{ marginTop: "2rem" }}
          >
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <Bar
                dataKey="executionTime"
                fill="#8884d8"
                onMouseEnter={(e) => handleMouseEnter(e.id)}
                onMouseLeave={handleMouseLeave}
              />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>

          <Divider mt={"lg"} />

          <ResponsiveContainer
            width="100%"
            height={250}
            style={{ marginTop: "2rem" }}
          >
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="executionTime" stroke="#82ca9d" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          </ResponsiveContainer>

          <Divider mt={"lg"} />

          <ResponsiveContainer
            width="100%"
            height={250}
            style={{ marginTop: "2rem" }}
          >
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="executionTime"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
                legendType="square"
                onMouseEnter={(e) => handleMouseEnter(e.id)}
                onMouseLeave={handleMouseLeave}
              >
                {pieChartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </>
      ) : (
        <Box ta={"center"} mt={"lg"}>
          <Title order={3}>No data to display</Title>
        </Box>
      )}
    </Box>
  );
}

export default AnalyticsPanel;
