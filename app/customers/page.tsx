"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Customer {
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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await fetch("/api/customers");
        const data = await res.json();
        setCustomers(data.customers || []);
      } catch (error) {
        console.error("Failed to load customers:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
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
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="mt-2 text-gray-600">Manage your client workspaces</p>
        </div>
        <Link href="/customers/new">
          <Button>Add Customer</Button>
        </Link>
      </div>

      {customers.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No customers yet</p>
            <Link href="/customers/new">
              <Button>Create Your First Customer</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <span className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded ${
                    customer.stage === "live" ? "bg-green-100 text-green-800" :
                    customer.stage === "rollout" ? "bg-blue-100 text-blue-800" :
                    customer.stage === "pilot" ? "bg-yellow-100 text-yellow-800" :
                    "bg-gray-100 text-gray-800"
                  }`}>
                    {customer.stage}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Owner: {customer.owner?.name || customer.owner?.email || "Unassigned"}</p>
                <p>Integrations: {customer._count.integrations}</p>
                <p>Tasks: {customer._count.tasks}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link href={`/customers/${customer.id}`}>
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

