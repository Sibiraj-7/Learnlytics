import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { Student, Subject, MarkRecord } from "./mockData";

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
  const attendanceKey = col.attendance;

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
    const internal1 = toNumber(getRowValue(row, internal1Key, "internal1", "internal 1"), 0);
    const internal2 = toNumber(getRowValue(row, internal2Key, "internal2", "internal 2"), 0);
    const assignment = toNumber(getRowValue(row, assignmentKey, "assignment"), 0);
    const attendance = toNumber(getRowValue(row, attendanceKey, "attendance"), 0);

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
