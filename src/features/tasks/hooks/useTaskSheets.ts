import { useState } from 'react';

import { useGrowMe, type GrowTask } from '@/store/GrowMeContext';

export type TaskSheet = 'task' | 'actions' | 'delete' | 'bloom' | null;

export function useTaskSheets(selectedDate: string) {
  const { addTask, editTask, removeTask, toggleTask } = useGrowMe();
  const [sheet, setSheet] = useState<TaskSheet>(null);
  const [editing, setEditing] = useState<GrowTask | null>(null);
  const [activeTask, setActiveTask] = useState<GrowTask | null>(null);
  const [value, setValue] = useState('');

  const close = () => setSheet(null);
  const openNew = () => { setEditing(null); setValue(''); setSheet('task'); };
  const openActions = (task: GrowTask) => { setActiveTask(task); setSheet('actions'); };
  const openEdit = () => { if (!activeTask) return; setEditing(activeTask); setValue(activeTask.title); setSheet('task'); };
  const requestDelete = () => setSheet('delete');
  const confirmDelete = () => { if (activeTask) removeTask(activeTask.id); setSheet(null); };
  const save = () => {
    const title = value.trim();
    if (!title) return;
    if (editing) editTask(editing.id, title);
    else addTask(title, selectedDate);
    setSheet(null);
  };
  const complete = (task: GrowTask) => {
    if (toggleTask(task.id)) setSheet('bloom');
  };

  return { sheet, value, setValue, activeTask, close, openNew, openActions, openEdit, requestDelete, confirmDelete, save, complete };
}
