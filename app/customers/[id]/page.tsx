"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
  stage: string;
  successMetrics: any;
  owner: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  integrations: any[];
  tasks: any[];
  notes: any[];
  _count: {
    integrations: number;
    tasks: number;
    notes: number;
    pipelines: number;
    agents: number;
  };
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomer() {
      try {
        const res = await fetch(`/api/customers/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setCustomer(data.customer);
        } else {
          router.push("/customers");
        }
      } catch (error) {
        console.error("Failed to load customer:", error);
        router.push("/customers");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadCustomer();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="mt-2 text-gray-600">
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                customer.stage === "live" ? "bg-green-100 text-green-800" :
                customer.stage === "rollout" ? "bg-blue-100 text-blue-800" :
                customer.stage === "pilot" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {customer.stage}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/customers/${customer.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Link href="/customers">
              <Button variant="secondary">Back to List</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Owner</h3>
          <p className="text-lg font-semibold text-gray-900">
            {customer.owner?.name || customer.owner?.email || "Unassigned"}
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Integrations</h3>
          <p className="text-3xl font-bold text-gray-900">{customer._count.integrations}</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Open Tasks</h3>
          <p className="text-3xl font-bold text-gray-900">{customer._count.tasks}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Integrations">
          {customer.integrations.length === 0 ? (
            <p className="text-gray-500 text-sm">No integrations yet</p>
          ) : (
            <div className="space-y-3">
              {customer.integrations.map((integration) => (
                <Link
                  key={integration.id}
                  href={`/integrations/${integration.id}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {integration._count.checklistItems} checklist items • {integration._count.tasks} tasks
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      integration.status === "launch" ? "bg-green-100 text-green-800" :
                      integration.status === "pilot" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {integration.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <Link href={`/integrations/new?customerId=${customer.id}`}>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Add Integration
            </Button>
          </Link>
        </Card>

        <Card title="Recent Tasks">
          {customer.tasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks yet</p>
          ) : (
            <div className="space-y-3">
              {customer.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {task.status} • {task.owner?.name || "Unassigned"}
                  </p>
                </div>
              ))}
            </div>
          )}
          <Link href={`/tasks/new?customerId=${customer.id}`}>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Add Task
            </Button>
          </Link>
        </Card>

        <Card title="Recent Notes">
          {customer.notes.length === 0 ? (
            <p className="text-gray-500 text-sm">No notes yet</p>
          ) : (
            <div className="space-y-3">
              {customer.notes.map((note) => (
                <Link
                  key={note.id}
                  href={`/notes/${note.id}`}
                  className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">{note.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {note.type} • {note.author.name || "Unknown"} • {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
          <Link href={`/notes/new?customerId=${customer.id}`}>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Add Note
            </Button>
          </Link>
        </Card>

        <Card title="Metrics">
          <p className="text-gray-500 text-sm">
            {customer.successMetrics
              ? JSON.stringify(customer.successMetrics, null, 2)
              : "No metrics configured"}
          </p>
        </Card>
      </div>
    </Layout>
  );
}

