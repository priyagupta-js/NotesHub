"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NotesPage() {
  const router = useRouter();

  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch notes from backend
  const fetchNotes = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");

      // If token not found, redirect to login
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/notes",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      // Unauthorized
      if (!response.ok) {
        setMessage(data.message || "Failed to fetch notes");
        return;
      }

      setNotes(data);

    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  };

  // Run when page loads
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Page Heading */}
      <h1 className="text-4xl font-bold text-center mb-8">
        My Notes
      </h1>

      {/* Error Message */}
      {message && (
        <p className="text-center text-red-500 mb-4">
          {message}
        </p>
      )}

      {/* Notes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {notes.length > 0 ? (
          notes.map((note) => (
            <div
              key={note._id}
              className="bg-white p-5 rounded-xl shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">
                {note.title}
              </h2>

              <p className="text-gray-700 mb-3">
                {note.content}
              </p>

              <span className="inline-block bg-black text-white text-sm px-3 py-1 rounded-full">
                {note.tag}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No notes found
          </p>
        )}

      </div>
    </div>
  );
}