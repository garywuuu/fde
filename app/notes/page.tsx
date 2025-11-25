"use client";

import { useEffect, useState } from "react";
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
  company: {
    id: string;
    name: string;
  } | null;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
  createdAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotes() {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        setNotes(data.notes || []);
      } catch (error) {
        console.error("Failed to load notes:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNotes();
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
          <h1 className="text-3xl font-bold text-gray-900">Notes</h1>
          <p className="mt-2 text-gray-600">Meeting notes, proposals, and updates</p>
        </div>
        <Link href="/notes/new">
          <Button>New Note</Button>
        </Link>
      </div>

      {notes.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No notes yet</p>
            <Link href="/notes/new">
              <Button>Create Your First Note</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{note.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      note.type === "proposal" ? "bg-blue-100 text-blue-800" :
                      note.type === "meeting" ? "bg-purple-100 text-purple-800" :
                      note.type === "update" ? "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {note.type}
                    </span>
                    {note.clientVisible && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-green-100 text-green-800">
                        Client Visible
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3 line-clamp-2">{note.content}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    {note.company && (
                      <span>Company: <Link href={`/companies/${note.company.id}`} className="text-blue-600 hover:underline">{note.company.name}</Link></span>
                    )}
                    <span>Author: {note.author.name || note.author.email}</span>
                    <span>Created: {new Date(note.createdAt).toLocaleDateString()}</span>
                    {note.shareableLink && (
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        Share Link
                      </span>
                    )}
                  </div>
                </div>
                <Link href={`/notes/${note.id}`}>
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

