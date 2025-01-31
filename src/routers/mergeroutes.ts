import { t } from "@/server/server";
import { monitorProcedure } from "./router";
import { StatisticsProcedure } from "./MonitorStatistics";

export const mergedRouters = t.mergeRouters(
  monitorProcedure,
  StatisticsProcedure
);
export type MergedProcedure = typeof mergedRouters;
