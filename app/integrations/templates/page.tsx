"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface ChecklistItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
}

interface IntegrationTemplate {
  id: string;
  name: string;
  description: string | null;
  checklistItems: ChecklistItem[];
  _count: {
    checklistItems: number;
  };
}

export default function IntegrationTemplatesPage() {
  const [templates, setTemplates] = useState<IntegrationTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await fetch("/api/integrations/templates");
        if (res.ok) {
          const data = await res.json();
          setTemplates(data.templates || []);
        }
      } catch (error) {
        console.error("Failed to load templates:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTemplates();
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
          <h1 className="text-3xl font-bold text-gray-900">Integration Templates</h1>
          <p className="mt-2 text-gray-600">Reusable templates for common integration patterns</p>
        </div>
        <Link href="/integrations/templates/new">
          <Button>New Template</Button>
        </Link>
      </div>

      {templates.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No templates yet</p>
            <Link href="/integrations/templates/new">
              <Button>Create Your First Template</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
              {template.description && (
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              )}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{template._count.checklistItems} checklist items</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <Link href={`/integrations/templates/${template.id}`}>
                  <Button variant="secondary" size="sm" className="w-full">
                    View Template
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

