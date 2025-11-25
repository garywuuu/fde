"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";

interface SearchResults {
  companies: Array<{ id: string; name: string; stage: string }>;
  integrations: Array<{ id: string; name: string; status: string }>;
  tasks: Array<{ id: string; title: string; status: string }>;
  notes: Array<{ id: string; title: string; type: string }>;
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const navigateTo = (type: string, id: string) => {
    router.push(`/${type}/${id}`);
    setShowResults(false);
    setQuery("");
  };

  const totalResults =
    (results?.companies.length || 0) +
    (results?.integrations.length || 0) +
    (results?.tasks.length || 0) +
    (results?.notes.length || 0);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <Input
        type="text"
        placeholder="Search companies, integrations, tasks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowResults(true)}
      />

      {showResults && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : totalResults === 0 ? (
            <div className="p-4 text-center text-gray-500">No results found</div>
          ) : (
            <div className="p-2">
              {results?.companies && results.companies.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Companies
                  </div>
                  {results.companies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => navigateTo("companies", company.id)}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                    >
                      {company.name}
                    </button>
                  ))}
                </div>
              )}

              {results?.integrations && results.integrations.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Integrations
                  </div>
                  {results.integrations.map((integration) => (
                    <button
                      key={integration.id}
                      onClick={() => navigateTo("integrations", integration.id)}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                    >
                      {integration.name}
                    </button>
                  ))}
                </div>
              )}

              {results?.tasks && results.tasks.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Tasks
                  </div>
                  {results.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => navigateTo("tasks", task.id)}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                    >
                      {task.title}
                    </button>
                  ))}
                </div>
              )}

              {results?.notes && results.notes.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Notes
                  </div>
                  {results.notes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => navigateTo("notes", note.id)}
                      className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
                    >
                      {note.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

