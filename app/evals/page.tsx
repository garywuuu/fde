"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface EvalRun {
  id: string;
  suite: string;
  dataset: string | null;
  passRate: number;
  totalTests: number;
  passedTests: number;
  tokens: number | null;
  duration: number | null;
  trigger: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
  } | null;
}

export default function EvalsPage() {
  const [evalRuns, setEvalRuns] = useState<EvalRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function loadEvalRuns() {
      try {
        const res = await fetch("/api/evals");
        const data = await res.json();
        setEvalRuns(data.evalRuns || []);
      } catch (error) {
        console.error("Failed to load eval runs:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvalRuns();
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

  const groupedBySuite = evalRuns.reduce((acc, run) => {
    if (!acc[run.suite]) {
      acc[run.suite] = [];
    }
    acc[run.suite].push(run);
    return acc;
  }, {} as Record<string, EvalRun[]>);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Eval Runs</h1>
        <p className="mt-2 text-gray-600">Agent evaluation results and metrics</p>
      </div>

      {Object.keys(groupedBySuite).length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No eval runs yet</p>
            <p className="text-sm text-gray-400">
              Eval runs will appear here when reported via webhook or API
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBySuite).map(([suite, runs]) => (
            <Card key={suite} title={suite}>
              <div className="space-y-3">
                {runs.map((run) => {
                  const isRegression = runs.length > 1 && run.passRate < runs[0].passRate;
                  return (
                    <div
                      key={run.id}
                      className={`p-4 border rounded-lg ${
                        isRegression ? "border-red-200 bg-red-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-gray-900">
                              {run.dataset || "Default Dataset"}
                            </h4>
                            {isRegression && (
                              <span className="px-2 py-1 text-xs font-medium rounded bg-red-100 text-red-800">
                                Regression
                              </span>
                            )}
                          </div>
                          {run.customer && (
                            <p className="text-sm text-gray-500 mt-1">
                              Customer: {run.customer.name}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${
                            run.passRate >= 0.9 ? "text-green-600" :
                            run.passRate >= 0.7 ? "text-yellow-600" :
                            "text-red-600"
                          }`}>
                            {(run.passRate * 100).toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-500">
                            {run.passedTests}/{run.totalTests} passed
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 mt-3 pt-3 border-t border-gray-200">
                        <span>Trigger: {run.trigger}</span>
                        {run.tokens && <span>Tokens: {run.tokens.toLocaleString()}</span>}
                        {run.duration && <span>Duration: {run.duration}ms</span>}
                        <span>Run: {new Date(run.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="secondary">
                          View Details
                        </Button>
                        <Button size="sm" variant="secondary">
                          Rerun
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="mt-8">
        <h3 className="font-semibold mb-2">Webhook Endpoint</h3>
        <p className="text-sm text-gray-600 mb-4">
          Send eval results to: <code className="bg-gray-100 px-2 py-1 rounded">POST /api/evals/report</code>
        </p>
        <div className="bg-gray-50 p-4 rounded-lg text-xs font-mono">
          <pre>{JSON.stringify({
            suite: "agent-eval",
            passRate: 0.95,
            totalTests: 100,
            passedTests: 95,
            customerId: "optional-customer-uuid",
          }, null, 2)}</pre>
        </div>
      </Card>
    </Layout>
  );
}

