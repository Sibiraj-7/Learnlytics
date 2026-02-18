// Mock data for Learnlytics - Student Performance Analytics

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  semester: number;
  department: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  maxMarks: number;
}

export interface MarkRecord {
  studentId: string;
  subjectId: string;
  internal1: number;
  internal2: number;
  assignment: number;
  attendance: number; // percentage
}

export interface PerformanceInsight {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  recommendation: string;
}

// Sample Students (default / mock)
export const defaultStudents: Student[] = [
  { id: 's1', name: 'Arjun Sharma', rollNo: 'CS2101', email: 'arjun@college.edu', semester: 5, department: 'Computer Science' },
  { id: 's2', name: 'Priya Patel', rollNo: 'CS2102', email: 'priya@college.edu', semester: 5, department: 'Computer Science' },
  { id: 's3', name: 'Rahul Kumar', rollNo: 'CS2103', email: 'rahul@college.edu', semester: 5, department: 'Computer Science' },
  { id: 's4', name: 'Sneha Gupta', rollNo: 'CS2104', email: 'sneha@college.edu', semester: 5, department: 'Computer Science' },
  { id: 's5', name: 'Vikram Singh', rollNo: 'CS2105', email: 'vikram@college.edu', semester: 5, department: 'Computer Science' },
];

// Sample Subjects (default / mock)
export const defaultSubjects: Subject[] = [
  { id: 'sub1', name: 'Data Structures', code: 'CS301', credits: 4, maxMarks: 100 },
  { id: 'sub2', name: 'Database Systems', code: 'CS302', credits: 4, maxMarks: 100 },
  { id: 'sub3', name: 'Operating Systems', code: 'CS303', credits: 3, maxMarks: 100 },
  { id: 'sub4', name: 'Computer Networks', code: 'CS304', credits: 3, maxMarks: 100 },
  { id: 'sub5', name: 'Software Engineering', code: 'CS305', credits: 3, maxMarks: 100 },
];

// Sample Mark Records (default / mock)
export const defaultMarkRecords: MarkRecord[] = [
  // Arjun - Good performer
  { studentId: 's1', subjectId: 'sub1', internal1: 42, internal2: 45, assignment: 18, attendance: 92 },
  { studentId: 's1', subjectId: 'sub2', internal1: 38, internal2: 40, assignment: 17, attendance: 88 },
  { studentId: 's1', subjectId: 'sub3', internal1: 40, internal2: 42, assignment: 19, attendance: 90 },
  { studentId: 's1', subjectId: 'sub4', internal1: 35, internal2: 38, assignment: 16, attendance: 85 },
  { studentId: 's1', subjectId: 'sub5', internal1: 44, internal2: 46, assignment: 20, attendance: 95 },
  
  // Priya - Excellent performer
  { studentId: 's2', subjectId: 'sub1', internal1: 48, internal2: 49, assignment: 20, attendance: 98 },
  { studentId: 's2', subjectId: 'sub2', internal1: 46, internal2: 48, assignment: 19, attendance: 96 },
  { studentId: 's2', subjectId: 'sub3', internal1: 47, internal2: 49, assignment: 20, attendance: 97 },
  { studentId: 's2', subjectId: 'sub4', internal1: 45, internal2: 47, assignment: 19, attendance: 95 },
  { studentId: 's2', subjectId: 'sub5', internal1: 49, internal2: 50, assignment: 20, attendance: 99 },
  
  // Rahul - Average performer with attendance issues
  { studentId: 's3', subjectId: 'sub1', internal1: 28, internal2: 32, assignment: 14, attendance: 68 },
  { studentId: 's3', subjectId: 'sub2', internal1: 30, internal2: 28, assignment: 12, attendance: 65 },
  { studentId: 's3', subjectId: 'sub3', internal1: 25, internal2: 30, assignment: 13, attendance: 70 },
  { studentId: 's3', subjectId: 'sub4', internal1: 32, internal2: 35, assignment: 15, attendance: 72 },
  { studentId: 's3', subjectId: 'sub5', internal1: 29, internal2: 31, assignment: 14, attendance: 67 },
  
  // Sneha - Good but inconsistent
  { studentId: 's4', subjectId: 'sub1', internal1: 40, internal2: 30, assignment: 16, attendance: 82 },
  { studentId: 's4', subjectId: 'sub2', internal1: 35, internal2: 42, assignment: 18, attendance: 85 },
  { studentId: 's4', subjectId: 'sub3', internal1: 38, internal2: 28, assignment: 15, attendance: 78 },
  { studentId: 's4', subjectId: 'sub4', internal1: 42, internal2: 38, assignment: 17, attendance: 88 },
  { studentId: 's4', subjectId: 'sub5', internal1: 30, internal2: 40, assignment: 16, attendance: 80 },
  
  // Vikram - At risk
  { studentId: 's5', subjectId: 'sub1', internal1: 18, internal2: 22, assignment: 10, attendance: 55 },
  { studentId: 's5', subjectId: 'sub2', internal1: 20, internal2: 18, assignment: 8, attendance: 52 },
  { studentId: 's5', subjectId: 'sub3', internal1: 22, internal2: 25, assignment: 11, attendance: 60 },
  { studentId: 's5', subjectId: 'sub4', internal1: 15, internal2: 20, assignment: 9, attendance: 48 },
  { studentId: 's5', subjectId: 'sub5', internal1: 24, internal2: 22, assignment: 12, attendance: 58 },
];

