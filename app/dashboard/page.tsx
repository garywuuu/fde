"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

interface DashboardStats {
  companies: number;
  integrations: number;
  tasks: number;
  notes: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    companies: 0,
    integrations: 0,
    tasks: 0,
    notes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [companiesRes, integrationsRes, tasksRes, notesRes] = await Promise.all([
          fetch("/api/companies"),
          fetch("/api/integrations"),
          fetch("/api/tasks"),
          fetch("/api/notes"),
        ]);

        const companies = await companiesRes.json();
        const integrations = await integrationsRes.json();
        const tasks = await tasksRes.json();
        const notes = await notesRes.json();

        setStats({
          companies: companies.companies?.length || 0,
          integrations: integrations.integrations?.length || 0,
          tasks: tasks.tasks?.length || 0,
          notes: notes.notes?.length || 0,
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Overview of your FDE workflows</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Companies</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.companies}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <Link href="/companies" className="text-blue-600 text-sm font-medium mt-4 inline-block hover:underline">
            View all →
          </Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Integrations</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.integrations}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <Link href="/integrations" className="text-blue-600 text-sm font-medium mt-4 inline-block hover:underline">
            View all →
          </Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tasks</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.tasks}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <Link href="/tasks" className="text-blue-600 text-sm font-medium mt-4 inline-block hover:underline">
            View all →
          </Link>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.notes}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <Link href="/notes" className="text-blue-600 text-sm font-medium mt-4 inline-block hover:underline">
            View all →
          </Link>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Quick Actions">
          <div className="space-y-3">
            <Link href="/companies/new" className="block p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <p className="font-medium text-gray-900">Add New Company</p>
              <p className="text-sm text-gray-500 mt-1">Create a new client workspace</p>
            </Link>
            <Link href="/integrations/new" className="block p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <p className="font-medium text-gray-900">Start New Integration</p>
              <p className="text-sm text-gray-500 mt-1">Track a new customer integration</p>
            </Link>
            <Link href="/notes/new" className="block p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <p className="font-medium text-gray-900">Create Note</p>
              <p className="text-sm text-gray-500 mt-1">Add meeting notes or proposal</p>
            </Link>
            <Link href="/tasks/new" className="block p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <p className="font-medium text-gray-900">Create Task</p>
              <p className="text-sm text-gray-500 mt-1">Add a new work item</p>
            </Link>
          </div>
        </Card>

        <Card title="Recent Activity">
          <p className="text-gray-500 text-sm">Activity feed coming soon...</p>
        </Card>
      </div>
    </Layout>
  );
}

