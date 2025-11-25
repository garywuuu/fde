"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface Note {
  id: string;
  title: string;
  content: string;
  type: string;
  clientVisible: boolean;
  shareableLink: string | null;
  version: number;
  customer: {
    id: string;
    name: string;
  } | null;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNote() {
      try {
        const res = await fetch(`/api/notes/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setNote(data.note);
        } else {
          router.push("/notes");
        }
      } catch (error) {
        console.error("Failed to load note:", error);
        router.push("/notes");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadNote();
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

  if (!note) {
    return null;
  }

  const shareUrl = note.shareableLink
    ? `${window.location.origin}/share/${note.shareableLink}`
    : null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{note.title}</h1>
              <div className="mt-2 flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded ${
                  note.type === "proposal" ? "bg-blue-100 text-blue-800" :
                  note.type === "meeting" ? "bg-purple-100 text-purple-800" :
                  note.type === "update" ? "bg-green-100 text-green-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {note.type}
                </span>
                {note.clientVisible && (
                  <span className="px-3 py-1 text-sm font-medium rounded bg-green-100 text-green-800">
                    Client Visible
                  </span>
                )}
                {note.customer && (
                  <Link href={`/customers/${note.customer.id}`} className="text-blue-600 hover:underline text-sm">
                    {note.customer.name}
                  </Link>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <Link href={`/notes/${note.id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Link href="/notes">
                <Button variant="secondary">Back to List</Button>
              </Link>
            </div>
          </div>
        </div>

        <Card>
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex justify-between text-sm text-gray-600">
              <div>
                <p>Author: {note.author.name || note.author.email}</p>
                <p>Created: {new Date(note.createdAt).toLocaleString()}</p>
                <p>Last updated: {new Date(note.updatedAt).toLocaleString()}</p>
                <p>Version: {note.version}</p>
              </div>
              {shareUrl && (
                <div>
                  <p className="font-medium mb-2">Shareable Link:</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="px-2 py-1 text-xs border border-gray-300 rounded bg-gray-50"
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        navigator.clipboard.writeText(shareUrl);
                        alert("Link copied to clipboard!");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-900">{note.content}</div>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

