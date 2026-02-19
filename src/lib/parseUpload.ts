import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { Student, Subject, MarkRecord } from "./mockData";
import { INTERNAL1_MAX, INTERNAL2_MAX, ASSIGNMENT_MAX } from "./mockData";

const ACCEPTED_TYPES = [
  "text/csv",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];
const ACCEPTED_EXT = [".csv", ".xlsx", ".xls"];

function normalizeKey(key: string): string {
  return key
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/\s/g, "_");
}

// Map common column names to our field names
const COLUMN_ALIASES: Record<string, string> = {
  student_name: "name",
  name: "name",
  studentname: "name",
  roll_no: "rollNo",
  rollno: "rollNo",
  roll: "rollNo",
  email: "email",
  semester: "semester",
  department: "department",
  dept: "department",
  subject: "subject",
  subject_name: "subjectName",
  subjectname: "subjectName",
  subject_code: "subjectCode",
  subjectcode: "subjectCode",
  code: "subjectCode",
  internal_1: "internal1",
  internal1: "internal1",
  internal_2: "internal2",
  internal2: "internal2",
  assignment: "assignment",
  assignments: "assignment",
  internal_1_max: "internal1Max",
  internal1_max: "internal1Max",
  internal1max: "internal1Max",
  internal_2_max: "internal2Max",
  internal2_max: "internal2Max",
  internal2max: "internal2Max",
  assignment_max: "assignmentMax",
  assignmentmax: "assignmentMax",
  attendance: "attendance",
  credits: "credits",
  max_marks: "maxMarks",
  maxmarks: "maxMarks",
};

function getRowValue(row: Record<string, unknown>, ...keys: string[]): string | number {
  const raw = keys.find((k) => row[k] !== undefined && row[k] !== "");
  if (raw === undefined) return "";
  const v = row[raw];
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string") {
    const num = parseFloat(v.trim().replace(/,/g, ""));
    if (!Number.isNaN(num)) return num;
    return v.trim();
  }
  return "";
}

function buildColumnMap(headers: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  headers.forEach((h) => {
    const n = normalizeKey(h);
    const alias = COLUMN_ALIASES[n] ?? n;
    map[alias] = h;
  });
  return map;
}

function toNumber(val: string | number, fallback = 0): number {
  if (typeof val === "number" && !Number.isNaN(val)) return val;
  const n = parseFloat(String(val).trim().replace(/,/g, ""));
  return Number.isNaN(n) ? fallback : n;
}

/** Normalize raw mark to definitive scale. Caps at definitive max. */
function normalizeMark(raw: number, fileMax: number, definitiveMax: number): number {
  if (fileMax <= 0) return 0;
  const normalized = (raw / fileMax) * definitiveMax;
  return Math.round(Math.min(definitiveMax, Math.max(0, normalized)));
}

export interface ParseResult {
  students: Student[];
  subjects: Subject[];
  markRecords: MarkRecord[];
  errors: string[];
}

export function parseFile(file: File): Promise<ParseResult> {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const isCsv =
    ext === ".csv" ||
    file.type === "text/csv" ||
    file.type === "application/csv";
  const isExcel = [".xlsx", ".xls"].includes(ext);

  if (isCsv) return parseCsv(file);
  if (isExcel) return parseExcel(file);

  return Promise.resolve({
    students: [],
    subjects: [],
    markRecords: [],
    errors: [`Unsupported file type: ${file.name}. Use .csv, .xlsx, or .xls`],
  });
}

function parseCsv(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete(result) {
        const rows = result.data.filter((r) => Object.keys(r).some((k) => r[k]?.trim()));
        resolve(parseRows(rows as unknown as Record<string, unknown>[]));
      },
      error(err) {
        resolve({
          students: [],
          subjects: [],
          markRecords: [],
          errors: [err.message || "Failed to parse CSV"],
        });
      },
    });
  });
}

function parseExcel(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          resolve({
            students: [],
            subjects: [],
            markRecords: [],
            errors: ["Failed to read file"],
          });
          return;
        }
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
          defval: "",
          raw: false,
        });
        resolve(parseRows(rows));
      } catch (err) {
        resolve({
          students: [],
          subjects: [],
          markRecords: [],
          errors: [err instanceof Error ? err.message : "Failed to parse Excel"],
        });
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsBinaryString(file);
  });
}

