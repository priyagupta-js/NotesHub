"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api`;

// Format date to readable string e.g. "12 May 2025"
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NotesPage() {
  const router = useRouter();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null); // null = create, object = edit

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("");
  const [saving, setSaving] = useState(false);

  // Toast state
  const [toast, setToast] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      fetchNotes();
    }
  }, []);

  // Re-fetch when search changes
  useEffect(() => {
    if (token) fetchNotes();
  }, [search]);

  const fetchNotes = async () => {
    try {
      const url = search
        ? `${API}/notes?q=${encodeURIComponent(search)}`
        : `${API}/notes`;

      const res = await fetch(url, { headers: authHeaders });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Open modal for creating a new note
  const openCreateModal = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setTag("");
    setShowModal(true);
  };

  // Open modal pre-filled for editing
  const openEditModal = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content || "");
    setTag(note.tag || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setSaving(true);

    const body = { title, content, tag: tag || "general" };

    try {
      let res;

      if (editingNote) {
        // Update existing note
        res = await fetch(`${API}/notes/${editingNote._id}`, {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify(body),
        });
      } else {
        // Create new note
        res = await fetch(`${API}/notes`, {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        closeModal();
        fetchNotes();
        showToast(editingNote ? "Note updated." : "Note created.");
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      const res = await fetch(`${API}/notes/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n._id !== id));
        showToast("Note deleted.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-stone-100">

      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-stone-800 text-white text-sm px-4 py-2.5 rounded-lg shadow-md">
          {toast}
        </div>
      )}

      {/* Navbar */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-stone-800">NotesHub</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-stone-500 hover:text-stone-800 transition"
        >
          Logout
        </button>
      </nav>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Top bar: search + create button */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            placeholder="Search notes by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 bg-white text-stone-800 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition"
          />
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-lg bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 transition whitespace-nowrap"
          >
            + New Note
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20 text-stone-400 text-sm">Loading...</div>
        )}

        {/* Empty state */}
        {!loading && notes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-400 text-sm">
              {search ? "No notes match your search." : "No notes yet. Create your first one!"}
            </p>
            {!search && (
              <button
                onClick={openCreateModal}
                className="mt-4 px-5 py-2.5 rounded-lg bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 transition"
              >
                + New Note
              </button>
            )}
          </div>
        )}

        {/* Notes grid */}
        {!loading && notes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-xl border border-stone-200 p-5 flex flex-col gap-3 hover:shadow-sm transition"
              >
                {/* Tag */}
                <span className="text-xs text-stone-400 font-medium uppercase tracking-wide">
                  {note.tag || "general"}
                </span>

                {/* Title */}
                <h2 className="text-sm font-semibold text-stone-800 leading-snug line-clamp-2">
                  {note.title}
                </h2>

                {/* Content preview */}
                {note.content && (
                  <p className="text-sm text-stone-500 leading-relaxed line-clamp-3">
                    {note.content}
                  </p>
                )}

                {/* Footer: date + actions */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-auto">
                  <span className="text-xs text-stone-400">
                    {formatDate(note.updatedAt)}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEditModal(note)}
                      className="text-xs text-stone-500 hover:text-stone-800 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-xs text-red-400 hover:text-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-6 shadow-lg">

            <h2 className="text-base font-semibold text-stone-800 mb-5">
              {editingNote ? "Edit Note" : "New Note"}
            </h2>

            <div className="flex flex-col gap-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1.5">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1.5">
                  Content
                </label>
                <textarea
                  placeholder="Write your note..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition resize-none"
                />
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-1.5">
                  Tag <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. work, personal"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition"
                />
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-lg border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="flex-1 py-2.5 rounded-lg bg-stone-800 text-white text-sm font-semibold hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
