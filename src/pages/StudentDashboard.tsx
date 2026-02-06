import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/ui/stat-card";
import { InsightCard } from "@/components/ui/insight-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  students, 
  getStudentSummary, 
  getPerformanceLevel,
  getAttendanceStatus 
} from "@/lib/mockData";
import { 
  GraduationCap, 
  TrendingUp, 
  Clock, 
  Award,
  BookOpen,
  Target,
  Sparkles
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const performanceColors = {
  excellent: 'text-success',
  good: 'text-primary',
  average: 'text-warning',
  poor: 'text-orange-500',
  critical: 'text-destructive',
};

export default function StudentDashboard() {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0].id);
  const summary = getStudentSummary(selectedStudentId);

  const chartData = summary.subjectPerformance.map(s => ({
    name: s.code,
    internal1: s.internal1,
    internal2: s.internal2,
    assignment: s.assignment,
    total: s.total,
    attendance: s.attendance,
  }));

  const getVariant = (level: string) => {
    if (level === 'excellent' || level === 'good') return 'success';
    if (level === 'average') return 'warning';
    return 'danger';
  };

  return (
    <Layout>
      <div className="container py-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-display font-medium italic mb-2">Student Dashboard</h1>
            <p className="text-muted-foreground text-lg">Track your academic performance and get personalized insights</p>
          </div>
          
          <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
            <SelectTrigger className="w-[260px] rounded-xl">
              <SelectValue placeholder="Select student" />
            </SelectTrigger>
            <SelectContent>
              {students.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.rollNo})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Student Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="rounded-2xl border-border/60">
            <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-2xl font-bold text-white shadow-lg shadow-primary/25">
                  {summary.student?.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{summary.student?.name}</h2>
                  <p className="text-muted-foreground">{summary.student?.rollNo} • {summary.student?.department}</p>
                  <p className="text-sm text-muted-foreground">Semester {summary.student?.semester}</p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Badge variant="secondary" className="text-base px-4 py-2 rounded-full">
                  Grade: <span className="ml-1 font-bold">{summary.overallGrade}</span>
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`text-base px-4 py-2 rounded-full ${performanceColors[summary.performanceLevel]}`}
                >
                  {summary.performanceLevel.charAt(0).toUpperCase() + summary.performanceLevel.slice(1)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Overall Percentage"
            value={`${summary.avgPercentage}%`}
            subtitle="Across all subjects"
            icon={TrendingUp}
            variant={getVariant(summary.performanceLevel)}
            delay={0}
          />
          <StatCard
            title="Average Attendance"
            value={`${summary.avgAttendance}%`}
            subtitle={summary.avgAttendance >= 75 ? "Meeting requirement" : "Below 75% threshold"}
            icon={Clock}
            variant={summary.avgAttendance >= 75 ? 'success' : 'danger'}
            delay={0.1}
          />
          <StatCard
            title="Subjects"
            value={summary.subjectPerformance.length}
            subtitle="This semester"
            icon={BookOpen}
            delay={0.2}
          />
          <StatCard
            title="Overall Grade"
            value={summary.overallGrade}
            subtitle="Based on total marks"
            icon={Award}
            variant="accent"
            delay={0.3}
          />
        </div>

        {/* Charts Row */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Subject Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="rounded-2xl border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display italic text-xl">
                  <Target className="h-5 w-5 text-primary" />
                  Subject-wise Performance
                </CardTitle>
                <CardDescription>Internal marks breakdown by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
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
                    <Bar dataKey="internal1" name="Internal 1" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="internal2" name="Internal 2" fill="hsl(280, 70%, 50%)" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="assignment" name="Assignment" fill="hsl(var(--success))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Attendance Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="rounded-2xl border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display italic text-xl">
                  <Clock className="h-5 w-5 text-primary" />
                  Attendance by Subject
                </CardTitle>
                <CardDescription>Attendance percentage across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      name="Attendance %" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Subject Details Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="rounded-2xl border-border/60">
            <CardHeader>
              <CardTitle className="font-display italic text-xl">Subject-wise Details</CardTitle>
              <CardDescription>Detailed breakdown of marks and grades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-4 font-medium">Subject</th>
                      <th className="pb-4 font-medium">Int. 1</th>
                      <th className="pb-4 font-medium">Int. 2</th>
                      <th className="pb-4 font-medium">Assignment</th>
                      <th className="pb-4 font-medium">Total</th>
                      <th className="pb-4 font-medium">Grade</th>
                      <th className="pb-4 font-medium">Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.subjectPerformance.map((subject, index) => {
                      const attendanceStatus = getAttendanceStatus(subject.attendance);
                      return (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-4">
                            <div>
                              <p className="font-medium">{subject.subject}</p>
                              <p className="text-sm text-muted-foreground">{subject.code}</p>
                            </div>
                          </td>
                          <td className="py-4">{subject.internal1}/50</td>
                          <td className="py-4">{subject.internal2}/50</td>
                          <td className="py-4">{subject.assignment}/20</td>
                          <td className="py-4 font-semibold">{subject.total}/100</td>
                          <td className="py-4">
                            <Badge variant={subject.percentage >= 50 ? "secondary" : "destructive"} className="rounded-full">
                              {subject.grade}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <Progress 
                                value={subject.attendance} 
                                className="h-2 w-16"
                              />
                              <span className={`text-sm font-medium ${
                                attendanceStatus === 'safe' ? 'text-success' :
                                attendanceStatus === 'warning' ? 'text-warning' : 'text-destructive'
                              }`}>
                                {subject.attendance}%
                              </span>
                            </div>
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

        {/* Insights Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl gradient-primary p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-display font-medium italic">Personalized Insights & Recommendations</h2>
          </div>
          <p className="mb-8 text-muted-foreground text-lg">
            Based on your academic data, here are rule-based insights to help you improve.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            {summary.insights.map((insight, index) => (
              <InsightCard key={index} insight={insight} delay={index * 0.1} />
            ))}
          </div>
          
          {summary.insights.length === 0 && (
            <Card className="p-10 text-center rounded-2xl border-border/60">
              <p className="text-muted-foreground text-lg">No specific insights at this time. Keep up the good work!</p>
            </Card>
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
