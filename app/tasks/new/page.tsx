"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const dynamic = 'force-dynamic';

function NewTaskForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<any[]>([]);
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    companyId: "",
    integrationId: "",
    title: "",
    description: "",
    status: "open",
    priority: "medium",
    dueDate: "",
    source: "manual",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [companiesRes, integrationsRes] = await Promise.all([
          fetch("/api/companies"),
          fetch("/api/integrations"),
        ]);
        const companiesData = await companiesRes.json();
        const integrationsData = await integrationsRes.json();
        setCompanies(companiesData.companies || []);
        setIntegrations(integrationsData.integrations || []);
        // Set IDs from URL params
        const companyId = searchParams.get("companyId");
        const integrationId = searchParams.get("integrationId");
        if (companyId || integrationId) {
          setFormData(prev => ({
            ...prev,
            ...(companyId && { companyId }),
            ...(integrationId && { integrationId }),
          }));
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    }
    loadData();
  }, [searchParams]);

  const filteredIntegrations = formData.companyId
    ? integrations.filter((i) => i.companyId === formData.companyId)
    : integrations;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          companyId: formData.companyId || undefined,
          integrationId: formData.integrationId || undefined,
          dueDate: formData.dueDate || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/tasks`);
      } else {
        const error = await res.json();
        alert(error.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">New Task</h1>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-2">
                Company (optional)
              </label>
              <select
                id="companyId"
                value={formData.companyId}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    companyId: e.target.value,
                    integrationId: "", // Reset integration when company changes
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No company</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="integrationId" className="block text-sm font-medium text-gray-700 mb-2">
                Integration (optional)
              </label>
              <select
                id="integrationId"
                value={formData.integrationId}
                onChange={(e) => setFormData({ ...formData, integrationId: e.target.value })}
                disabled={!formData.companyId}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">No integration</option>
                {filteredIntegrations.map((integration) => (
                  <option key={integration.id} value={integration.id}>
                    {integration.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <Input
                id="title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Complete integration checklist"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Task details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                Due Date (optional)
              </label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Task"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default function NewTaskPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </Layout>
    }>
      <NewTaskForm />
    </Suspense>
  );
}

