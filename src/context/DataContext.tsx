import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Student, Subject, MarkRecord } from "@/lib/mockData";
import {
  defaultStudents,
  defaultSubjects,
  defaultMarkRecords,
} from "@/lib/mockData";

export interface DataState {
  students: Student[];
  subjects: Subject[];
  markRecords: MarkRecord[];
  source: "mock" | "upload";
}

interface DataContextValue extends DataState {
  setUploadedData: (students: Student[], subjects: Subject[], markRecords: MarkRecord[]) => void;
  resetToMockData: () => void;
}

const defaultState: DataState = {
  students: defaultStudents,
  subjects: defaultSubjects,
  markRecords: defaultMarkRecords,
  source: "mock",
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DataState>(defaultState);

  const setUploadedData = useCallback(
    (students: Student[], subjects: Subject[], markRecords: MarkRecord[]) => {
      setState({
        students,
        subjects,
        markRecords,
        source: "upload",
      });
    },
    []
  );

  const resetToMockData = useCallback(() => {
    setState(defaultState);
  }, []);

  const value: DataContextValue = {
    ...state,
    setUploadedData,
    resetToMockData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
