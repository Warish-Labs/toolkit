"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/ui/shared/tabs";

interface Habit {
  id: string;
  name: string;
  streak: number;
  lastDone?: string;
}

interface PlannerTask {
  id: string;
  time: string;
  task: string;
  done: boolean;
}

interface QuickLink {
  id: string;
  title: string;
  url: string;
}

export function ProductivityStudioTool() {
  const [activeTab, setActiveTab] = useState("notes");

  // --- Notes state ---
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tk_notes");
    if (saved) setNotes(saved);
  }, []);

  const handleNotesChange = (val: string) => {
    setNotes(val);
    localStorage.setItem("tk_notes", val);
  };

  // --- Checklist state ---
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean }[]>([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tk_checklist");
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  const saveTodos = (updated: typeof todos) => {
    setTodos(updated);
    localStorage.setItem("tk_checklist", JSON.stringify(updated));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    const updated = [...todos, { id: String(Date.now()), text: newTodo.trim(), done: false }];
    saveTodos(updated);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    const updated = todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    saveTodos(updated);
  };

  const deleteTodo = (id: string) => {
    const updated = todos.filter((t) => t.id !== id);
    saveTodos(updated);
  };

  // --- Pomodoro Timer state ---
  const [pomoMode, setPomoMode] = useState<"work" | "break">("work");
  const [pomoSecs, setPomoSecs] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (pomoRunning) {
      interval = setInterval(() => {
        setPomoSecs((s) => {
          if (s <= 1) {
            setPomoMode((m) => (m === "work" ? "break" : "work"));
            return pomoMode === "work" ? 5 * 60 : 25 * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [pomoRunning, pomoMode]);

  const togglePomo = () => setPomoRunning(!pomoRunning);
  const resetPomo = () => {
    setPomoRunning(false);
    setPomoSecs(pomoMode === "work" ? 25 * 60 : 5 * 60);
  };

  // --- Habit Tracker state ---
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tk_habits");
    if (saved) setHabits(JSON.parse(saved));
  }, []);

  const saveHabits = (updated: Habit[]) => {
    setHabits(updated);
    localStorage.setItem("tk_habits", JSON.stringify(updated));
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const updated = [...habits, { id: String(Date.now()), name: newHabitName.trim(), streak: 0 }];
    saveHabits(updated);
    setNewHabitName("");
  };

  const completeHabitToday = (id: string) => {
    const todayStr = new Date().toDateString();
    const updated = habits.map((h) => {
      if (h.id === id) {
        if (h.lastDone === todayStr) return h; // already completed today
        return {
          ...h,
          streak: h.streak + 1,
          lastDone: todayStr,
        };
      }
      return h;
    });
    saveHabits(updated);
  };

  const deleteHabit = (id: string) => {
    const updated = habits.filter((h) => h.id !== id);
    saveHabits(updated);
  };

  // --- Daily Planner state ---
  const [plannerTasks, setPlannerTasks] = useState<PlannerTask[]>([]);
  const [newTaskTime, setNewTaskTime] = useState("");
  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tk_planner");
    if (saved) setPlannerTasks(JSON.parse(saved));
  }, []);

  const savePlanner = (updated: PlannerTask[]) => {
    setPlannerTasks(updated);
    localStorage.setItem("tk_planner", JSON.stringify(updated));
  };

  const addPlannerTask = () => {
    if (!newTaskTime.trim() || !newTaskText.trim()) return;
    const updated = [...plannerTasks, { id: String(Date.now()), time: newTaskTime, task: newTaskText, done: false }];
    // Sort tasks by time
    updated.sort((a, b) => a.time.localeCompare(b.time));
    savePlanner(updated);
    setNewTaskTime("");
    setNewTaskText("");
  };

  const togglePlannerTask = (id: string) => {
    const updated = plannerTasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    savePlanner(updated);
  };

  const deletePlannerTask = (id: string) => {
    const updated = plannerTasks.filter((t) => t.id !== id);
    savePlanner(updated);
  };

  // --- Meeting Timer state ---
  const [meetingSecs, setMeetingSecs] = useState(0);
  const [meetingRunning, setMeetingRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (meetingRunning) {
      interval = setInterval(() => {
        setMeetingSecs((s) => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [meetingRunning]);

  // --- Clipboard History state ---
  const [clipHistory, setClipHistory] = useState<string[]>([]);
  const [clipInput, setClipInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tk_clip_history");
    if (saved) setClipHistory(JSON.parse(saved));
  }, []);

  const addClipEntry = () => {
    if (!clipInput.trim()) return;
    const updated = [clipInput.trim(), ...clipHistory].slice(0, 10);
    setClipHistory(updated);
    localStorage.setItem("tk_clip_history", JSON.stringify(updated));
    setClipInput("");
  };

  // --- Quick Links state ---
  const [links, setLinks] = useState<QuickLink[]>([]);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("tk_quick_links");
    if (saved) setLinks(JSON.parse(saved));
  }, []);

  const saveLinks = (updated: QuickLink[]) => {
    setLinks(updated);
    localStorage.setItem("tk_quick_links", JSON.stringify(updated));
  };

  const addLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return;
    const formattedUrl = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    const updated = [...links, { id: String(Date.now()), title: linkTitle.trim(), url: formattedUrl }];
    saveLinks(updated);
    setLinkTitle("");
    setLinkUrl("");
  };

  const deleteLink = (id: string) => {
    const updated = links.filter((l) => l.id !== id);
    saveLinks(updated);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val)}>
        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 text-[10px] sm:text-xs">
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="todo">Todo</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomo</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
          <TabsTrigger value="planner">Plan</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="clip">Clip</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
        </TabsList>

        {/* ── Notes ── */}
        <TabsContent value="notes" className="pt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Browser Scratchpad</span>
            <button
              onClick={() => {
                setNotes("");
                localStorage.removeItem("tk_notes");
              }}
              className="text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 px-3 py-1 rounded transition"
            >
              Clear
            </button>
          </div>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            className="flex min-h-[250px] w-full rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-xs font-sans shadow-sm focus-visible:outline-none"
            placeholder="Write temporary thoughts or script logs here... Saves instantly."
          />
        </TabsContent>

        {/* ── Checklist ── */}
        <TabsContent value="todo" className="pt-4 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add checklist item..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            />
            <button
              onClick={addTodo}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/95 transition"
            >
              Add
            </button>
          </div>

          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-2.5 border rounded-lg bg-card text-xs hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => toggleTodo(todo.id)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                  />
                  <span className={todo.done ? "line-through text-muted-foreground" : "font-medium"}>
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-destructive hover:text-destructive/80 font-bold px-1.5"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── Pomodoro Timer ── */}
        <TabsContent value="pomodoro" className="pt-4 space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary">
              {pomoMode === "work" ? "Focus Session" : "Short Break"}
            </span>
            <h2 className="text-6xl font-extrabold font-mono tracking-tighter">
              {Math.floor(pomoSecs / 60)}:
              {String(pomoSecs % 60).padStart(2, "0")}
            </h2>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={togglePomo}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition"
            >
              {pomoRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetPomo}
              className="inline-flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/90 px-6 py-2 text-xs font-semibold text-muted-foreground transition"
            >
              Reset
            </button>
          </div>
        </TabsContent>

        {/* ── Habit Tracker ── */}
        <TabsContent value="habits" className="pt-4 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHabit()}
              placeholder="Enter new habit (e.g. Drink Water)..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            />
            <button
              onClick={addHabit}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/95 transition"
            >
              Track
            </button>
          </div>

          <div className="space-y-2">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="flex items-center justify-between p-3 border rounded-xl bg-card text-xs"
              >
                <div className="space-y-0.5">
                  <span className="font-semibold text-sm">{habit.name}</span>
                  <span className="text-[10px] text-muted-foreground block">Streak: {habit.streak} days🔥</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => completeHabitToday(habit.id)}
                    className="inline-flex items-center justify-center rounded bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[10px] px-3 py-1.5 transition"
                  >
                    Done Today
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-destructive font-bold text-base hover:text-destructive/80"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── Daily Planner ── */}
        <TabsContent value="planner" className="pt-4 space-y-4">
          <div className="grid gap-2 sm:grid-cols-3 items-end">
            <div className="space-y-1">
              <label htmlFor="p-time" className="text-[10px] font-semibold uppercase text-muted-foreground">Time</label>
              <input
                id="p-time"
                type="time"
                value={newTaskTime}
                onChange={(e) => setNewTaskTime(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1 sm:col-span-2 flex gap-2">
              <div className="w-full space-y-1">
                <label htmlFor="p-task" className="text-[10px] font-semibold uppercase text-muted-foreground">Activity</label>
                <input
                  id="p-task"
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addPlannerTask()}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                  placeholder="Plan your activity..."
                />
              </div>
              <button
                onClick={addPlannerTask}
                className="h-9 inline-flex items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition mt-auto shrink-0"
              >
                Schedule
              </button>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {plannerTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-2.5 border rounded-lg bg-card text-xs"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => togglePlannerTask(task.id)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5 cursor-pointer"
                  />
                  <span className="font-mono text-muted-foreground font-semibold">{task.time}</span>
                  <span className={task.done ? "line-through text-muted-foreground" : "font-medium"}>
                    {task.task}
                  </span>
                </div>
                <button
                  onClick={() => deletePlannerTask(task.id)}
                  className="text-destructive font-bold hover:text-destructive/80 px-1.5"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── Meeting Timer ── */}
        <TabsContent value="meeting" className="pt-4 space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Meeting Elapsed Time</span>
            <h2 className="text-6xl font-extrabold font-mono tracking-tighter">
              {String(Math.floor(meetingSecs / 3600)).padStart(2, "0")}:
              {String(Math.floor((meetingSecs % 3600) / 60)).padStart(2, "0")}:
              {String(meetingSecs % 60).padStart(2, "0")}
            </h2>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={() => setMeetingRunning(!meetingRunning)}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition"
            >
              {meetingRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => {
                setMeetingRunning(false);
                setMeetingSecs(0);
              }}
              className="inline-flex items-center justify-center rounded-lg bg-secondary hover:bg-secondary/90 px-6 py-2 text-xs font-semibold text-muted-foreground transition"
            >
              Reset
            </button>
          </div>
        </TabsContent>

        {/* ── Clipboard Scratchpad ── */}
        <TabsContent value="clip" className="pt-4 space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={clipInput}
              onChange={(e) => setClipInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addClipEntry()}
              placeholder="Paste copied item or logs here..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
            />
            <button
              onClick={addClipEntry}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/95 transition"
            >
              Log
            </button>
          </div>

          <div className="space-y-2">
            {clipHistory.map((text, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border rounded-xl bg-card text-xs font-mono"
              >
                <span className="truncate max-w-[85%]">{text}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(text)}
                  className="text-primary hover:underline font-semibold text-[10px]"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── Quick Links Dashboard ── */}
        <TabsContent value="links" className="pt-4 space-y-4">
          <div className="grid gap-2 sm:grid-cols-3 items-end">
            <div className="space-y-1">
              <label htmlFor="l-title" className="text-[10px] font-semibold uppercase text-muted-foreground">Title</label>
              <input
                id="l-title"
                type="text"
                value={linkTitle}
                onChange={(e) => setLinkTitle(e.target.value)}
                placeholder="Google"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
              />
            </div>
            <div className="space-y-1 sm:col-span-2 flex gap-2">
              <div className="w-full space-y-1">
                <label htmlFor="l-url" className="text-[10px] font-semibold uppercase text-muted-foreground">URL</label>
                <input
                  id="l-url"
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addLink()}
                  placeholder="google.com"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-sm focus:outline-none"
                />
              </div>
              <button
                onClick={addLink}
                className="h-9 inline-flex items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition mt-auto shrink-0"
              >
                Add Link
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="border rounded-xl p-3 bg-card hover:border-primary/30 transition flex flex-col justify-between"
              >
                <div className="space-y-1 text-left">
                  <span className="font-semibold block truncate text-xs">{link.title}</span>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-primary truncate block hover:underline"
                  >
                    Open Link ↗
                  </a>
                </div>
                <button
                  onClick={() => deleteLink(link.id)}
                  className="text-right text-[10px] text-destructive font-semibold hover:underline mt-2 self-end"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
