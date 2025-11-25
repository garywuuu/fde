"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Integration {
  id: string;
  name: string;
  status: string;
  phase: string;
  company: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string | null;
  } | null;
  _count: {
    checklistItems: number;
    artifactLinks: number;
    tasks: number;
  };
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIntegrations() {
      try {
        const res = await fetch("/api/integrations");
        const data = await res.json();
        setIntegrations(data.integrations || []);
      } catch (error) {
        console.error("Failed to load integrations:", error);
      } finally {
        setLoading(false);
      }
    }

    loadIntegrations();
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
          <p className="mt-2 text-gray-600">Track customer integrations and pipelines</p>
        </div>
        <Link href="/integrations/new">
          <Button>New Integration</Button>
        </Link>
      </div>

      {integrations.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No integrations yet</p>
            <Link href="/integrations/new">
              <Button>Create Your First Integration</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {integrations.map((integration) => (
            <Card key={integration.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      integration.status === "launch" ? "bg-green-100 text-green-800" :
                      integration.status === "pilot" ? "bg-yellow-100 text-yellow-800" :
                      integration.status === "build" ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {integration.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Company: <Link href={`/companies/${integration.company.id}`} className="text-blue-600 hover:underline">{integration.company.name}</Link>
                  </p>
                  <div className="flex gap-6 text-sm text-gray-500">
                    <span>Checklist: {integration._count.checklistItems} items</span>
                    <span>Artifacts: {integration._count.artifactLinks}</span>
                    <span>Tasks: {integration._count.tasks}</span>
                    {integration.owner && <span>Owner: {integration.owner.name || "Unassigned"}</span>}
                  </div>
                </div>
                <Link href={`/integrations/${integration.id}`}>
                  <Button variant="secondary" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}

