// src/components/StatusGraph.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/server/server";
import { trpc } from "@/trpc/client";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface StatusGraphProps {
  urlId: string;
}

export function StatusGraph({ urlId }: StatusGraphProps) {
  const { data, isLoading } = trpc.getHourlyStats.useQuery({
    urlId,
    hours: 24,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading status data...</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] animate-pulse bg-muted" />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No data available</CardTitle>
        </CardHeader>
      </Card>
    );
  }
  console.log(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time (Last 24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="hour"
                tickFormatter={(value) => `${value}:00`}
                fontSize={12}
                className="text-muted-foreground"
              />
              <YAxis
                fontSize={12}
                tickFormatter={(value) => `${value}ms`}
                className="text-muted-foreground"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Time
                            </span>
                            <span className="font-bold">
                              {payload[0].payload.hour}:00
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Response Time
                            </span>
                            <span className="font-bold">
                              {payload[0].value}ms
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Success Rate
                            </span>
                            <span className="font-bold">
                              {payload[0].payload.successRate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Add a dual-line graph component to show both response time and success rate
export function DualStatusGraph({ urlId }: StatusGraphProps) {
  const { data, isLoading } = trpc.getHourlyStats.useQuery({
    urlId,
    hours: 24,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading status data...</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] animate-pulse bg-muted" />
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No data available</CardTitle>
        </CardHeader>
      </Card>
    );
  }
  console.log(data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics (Last 24 Hours)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="hour"
                tickFormatter={(value) => `${value}:00`}
                fontSize={12}
                className="text-muted-foreground"
              />
              <YAxis
                yAxisId="left"
                fontSize={12}
                tickFormatter={(value) => `${value}ms`}
                className="text-muted-foreground"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
                className="text-muted-foreground"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Time
                            </span>
                            <span className="font-bold">
                              {payload[0].payload.hour}:00
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Response Time
                            </span>
                            <span className="font-bold text-primary">
                              {payload[0].value}ms
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Success Rate
                            </span>
                            <span className="font-bold text-emerald-500">
                              {payload[1].value}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="responseTime"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="successRate"
                stroke="hsl(var(--success))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
