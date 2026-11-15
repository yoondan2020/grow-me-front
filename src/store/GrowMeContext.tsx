import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type GrowTask = { id: string; title: string; date: string; completed: boolean };
type FlowerRecord = { id: string; name: string; date: string; month: string; completions: number };
type GrowMeState = {
  tasks: GrowTask[];
  flowers: FlowerRecord[];
  addTask: (title: string, date: string) => void;
  editTask: (id: string, title: string) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => boolean;
};

const GrowMeContext = createContext<GrowMeState | null>(null);

export function GrowMeProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<GrowTask[]>([]);
  const [flowers, setFlowers] = useState<FlowerRecord[]>([]);

  const value = useMemo<GrowMeState>(() => ({
    tasks,
    flowers,
    addTask: (title, date) => setTasks((current) => [...current, { id: `${Date.now()}-${Math.random()}`, title, date, completed: false }]),
    editTask: (id, title) => setTasks((current) => current.map((task) => task.id === id ? { ...task, title } : task)),
    removeTask: (id) => setTasks((current) => current.filter((task) => task.id !== id)),
    toggleTask: (id) => {
      const task = tasks.find((item) => item.id === id);
      if (!task) return false;
      const nextCompleted = !task.completed;
      setTasks((current) => current.map((item) => item.id === id ? { ...item, completed: nextCompleted } : item));
      if (!nextCompleted) return false;
      const month = task.date.slice(0, 7);
      const count = tasks.filter((item) => item.date.startsWith(month) && item.completed).length + 1;
      if (count >= 20 && (count === 20 || (count - 20) % 10 === 0)) {
        const record: FlowerRecord = {
          id: `${month}-${Date.now()}`,
          name: count === 20 ? '이달의 데이지' : '이달의 꽃',
          date: task.date,
          month,
          completions: count,
        };
        setFlowers((current) => [...current, record]);
        return true;
      }
      return false;
    },
  }), [tasks, flowers]);

  return <GrowMeContext.Provider value={value}>{children}</GrowMeContext.Provider>;
}

export function useGrowMe() {
  const value = useContext(GrowMeContext);
  if (!value) throw new Error('useGrowMe must be used within GrowMeProvider');
  return value;
}

export type { GrowTask, FlowerRecord };