function parseRows(rows: Record<string, unknown>[]): ParseResult {
  const errors: string[] = [];
  if (rows.length === 0) {
    return { students: [], subjects: [], markRecords: [], errors: ["No rows found"] };
  }

  const headers = Object.keys(rows[0] || {});
  const col = buildColumnMap(headers);

  const nameKey = col.name || col.student_name;
  const rollKey = col.rollNo || col.roll_no || col.roll;
  const subjectCodeKey = col.subjectCode || col.subject_code || col.code || col.subject;
  const subjectNameKey = col.subjectName || col.subject_name;
  const internal1Key = col.internal1 || col.internal_1;
  const internal2Key = col.internal2 || col.internal_2;
  const assignmentKey = col.assignment;
  const internal1MaxKey = col.internal1Max || col.internal_1_max;
  const internal2MaxKey = col.internal2Max || col.internal_2_max;
  const assignmentMaxKey = col.assignmentMax || col.assignment_max;
  const attendanceKey = col.attendance;

  // First pass: detect file max per marks column (for normalization to definitive scale)
  // Supports: (a) explicit "Internal 1 Max" columns, or (b) auto-detect from data
  // Include 100 so "out of 100" source marks normalize to out of 40
  const COMMON_INTERNAL_MAXES = [20, 25, 40, 50, 100];
  const COMMON_ASSIGNMENT_MAXES = [10, 15, 20, 25];

  function nearestCommonMax(value: number, options: number[]): number {
    if (value <= 0) return options[options.length - 1];
    return options.reduce((prev, curr) =>
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  }

  let fileInternal1Max = 0;
  let fileInternal2Max = 0;
  let fileAssignmentMax = 0;
  let maxInternal1Seen = 0;
  let maxInternal2Seen = 0;
  let maxAssignmentSeen = 0;

  for (const row of rows) {
    const r1 = toNumber(getRowValue(row, internal1Key, "internal1", "internal 1"), 0);
    const r2 = toNumber(getRowValue(row, internal2Key, "internal2", "internal 2"), 0);
    const ra = toNumber(getRowValue(row, assignmentKey, "assignment"), 0);
    if (internal1MaxKey && !fileInternal1Max) {
      const m = toNumber(getRowValue(row, internal1MaxKey), 0);
      if (m > 0) fileInternal1Max = m;
    }
    if (internal2MaxKey && !fileInternal2Max) {
      const m = toNumber(getRowValue(row, internal2MaxKey), 0);
      if (m > 0) fileInternal2Max = m;
    }
    if (assignmentMaxKey && !fileAssignmentMax) {
      const m = toNumber(getRowValue(row, assignmentMaxKey), 0);
      if (m > 0) fileAssignmentMax = m;
    }
    if (r1 > maxInternal1Seen) maxInternal1Seen = r1;
    if (r2 > maxInternal2Seen) maxInternal2Seen = r2;
    if (ra > maxAssignmentSeen) maxAssignmentSeen = ra;
  }

  // Use explicit max columns if present; else auto-detect from max value (round to common academic scale)
  if (fileInternal1Max <= 0) fileInternal1Max = nearestCommonMax(maxInternal1Seen, COMMON_INTERNAL_MAXES) || INTERNAL1_MAX;
  if (fileInternal2Max <= 0) fileInternal2Max = nearestCommonMax(maxInternal2Seen, COMMON_INTERNAL_MAXES) || INTERNAL2_MAX;
  if (fileAssignmentMax <= 0) fileAssignmentMax = nearestCommonMax(maxAssignmentSeen, COMMON_ASSIGNMENT_MAXES) || ASSIGNMENT_MAX;

  if (!nameKey || !rollKey) {
    errors.push("Required columns not found. Need at least: student name and roll number.");
  }
  if (!subjectCodeKey && !subjectNameKey) {
    errors.push("Subject column not found (subject code or subject name).");
  }

  const studentMap = new Map<string, Student>();
  const subjectMap = new Map<string, Subject>();
  const markRecords: MarkRecord[] = [];
  let studentIndex = 0;
  let subjectIndex = 0;

  rows.forEach((row, idx) => {
    const name = String(getRowValue(row, nameKey, "name", "student name")).trim();
    const rollNo = String(getRowValue(row, rollKey, "rollNo", "roll no")).trim();
    const subjectCode = String(
      getRowValue(row, subjectCodeKey, "subjectCode", "subject code", "code")
    ).trim();
    const subjectName = String(
      getRowValue(row, subjectNameKey, "subjectName", "subject name", "subject")
    ).trim();
    const code = subjectCode || subjectName || `SUB${idx}`;
    const rawInternal1 = toNumber(getRowValue(row, internal1Key, "internal1", "internal 1"), 0);
    const rawInternal2 = toNumber(getRowValue(row, internal2Key, "internal2", "internal 2"), 0);
    const rawAssignment = toNumber(getRowValue(row, assignmentKey, "assignment"), 0);
    const attendance = toNumber(getRowValue(row, attendanceKey, "attendance"), 0);

    const internal1 = normalizeMark(rawInternal1, fileInternal1Max, INTERNAL1_MAX);
    const internal2 = normalizeMark(rawInternal2, fileInternal2Max, INTERNAL2_MAX);
    const assignment = normalizeMark(rawAssignment, fileAssignmentMax, ASSIGNMENT_MAX);

    if (!name || !rollNo) {
      errors.push(`Row ${idx + 2}: missing name or roll number.`);
      return;
    }

    let student = studentMap.get(rollNo);
    if (!student) {
      studentIndex += 1;
      student = {
        id: `s${studentIndex}`,
        name,
        rollNo,
        email: String(getRowValue(row, col.email || "email") || "").trim() || `${rollNo}@college.edu`,
        semester: toNumber(getRowValue(row, col.semester || "semester"), 5),
        department: String(getRowValue(row, col.department || col.dept || "department") || "").trim() || "General",
      };
      studentMap.set(rollNo, student);
    }

    let subject = subjectMap.get(code);
    if (!subject) {
      subjectIndex += 1;
      subject = {
        id: `sub${subjectIndex}`,
        name: subjectName || code,
        code,
        credits: toNumber(getRowValue(row, col.credits || "credits"), 3),
        maxMarks: toNumber(getRowValue(row, col.maxMarks ?? col.max_marks ?? ""), 100),
      };
      subjectMap.set(code, subject);
    }

    markRecords.push({
      studentId: student.id,
      subjectId: subject.id,
      internal1,
      internal2,
      assignment,
      attendance,
    });
  });

  const students = Array.from(studentMap.values());
  const subjects = Array.from(subjectMap.values());

  return {
    students,
    subjects,
    markRecords,
    errors,
  };
}

export function isAcceptedFile(file: File): boolean {
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (ACCEPTED_EXT.includes(ext)) return true;
  return ACCEPTED_TYPES.includes(file.type);
}
