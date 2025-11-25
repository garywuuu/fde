"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface ChecklistItem {
  id: string;
  title: string;
  description: string | null;
  state: string;
  category: string | null;
  dueDate: string | null;
}

interface ArtifactLink {
  id: string;
  type: string;
  url: string;
  name: string | null;
}

interface Integration {
  id: string;
  name: string;
  status: string;
  phase: string;
  customer: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string | null;
  } | null;
  checklistItems: ChecklistItem[];
  artifactLinks: ArtifactLink[];
  tasks: any[];
}

export default function IntegrationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [integration, setIntegration] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIntegration() {
      try {
        const res = await fetch(`/api/integrations/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setIntegration(data.integration);
        } else {
          router.push("/integrations");
        }
      } catch (error) {
        console.error("Failed to load integration:", error);
        router.push("/integrations");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadIntegration();
    }
  }, [params.id, router]);

  const updateChecklistItem = async (itemId: string, newState: string) => {
    try {
      const res = await fetch(`/api/checklist/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: newState }),
      });

      if (res.ok) {
        const data = await res.json();
        if (integration) {
          setIntegration({
            ...integration,
            checklistItems: integration.checklistItems.map((item) =>
              item.id === itemId ? data.item : item
            ),
          });
        }
      }
    } catch (error) {
      console.error("Failed to update checklist item:", error);
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

  if (!integration) {
    return null;
  }

  const groupedChecklist = integration.checklistItems.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{integration.name}</h1>
            <p className="mt-2 text-gray-600">
              <Link href={`/customers/${integration.customer.id}`} className="text-blue-600 hover:underline">
                {integration.customer.name}
              </Link>
              {" • "}
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${
                integration.status === "launch" ? "bg-green-100 text-green-800" :
                integration.status === "pilot" ? "bg-yellow-100 text-yellow-800" :
                integration.status === "build" ? "bg-blue-100 text-blue-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {integration.status}
              </span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/integrations/${integration.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Link href="/integrations">
              <Button variant="secondary">Back to List</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Checklist">
            {integration.checklistItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No checklist items yet</p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedChecklist).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-900 mb-3">{category}</h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                        >
                          <input
                            type="checkbox"
                            checked={item.state === "completed"}
                            onChange={(e) =>
                              updateChecklistItem(
                                item.id,
                                e.target.checked ? "completed" : "pending"
                              )
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className={`font-medium ${
                              item.state === "completed" ? "line-through text-gray-500" : "text-gray-900"
                            }`}>
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                            )}
                            {item.dueDate && (
                              <p className="text-xs text-gray-400 mt-1">
                                Due: {new Date(item.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            item.state === "completed" ? "bg-green-100 text-green-800" :
                            item.state === "in_progress" ? "bg-blue-100 text-blue-800" :
                            item.state === "blocked" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {item.state}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button variant="secondary" size="sm" className="mt-4">
              Add Checklist Item
            </Button>
          </Card>

          <Card title="Artifact Links">
            {integration.artifactLinks.length === 0 ? (
              <p className="text-gray-500 text-sm">No artifacts linked yet</p>
            ) : (
              <div className="space-y-2">
                {integration.artifactLinks.map((artifact) => (
                  <a
                    key={artifact.id}
                    href={artifact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{artifact.name || artifact.url}</p>
                      <p className="text-sm text-gray-500">{artifact.type}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
            <Button variant="secondary" size="sm" className="mt-4">
              Add Artifact
            </Button>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Details">
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600">Owner</p>
                <p className="font-medium text-gray-900">
                  {integration.owner?.name || "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Phase</p>
                <p className="font-medium text-gray-900">{integration.phase || "Not set"}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium text-gray-900">{integration.status}</p>
              </div>
            </div>
          </Card>

          <Card title="Related Tasks">
            {integration.tasks.length === 0 ? (
              <p className="text-gray-500 text-sm">No tasks yet</p>
            ) : (
              <div className="space-y-2">
                {integration.tasks.map((task) => (
                  <div key={task.id} className="p-2 border border-gray-200 rounded text-sm">
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-gray-500 text-xs mt-1">{task.status}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

