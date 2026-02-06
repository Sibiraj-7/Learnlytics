import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getClassStatistics, getPerformanceLevel, getAttendanceStatus } from "@/lib/mockData";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Award,
  BookOpen,
  Target,
  BarChart3,
  Sparkles
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const stats = getClassStatistics();

const performanceLevelColors = {
  excellent: 'bg-success/15 text-success border-success/20',
  good: 'bg-primary/15 text-primary border-primary/20',
  average: 'bg-warning/15 text-warning border-warning/20',
  poor: 'bg-orange-100 text-orange-600 border-orange-200',
  critical: 'bg-destructive/15 text-destructive border-destructive/20',
};

const COLORS = ['hsl(142, 71%, 45%)', 'hsl(262, 83%, 58%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

export default function TeacherDashboard() {
  const subjectChartData = stats.subjectStats.map(s => ({
    name: s.code,
    avgMarks: s.avgPercentage,
    passRate: s.passRate,
    attendance: s.avgAttendance,
  }));

  const performanceDistribution = [
    { name: 'Excellent (85%+)', value: stats.allStudents.filter(s => s.avgPercentage >= 85).length },
    { name: 'Good (70-84%)', value: stats.allStudents.filter(s => s.avgPercentage >= 70 && s.avgPercentage < 85).length },
    { name: 'Average (50-69%)', value: stats.allStudents.filter(s => s.avgPercentage >= 50 && s.avgPercentage < 70).length },
    { name: 'At Risk (<50%)', value: stats.allStudents.filter(s => s.avgPercentage < 50).length },
  ];

  return (
    <Layout>
      <div className="container py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-display font-medium italic mb-2">Teacher Dashboard</h1>
          <p className="text-muted-foreground text-lg">Monitor class performance and identify students who need attention</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            subtitle="In your class"
            icon={Users}
            delay={0}
          />
          <StatCard
            title="Class Average"
            value={`${stats.classAvgPercentage}%`}
            subtitle="Overall performance"
            icon={TrendingUp}
            variant={stats.classAvgPercentage >= 70 ? 'success' : 'warning'}
            delay={0.1}
          />
          <StatCard
            title="At-Risk Students"
            value={stats.atRiskStudents.length}
            subtitle="Need attention"
            icon={AlertTriangle}
            variant={stats.atRiskStudents.length > 0 ? 'danger' : 'success'}
            delay={0.2}
          />
          <StatCard
            title="Class Attendance"
            value={`${stats.classAvgAttendance}%`}
            subtitle="Average attendance"
            icon={Award}
            variant={stats.classAvgAttendance >= 75 ? 'success' : 'warning'}
            delay={0.3}
          />
        </div>

        {/* Charts Row */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Subject Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-2xl border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display italic text-xl">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Subject-wise Class Performance
                </CardTitle>
                <CardDescription>Average marks and pass rates by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={subjectChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px'
                      }} 
                    />
                    <Bar dataKey="avgMarks" name="Avg %" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="passRate" name="Pass Rate %" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-2xl border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display italic text-xl">
                  <Target className="h-5 w-5 text-primary" />
                  Student Performance Distribution
                </CardTitle>
                <CardDescription>Breakdown by performance category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={performanceDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => value > 0 ? `${value}` : ''}
                    >
                      {performanceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px'
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* At-Risk Students */}
        {stats.atRiskStudents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="border-destructive/20 bg-destructive/5 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive font-display italic text-xl">
                  <AlertTriangle className="h-5 w-5" />
                  At-Risk Students
                </CardTitle>
                <CardDescription>Students with low marks or attendance needing immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stats.atRiskStudents.map((summary, index) => (
                    <motion.div
                      key={summary.student?.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="rounded-xl border bg-card p-5"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-destructive/15 text-destructive font-bold">
                          {summary.student?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{summary.student?.name}</p>
                          <p className="text-sm text-muted-foreground">{summary.student?.rollNo}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Performance</span>
                          <span className={summary.avgPercentage < 50 ? 'text-destructive font-medium' : ''}>
                            {summary.avgPercentage}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Attendance</span>
                          <span className={summary.avgAttendance < 75 ? 'text-destructive font-medium' : ''}>
                            {summary.avgAttendance}%
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {summary.avgPercentage < 50 && (
                          <Badge variant="destructive" className="text-xs rounded-full">Low Marks</Badge>
                        )}
                        {summary.avgAttendance < 75 && (
                          <Badge variant="destructive" className="text-xs rounded-full">Low Attendance</Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Top Performers */}
        {stats.topPerformers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card className="border-success/20 bg-success/5 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success font-display italic text-xl">
                  <Sparkles className="h-5 w-5" />
                  Top Performers
                </CardTitle>
                <CardDescription>Students with excellent academic performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {stats.topPerformers.map((summary, index) => (
                    <motion.div
                      key={summary.student?.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="rounded-xl border bg-card p-5"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary text-white font-bold shadow-lg shadow-primary/25">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{summary.student?.name}</p>
                          <p className="text-sm text-muted-foreground">{summary.student?.rollNo}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Performance</span>
                          <span className="text-success font-medium">{summary.avgPercentage}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Attendance</span>
                          <span>{summary.avgAttendance}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Grade</span>
                          <Badge variant="secondary" className="bg-success/15 text-success rounded-full">
                            {summary.overallGrade}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* All Students Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display italic text-xl">
                <Users className="h-5 w-5 text-primary" />
                All Students Overview
              </CardTitle>
              <CardDescription>Complete class roster with performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-4 font-medium">Student</th>
                      <th className="pb-4 font-medium">Roll No</th>
                      <th className="pb-4 font-medium">Performance</th>
                      <th className="pb-4 font-medium">Attendance</th>
                      <th className="pb-4 font-medium">Grade</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.allStudents.map((summary) => {
                      const performanceLevel = getPerformanceLevel(summary.avgPercentage);
                      const attendanceStatus = getAttendanceStatus(summary.avgAttendance);
                      
                      return (
                        <tr key={summary.student?.id} className="border-b last:border-0">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-sm font-medium text-primary">
                                {summary.student?.name.charAt(0)}
                              </div>
                              <span className="font-medium">{summary.student?.name}</span>
                            </div>
                          </td>
                          <td className="py-4 text-muted-foreground">{summary.student?.rollNo}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <Progress value={summary.avgPercentage} className="h-2 w-20" />
                              <span className="text-sm font-medium">{summary.avgPercentage}%</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`text-sm font-medium ${
                              attendanceStatus === 'safe' ? 'text-success' :
                              attendanceStatus === 'warning' ? 'text-warning' : 'text-destructive'
                            }`}>
                              {summary.avgAttendance}%
                            </span>
                          </td>
                          <td className="py-4">
                            <Badge variant="secondary" className="rounded-full">{summary.overallGrade}</Badge>
                          </td>
                          <td className="py-4">
                            <Badge className={`rounded-full border ${performanceLevelColors[performanceLevel]}`}>
                              {performanceLevel.charAt(0).toUpperCase() + performanceLevel.slice(1)}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display italic text-xl">
                <BookOpen className="h-5 w-5 text-primary" />
                Subject-wise Statistics
              </CardTitle>
              <CardDescription>Detailed breakdown of each subject's performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.subjectStats.map((subject, index) => (
                  <motion.div
                    key={subject.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="rounded-xl border border-border/60 p-5"
                  >
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">{subject.code} • {subject.credits} credits</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Avg. Marks</span>
                          <span className="font-medium">{subject.avgPercentage}%</span>
                        </div>
                        <Progress value={subject.avgPercentage} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Pass Rate</span>
                          <span className={`font-medium ${subject.passRate >= 80 ? 'text-success' : subject.passRate >= 60 ? 'text-warning' : 'text-destructive'}`}>
                            {subject.passRate}%
                          </span>
                        </div>
                        <Progress value={subject.passRate} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-border/50">
                        <span className="text-muted-foreground">Avg. Attendance</span>
                        <span className={`font-medium ${subject.avgAttendance >= 75 ? 'text-success' : 'text-destructive'}`}>
                          {subject.avgAttendance}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
