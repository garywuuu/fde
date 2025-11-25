"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Company {
  id: string;
  name: string;
  stage: string;
  owner: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  _count: {
    integrations: number;
    tasks: number;
  };
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();
        setCompanies(data.companies || []);
      } catch (error) {
        console.error("Failed to load companies:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCompanies();
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
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="mt-2 text-gray-600">Manage your client workspaces</p>
        </div>
        <Link href="/companies/new">
          <Button>Add Company</Button>
        </Link>
      </div>

      {companies.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No companies yet</p>
            <Link href="/companies/new">
              <Button>Create Your First Company</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                    company.stage === "live" ? "bg-green-100 text-green-800" :
                    company.stage === "rollout" ? "bg-blue-100 text-blue-800" :
                    company.stage === "pilot" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {company.stage}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Owner: {company.owner?.name || company.owner?.email || "Unassigned"}</p>
                <p>Integrations: {company._count.integrations}</p>
                <p>Tasks: {company._count.tasks}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link href={`/companies/${company.id}`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    View Details
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

