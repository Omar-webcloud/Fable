"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Minus,
  Eye,
  Edit3,
  Columns,
  Sparkles,
} from "lucide-react";
import { FormattedReader } from "./FormattedReader";
import { cn } from "@/lib/utils";

export function ManuscriptEditor({
  value = "",
  onChange,
  placeholder = "Write or paste the full manuscript content here...",
  className = "",
}) {
  const [viewMode, setViewMode] = useState("editor"); // 'editor' | 'preview' | 'split'
  const textareaRef = useRef(null);

  const wordsCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charsCount = value.length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordsCount / 220));

  // Insert formatting wrapper or prefix at cursor position
  const applyFormatting = (prefix, suffix = "", defaultText = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const textToWrap = selected || defaultText;

    const newText =
      value.substring(0, start) +
      prefix +
      textToWrap +
      suffix +
      value.substring(end);

    onChange(newText);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + textToWrap.length;
      textarea.setSelectionRange(
        start + prefix.length,
        newCursorPos
      );
    }, 0);
  };

  const insertLinePrefix = (prefix) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    // Find beginning of current line
    const lastNewline = value.lastIndexOf("\n", start - 1);
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;

    const newText =
      value.substring(0, lineStart) +
      prefix +
      value.substring(lineStart);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  };

  const toolbarButtons = [
    {
      label: "Bold",
      icon: Bold,
      action: () => applyFormatting("**", "**", "bold text"),
      title: "Bold (**text**)",
    },
    {
      label: "Italic",
      icon: Italic,
      action: () => applyFormatting("*", "*", "italic text"),
      title: "Italic (*text*)",
    },
    {
      label: "Chapter Heading",
      icon: Heading1,
      action: () => insertLinePrefix("# "),
      title: "Chapter Heading (# Title)",
    },
    {
      label: "Section Header",
      icon: Heading2,
      action: () => insertLinePrefix("## "),
      title: "Section Heading (## Subtitle)",
    },
    {
      label: "Subsection",
      icon: Heading3,
      action: () => insertLinePrefix("### "),
      title: "Subsection (### Subheading)",
    },
    {
      label: "Quote / Dialogue",
      icon: Quote,
      action: () => insertLinePrefix("> "),
      title: "Blockquote (> Quote)",
    },
    {
      label: "Bullet List",
      icon: List,
      action: () => insertLinePrefix("- "),
      title: "Bullet Item (- Item)",
    },
    {
      label: "Numbered List",
      icon: ListOrdered,
      action: () => insertLinePrefix("1. "),
      title: "Numbered Item (1. Item)",
    },
    {
      label: "Scene Break",
      icon: Minus,
      action: () => applyFormatting("\n\n---\n\n", "", ""),
      title: "Scene Break (---)",
    },
  ];

  return (
    <div className={cn("border border-zinc-700/80 bg-zinc-950 flex flex-col", className)}>
      {/* Editor Top Bar with Formatting Tools & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 bg-zinc-900/90 px-3 py-2 text-xs">
        {/* Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1">
          {toolbarButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.label}
                type="button"
                onClick={btn.action}
                title={btn.title}
                className="flex h-8 w-8 items-center justify-center border border-transparent text-zinc-400 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 border border-zinc-700/60 bg-zinc-950 p-0.5">
          <button
            type="button"
            onClick={() => setViewMode("editor")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer",
              viewMode === "editor"
                ? "bg-zinc-800 text-white font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Edit3 className="h-3 w-3" />
            <span>Write</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer",
              viewMode === "preview"
                ? "bg-zinc-800 text-amber-500 font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Eye className="h-3 w-3" />
            <span>Reader Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={cn(
              "hidden md:flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer",
              viewMode === "split"
                ? "bg-zinc-800 text-sky-400 font-bold"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Columns className="h-3 w-3" />
            <span>Split</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="min-h-[360px] flex-1">
        {viewMode === "editor" && (
          <textarea
            ref={textareaRef}
            rows={14}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[360px] bg-zinc-950 p-4 font-mono text-xs text-zinc-200 placeholder-zinc-600 outline-none leading-relaxed resize-y"
          />
        )}

        {viewMode === "preview" && (
          <div className="min-h-[360px] p-6 sm:p-8 bg-zinc-900/30 overflow-y-auto max-h-[600px]">
            {value.trim() ? (
              <FormattedReader content={value} />
            ) : (
              <p className="text-zinc-500 italic font-mono text-xs text-center py-16">
                Start writing in the &apos;Write&apos; tab to preview your manuscript typography...
              </p>
            )}
          </div>
        )}

        {viewMode === "split" && (
          <div className="grid grid-cols-2 divide-x divide-zinc-800 min-h-[360px]">
            <textarea
              ref={textareaRef}
              rows={14}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full h-full min-h-[360px] bg-zinc-950 p-4 font-mono text-xs text-zinc-200 placeholder-zinc-600 outline-none leading-relaxed resize-none"
            />
            <div className="p-6 bg-zinc-900/30 overflow-y-auto max-h-[600px]">
              {value.trim() ? (
                <FormattedReader content={value} />
              ) : (
                <p className="text-zinc-500 italic font-mono text-xs text-center py-16">
                  Live preview will render here as you type...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Editor Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800 bg-zinc-900/70 px-4 py-2 font-mono text-[11px] text-zinc-400">
        <div className="flex items-center gap-4">
          <span>{wordsCount.toLocaleString()} Words</span>
          <span>•</span>
          <span>{charsCount.toLocaleString()} Characters</span>
          <span>•</span>
          <span className="text-amber-500">~{readTimeMinutes} Min Read Time</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
          <Sparkles className="h-3 w-3 text-amber-500" />
          <span>Markdown Supported (# Chapters, **Bold**, *Italic*, &gt; Quotes)</span>
        </div>
      </div>
    </div>
  );
}