// Backward compatibility: alias for default data
export const students = defaultStudents;
export const subjects = defaultSubjects;
export const markRecords = defaultMarkRecords;

// Helper functions for calculations
export function calculateTotalMarks(record: MarkRecord): number {
  return record.internal1 + record.internal2 + record.assignment;
}

export function calculatePercentage(record: MarkRecord, maxMarks: number = 100): number {
  const total = calculateTotalMarks(record);
  return Math.round((total / maxMarks) * 100);
}

export function getGrade(percentage: number): string {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
}

export function getPerformanceLevel(percentage: number): 'excellent' | 'good' | 'average' | 'poor' | 'critical' {
  if (percentage >= 85) return 'excellent';
  if (percentage >= 70) return 'good';
  if (percentage >= 55) return 'average';
  if (percentage >= 40) return 'poor';
  return 'critical';
}

export function getAttendanceStatus(attendance: number): 'safe' | 'warning' | 'danger' {
  if (attendance >= 75) return 'safe';
  if (attendance >= 65) return 'warning';
  return 'danger';
}

// Rule-based insight generator (with explicit data)
export function generateInsightsWithData(
  studentId: string,
  records: MarkRecord[],
  subjectList: Subject[]
): PerformanceInsight[] {
  const studentRecords = records.filter(r => r.studentId === studentId);
  const insights: PerformanceInsight[] = [];
  if (studentRecords.length === 0) return insights;

  const avgAttendance = studentRecords.reduce((sum, r) => sum + r.attendance, 0) / studentRecords.length;
  const avgPercentage = studentRecords.reduce((sum, r) => sum + calculatePercentage(r), 0) / studentRecords.length;

  if (avgAttendance < 75) {
    insights.push({
      type: 'danger',
      title: 'Low Attendance Alert',
      description: `Your average attendance is ${avgAttendance.toFixed(1)}%, below the required 75%.`,
      recommendation: 'Attend all upcoming classes to avoid detention. Set daily reminders and plan your commute in advance.',
    });
  } else if (avgAttendance >= 90) {
    insights.push({
      type: 'success',
      title: 'Excellent Attendance',
      description: `Great job! Your attendance is ${avgAttendance.toFixed(1)}%.`,
      recommendation: 'Keep up the consistency. Your regular presence helps you stay connected with the course material.',
    });
  }

  const performanceDrops = studentRecords.filter(r => r.internal2 < r.internal1);
  if (performanceDrops.length > studentRecords.length / 2) {
    insights.push({
      type: 'warning',
      title: 'Declining Performance',
      description: 'Your marks have dropped in more than half of your subjects.',
      recommendation: 'Focus on revision. Consider forming study groups and consulting your professors during office hours.',
    });
  }

  studentRecords.forEach(record => {
    const subject = subjectList.find(s => s.id === record.subjectId);
    const percentage = calculatePercentage(record);
    if (percentage < 40 && subject) {
      insights.push({
        type: 'danger',
        title: `Critical: ${subject.name}`,
        description: `You scored only ${percentage}% in ${subject.name}.`,
        recommendation: `Dedicate extra study time to ${subject.name}. Watch video tutorials and practice more problems.`,
      });
    }
  });

  const lowAssignments = studentRecords.filter(r => r.assignment < 12);
  if (lowAssignments.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Assignment Improvement Needed',
      description: `You have low assignment scores in ${lowAssignments.length} subject(s).`,
      recommendation: 'Submit assignments on time and focus on quality. Ask for feedback from instructors.',
    });
  }

  if (avgPercentage >= 85) {
    insights.push({
      type: 'success',
      title: 'Outstanding Performance',
      description: `You are among the top performers with ${avgPercentage.toFixed(1)}% average.`,
      recommendation: 'Consider helping classmates through peer tutoring. Apply for academic scholarships.',
    });
  }

  return insights;
}

