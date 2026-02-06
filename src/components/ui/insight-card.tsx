import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, AlertTriangle, Info, Lightbulb } from "lucide-react";
import type { PerformanceInsight } from "@/lib/mockData";

interface InsightCardProps {
  insight: PerformanceInsight;
  delay?: number;
}

const typeStyles = {
  success: {
    bg: 'bg-success/5 border-success/20',
    icon: CheckCircle,
    iconColor: 'text-success',
    iconBg: 'bg-success/15',
  },
  warning: {
    bg: 'bg-warning/5 border-warning/20',
    icon: AlertTriangle,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/15',
  },
  danger: {
    bg: 'bg-destructive/5 border-destructive/20',
    icon: AlertCircle,
    iconColor: 'text-destructive',
    iconBg: 'bg-destructive/15',
  },
  info: {
    bg: 'bg-primary/5 border-primary/20',
    icon: Info,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/15',
  },
};

export function InsightCard({ insight, delay = 0 }: InsightCardProps) {
  const style = typeStyles[insight.type];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "rounded-2xl border p-6 transition-all hover:shadow-md",
        style.bg
      )}
    >
      <div className="flex gap-4">
        <div className={cn("mt-0.5 rounded-xl p-2", style.iconBg)}>
          <Icon className={cn("h-5 w-5", style.iconColor)} />
        </div>
        <div className="flex-1 space-y-3">
          <h4 className="font-semibold text-lg">{insight.title}</h4>
          <p className="text-muted-foreground leading-relaxed">{insight.description}</p>
          <div className="flex items-start gap-2 pt-3 border-t border-border/50">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground/80 leading-relaxed">{insight.recommendation}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
