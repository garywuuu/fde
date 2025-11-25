"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Company {
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

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await fetch(`/api/companies/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setCompany(data.company);
        } else {
          router.push("/companies");
        }
      } catch (error) {
        console.error("Failed to load company:", error);
        router.push("/companies");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadCompany();
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

  if (!company) {
    return null;
  }

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="mt-2 text-gray-600">
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                company.stage === "live" ? "bg-green-100 text-green-800" :
                company.stage === "rollout" ? "bg-blue-100 text-blue-800" :
                company.stage === "pilot" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {company.stage}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/companies/${company.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Link href="/companies">
              <Button variant="secondary">Back to List</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Owner</h3>
          <p className="text-lg font-semibold text-gray-900">
            {company.owner?.name || company.owner?.email || "Unassigned"}
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Integrations</h3>
          <p className="text-3xl font-bold text-gray-900">{company._count.integrations}</p>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-600 mb-2">Open Tasks</h3>
          <p className="text-3xl font-bold text-gray-900">{company._count.tasks}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Integrations">
          {company.integrations.length === 0 ? (
            <p className="text-gray-500 text-sm">No integrations yet</p>
          ) : (
            <div className="space-y-3">
              {company.integrations.map((integration) => (
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
          <Link href={`/integrations/new?companyId=${company.id}`}>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Add Integration
            </Button>
          </Link>
        </Card>

        <Card title="Recent Tasks">
          {company.tasks.length === 0 ? (
            <p className="text-gray-500 text-sm">No tasks yet</p>
          ) : (
            <div className="space-y-3">
              {company.tasks.map((task) => (
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
          <Link href={`/tasks/new?companyId=${company.id}`}>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Add Task
            </Button>
          </Link>
        </Card>

        <Card title="Recent Notes">
          {company.notes.length === 0 ? (
            <p className="text-gray-500 text-sm">No notes yet</p>
          ) : (
            <div className="space-y-3">
              {company.notes.map((note) => (
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
          <Link href={`/notes/new?companyId=${company.id}`}>
            <Button variant="secondary" size="sm" className="mt-4 w-full">
              Add Note
            </Button>
          </Link>
        </Card>

        <Card title="Metrics">
          <p className="text-gray-500 text-sm">
            {company.successMetrics
              ? JSON.stringify(company.successMetrics, null, 2)
              : "No metrics configured"}
          </p>
        </Card>
      </div>
    </Layout>
  );
}

