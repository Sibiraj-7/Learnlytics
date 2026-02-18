import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  BarChart3, 
  Brain, 
  Users, 
  TrendingUp, 
  Shield,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Target,
  Sparkles,
  Lightbulb
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Visual Dashboards",
    description: "Clear, interactive charts showing marks, attendance, and performance trends at a glance.",
  },
  {
    icon: Brain,
    title: "Smart Insights",
    description: "Rule-based analysis that identifies patterns and provides actionable recommendations.",
  },
  {
    icon: Target,
    title: "Performance Tracking",
    description: "Track progress across subjects with grade calculations and trend analysis.",
  },
  {
    icon: Users,
    title: "Dual Perspectives",
    description: "Separate dashboards for students and teachers with role-specific analytics.",
  },
  {
    icon: Shield,
    title: "Transparent Logic",
    description: "No black-box ML—every insight is explainable with clear rules and thresholds.",
  },
  {
    icon: TrendingUp,
    title: "Actionable Advice",
    description: "Personalized recommendations to help students improve their performance.",
  },
];

const modules = [
  "Student Performance Dashboard",
  "Teacher Analytics Console",
  "Attendance Monitoring System",
  "Grade Calculation Engine",
  "Insight Generation Module",
  "Recommendation Engine",
];

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-36">
        {/* Background gradient effects */}
        <div className="absolute inset-0 gradient-hero-bg" />
        
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Academic Analytics System</span>
              </div>
              
              {/* Main Headline */}
              <h1 className="mb-2 font-display text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl">
                <span className="italic">Student Performance</span>
              </h1>
              <h1 className="mb-8 font-display text-5xl font-medium italic tracking-tight sm:text-6xl lg:text-7xl">
                <span className="text-gradient">Insight & Recommendations</span>
              </h1>
              
              {/* Description */}
              <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                Learnlytics transforms academic data into actionable insights using{" "}
                <span className="font-semibold text-foreground">transparent, rule-based logic</span>—making it easy to understand, explain, and improve student outcomes.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center sm:flex-wrap">
                <Link to="/upload">
                  <Button size="lg" className="gradient-primary text-white border-0 rounded-full px-8 py-6 text-base gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all w-full sm:w-auto">
                    Upload Data
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/student">
                  <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base gap-2 border-border hover:bg-secondary w-full sm:w-auto">
                    View Dashboard
                  </Button>
                </Link>
                <Link to="/teacher">
                  <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base gap-2 border-border hover:bg-secondary w-full sm:w-auto">
                    <Users className="h-4 w-4" />
                    Browse Students
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t border-border/40 bg-secondary/30 py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-16 max-w-2xl text-center"
          >
            <h2 className="mb-4 font-display text-3xl font-medium italic sm:text-4xl">Key Features</h2>
            <p className="text-muted-foreground text-lg">
              Built for academic excellence with transparency and simplicity at its core.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="mb-4 font-display text-3xl font-medium italic sm:text-4xl">Project Modules</h2>
              <p className="mb-10 text-muted-foreground text-lg leading-relaxed">
                Learnlytics is organized into clear, focused modules that work together 
                to provide a complete academic analytics solution.
              </p>
              
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <motion.div
                    key={module}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-foreground">{module}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-border/60 bg-card p-8 shadow-xl shadow-primary/5"
            >
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-2xl gradient-primary p-3">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">How It Works</h3>
                  <p className="text-sm text-muted-foreground">Simple 3-step process</p>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="flex gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white shadow-lg shadow-primary/25">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Upload Data</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Upload a CSV or Excel file with student marks and attendance. The dashboard updates automatically from your data.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white shadow-lg shadow-primary/25">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Process & Analyze</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Rule-based engine calculates grades, identifies patterns, and generates insights.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-white shadow-lg shadow-primary/25">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">View & Act</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      Explore dashboards and follow personalized recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/40 bg-secondary/30 py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <h2 className="mb-4 font-display text-3xl font-medium italic sm:text-4xl">Ready to Explore?</h2>
            <p className="mb-10 text-muted-foreground text-lg">
              Discover how Learnlytics can transform academic data into actionable insights.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/student">
                <Button size="lg" className="gradient-primary text-white border-0 rounded-full px-8 py-6 text-base gap-2 shadow-lg shadow-primary/25 hover:shadow-xl transition-all w-full sm:w-auto">
                  Try Student View
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/teacher">
                <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base gap-2 border-border hover:bg-secondary w-full sm:w-auto">
                  Try Teacher View
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold">Learnlytics</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Academic Project • Rule-Based Analytics System
          </p>
        </div>
      </footer>
    </Layout>
  );
}