export function generateInsights(studentId: string): PerformanceInsight[] {
  return generateInsightsWithData(studentId, markRecords, subjects);
}

// Get student performance summary (with explicit data)
export function getStudentSummaryWithData(
  studentId: string,
  studentList: Student[],
  subjectList: Subject[],
  records: MarkRecord[]
) {
  const student = studentList.find(s => s.id === studentId);
  const studentRecords = records.filter(r => r.studentId === studentId);

  const subjectPerformance = studentRecords.map(record => {
    const subject = subjectList.find(s => s.id === record.subjectId);
    const percentage = calculatePercentage(record);
    return {
      subject: subject?.name || 'Unknown',
      code: subject?.code || '',
      internal1: record.internal1,
      internal2: record.internal2,
      assignment: record.assignment,
      total: calculateTotalMarks(record),
      percentage,
      grade: getGrade(percentage),
      attendance: record.attendance,
    };
  });

  const avgPercentage = subjectPerformance.length
    ? subjectPerformance.reduce((sum, s) => sum + s.percentage, 0) / subjectPerformance.length
    : 0;
  const avgAttendance = subjectPerformance.length
    ? subjectPerformance.reduce((sum, s) => sum + s.attendance, 0) / subjectPerformance.length
    : 0;

  return {
    student,
    subjectPerformance,
    avgPercentage: Math.round(avgPercentage),
    avgAttendance: Math.round(avgAttendance),
    overallGrade: getGrade(avgPercentage),
    performanceLevel: getPerformanceLevel(avgPercentage),
    insights: generateInsightsWithData(studentId, records, subjectList),
  };
}

export function getStudentSummary(studentId: string) {
  return getStudentSummaryWithData(studentId, students, subjects, markRecords);
}

// Get class statistics for teachers (with explicit data)
export function getClassStatisticsWithData(
  studentList: Student[],
  subjectList: Subject[],
  records: MarkRecord[]
) {
  const studentSummaries = studentList.map(s =>
    getStudentSummaryWithData(s.id, studentList, subjectList, records)
  );

  const atRiskStudents = studentSummaries.filter(s => s.avgPercentage < 50 || s.avgAttendance < 75);
  const topPerformers = studentSummaries.filter(s => s.avgPercentage >= 85).sort((a, b) => b.avgPercentage - a.avgPercentage);

  const classAvgPercentage = studentSummaries.length
    ? studentSummaries.reduce((sum, s) => sum + s.avgPercentage, 0) / studentSummaries.length
    : 0;
  const classAvgAttendance = studentSummaries.length
    ? studentSummaries.reduce((sum, s) => sum + s.avgAttendance, 0) / studentSummaries.length
    : 0;

  const subjectStats = subjectList.map(subject => {
    const subjectRecords = records.filter(r => r.subjectId === subject.id);
    const avgMarks = subjectRecords.length
      ? subjectRecords.reduce((sum, r) => sum + calculateTotalMarks(r), 0) / subjectRecords.length
      : 0;
    const avgAttendance = subjectRecords.length
      ? subjectRecords.reduce((sum, r) => sum + r.attendance, 0) / subjectRecords.length
      : 0;
    const passRate = subjectRecords.length
      ? (subjectRecords.filter(r => calculatePercentage(r) >= 40).length / subjectRecords.length) * 100
      : 0;

    return {
      ...subject,
      avgMarks: Math.round(avgMarks),
      avgPercentage: Math.round((avgMarks / 100) * 100),
      avgAttendance: Math.round(avgAttendance),
      passRate: Math.round(passRate),
    };
  });

  return {
    totalStudents: studentList.length,
    classAvgPercentage: Math.round(classAvgPercentage),
    classAvgAttendance: Math.round(classAvgAttendance),
    atRiskStudents,
    topPerformers,
    subjectStats,
    allStudents: studentSummaries,
  };
}

export function getClassStatistics() {
  return getClassStatisticsWithData(students, subjects, markRecords);
}
