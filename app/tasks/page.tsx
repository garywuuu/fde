"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  dueDate: string | null;
  company: {
    id: string;
    name: string;
  } | null;
  integration: {
    id: string;
    name: string;
  } | null;
  owner: {
    id: string;
    name: string | null;
  } | null;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function loadTasks() {
      try {
        const url = filter !== "all" ? `/api/tasks?status=${filter}` : "/api/tasks";
        const res = await fetch(url);
        const data = await res.json();
        setTasks(data.tasks || []);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [filter]);

  const statusColors = {
    open: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    blocked: "bg-red-100 text-red-800",
  };

  const priorityColors = {
    low: "text-gray-600",
    medium: "text-yellow-600",
    high: "text-red-600",
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-2 text-gray-600">Manage your work items</p>
        </div>
        <Link href="/tasks/new">
          <Button>New Task</Button>
        </Link>
      </div>

      <div className="mb-6 flex gap-2">
        {["all", "open", "in_progress", "completed", "blocked"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">No tasks found</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${statusColors[task.status as keyof typeof statusColors]}`}>
                      {task.status.replace("_", " ")}
                    </span>
                    {task.priority && (
                      <span className={`text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  )}
                  <div className="flex gap-4 text-sm text-gray-500">
                    {task.company && <span>Company: {task.company.name}</span>}
                    {task.integration && <span>Integration: {task.integration.name}</span>}
                    {task.owner && <span>Owner: {task.owner.name || "Unassigned"}</span>}
                    {task.dueDate && (
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}

