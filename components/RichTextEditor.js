"use client";

import { useRef, useEffect, useState } from "react";
import { api } from "../lib/api";

export default function RichTextEditor({ value, onChange, token }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  // Sync initial value / external changes into contentEditable without breaking cursor
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  function handleInput() {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }

  function exec(command, val = null) {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  }

  function handleFormatBlock(tag) {
    // If already in that block, reset to paragraph
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      exec("formatBlock", tag);
    }
  }

  function handleAddLink() {
    const url = prompt("Masukkan URL Link:");
    if (url) {
      exec("createLink", url);
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const data = await api.upload("/articles/upload", fd, token);
      const imageUrl = data.urls?.[0];
      if (imageUrl) {
        exec("insertImage", imageUrl);
      }
    } catch (err) {
      alert("Gagal mengunggah gambar: " + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="border border-sand rounded-2xl overflow-hidden bg-white">
      {/* Hidden File Input for Toolbar Image Button */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* Toolbar matching user screenshot */}
      <div className="bg-[#f9f8f5] border-b border-sand px-3 py-2 flex flex-wrap items-center gap-1 text-bark-600 select-none">
        {/* H2 */}
        <button
          type="button"
          onClick={() => handleFormatBlock("<h2>")}
          className="px-2 py-1 rounded text-xs font-bold hover:bg-sand text-bark-700 transition-colors"
          title="Heading 2"
        >
          H<span className="text-[10px]">2</span>
        </button>

        {/* H3 */}
        <button
          type="button"
          onClick={() => handleFormatBlock("<h3>")}
          className="px-2 py-1 rounded text-xs font-bold hover:bg-sand text-bark-700 transition-colors"
          title="Heading 3"
        >
          H<span className="text-[10px]">3</span>
        </button>

        <div className="h-4 w-px bg-sand mx-1" />

        {/* Bold */}
        <button
          type="button"
          onClick={() => exec("bold")}
          className="px-2.5 py-1 rounded text-xs font-extrabold hover:bg-sand text-bark-700 transition-colors"
          title="Tebal (Bold)"
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => exec("italic")}
          className="px-2.5 py-1 rounded text-xs italic font-serif hover:bg-sand text-bark-700 transition-colors"
          title="Miring (Italic)"
        >
          I
        </button>

        <div className="h-4 w-px bg-sand mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className="p-1.5 rounded hover:bg-sand text-bark-600 transition-colors"
          title="Daftar Bulatan (Bullet List)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          className="p-1.5 rounded hover:bg-sand text-bark-600 transition-colors"
          title="Daftar Angka (Numbered List)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
            <path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
          </svg>
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => handleFormatBlock("<blockquote>")}
          className="p-1.5 rounded hover:bg-sand text-bark-600 transition-colors"
          title="Kutipan (Quote)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </button>

        <div className="h-4 w-px bg-sand mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={handleAddLink}
          className="p-1.5 rounded hover:bg-sand text-bark-600 transition-colors"
          title="Sisipkan Link"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>

        {/* Image Upload */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="p-1.5 rounded hover:bg-sand text-bark-600 transition-colors disabled:opacity-50"
          title="Sisipkan Gambar dalam Artikel"
        >
          {uploading ? (
            <span className="text-[10px] font-semibold text-cinnamon-600">...</span>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          )}
        </button>

        <div className="h-4 w-px bg-sand mx-1" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => exec("undo")}
          className="p-1.5 rounded hover:bg-sand text-bark-600 transition-colors"
          title="Undo (Urungkan)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => exec("redo")}
          className="p-1.5 rounded hover:bg-sand text-bark-600 transition-colors"
          title="Redo (Ulangi)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="p-4 min-h-[280px] max-h-[500px] overflow-y-auto focus:outline-none text-sm text-bark-700 prose prose-sm max-w-none leading-relaxed"
        placeholder="Tulis artikel di sini..."
      />
    </div>
  );
}