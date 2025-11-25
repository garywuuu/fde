"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  dueDate: string | null;
  source: string | null;
  customer: {
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
    email: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadTask() {
      try {
        const res = await fetch(`/api/tasks/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setTask(data.task);
        } else {
          router.push("/tasks");
        }
      } catch (error) {
        console.error("Failed to load task:", error);
        router.push("/tasks");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadTask();
    }
  }, [params.id, router]);

  const updateStatus = async (newStatus: string) => {
    if (!task) return;
    
    setUpdating(true);
    try {
      const res = await fetch(`/api/tasks/${task.id}/patch`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const data = await res.json();
        setTask(data.task);
      }
    } catch (error) {
      console.error("Failed to update task:", error);
    } finally {
      setUpdating(false);
    }
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

  if (!task) {
    return null;
  }

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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
              <div className="mt-2 flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded ${statusColors[task.status as keyof typeof statusColors]}`}>
                  {task.status.replace("_", " ")}
                </span>
                {task.priority && (
                  <span className={`text-sm font-medium ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                    {task.priority.toUpperCase()} Priority
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/tasks/${task.id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Link href="/tasks">
                <Button variant="secondary">Back to List</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card title="Description">
              <p className="text-gray-700 whitespace-pre-wrap">
                {task.description || "No description provided."}
              </p>
            </Card>

            <Card title="Status">
              <div className="space-y-3">
                <div className="flex gap-2 flex-wrap">
                  {["open", "in_progress", "completed", "blocked"].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateStatus(status)}
                      disabled={updating || task.status === status}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        task.status === status
                          ? statusColors[status as keyof typeof statusColors] + " cursor-default"
                          : "bg-white border border-gray-300 hover:bg-gray-50"
                      } ${updating ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      {status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card title="Details">
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600">Owner</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {task.owner?.name || task.owner?.email || "Unassigned"}
                  </p>
                </div>
                {task.customer && (
                  <div>
                    <p className="text-gray-600">Customer</p>
                    <Link href={`/customers/${task.customer.id}`} className="text-blue-600 hover:underline font-medium mt-1 inline-block">
                      {task.customer.name}
                    </Link>
                  </div>
                )}
                {task.integration && (
                  <div>
                    <p className="text-gray-600">Integration</p>
                    <Link href={`/integrations/${task.integration.id}`} className="text-blue-600 hover:underline font-medium mt-1 inline-block">
                      {task.integration.name}
                    </Link>
                  </div>
                )}
                {task.dueDate && (
                  <div>
                    <p className="text-gray-600">Due Date</p>
                    <p className="font-medium text-gray-900 mt-1">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {task.source && (
                  <div>
                    <p className="text-gray-600">Source</p>
                    <p className="font-medium text-gray-900 mt-1">{task.source}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-medium text-gray-900 mt-1">
                    {new Date(task.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

