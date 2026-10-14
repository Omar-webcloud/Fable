"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * Clean, lightweight renderer for manuscript formatting:
 * Headings (#, ##, ###), bold (**text**), italics (*text*), blockquotes (> quote),
 * horizontal rules (---), bullet lists (- item), numbered lists (1. item), and paragraphs.
 */
export function FormattedReader({ content = "", className = "" }) {
  if (!content) return null;

  const lines = content.split("\n");
  const elements = [];
  let currentList = [];
  let isNumberedList = false;

  const renderFormattedText = (text) => {
    // Parse bold and italic: **bold**, *italic*
    const parts = [];
    let lastIndex = 0;
    const regex = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(__([^_]+)__)|(_([^_]+)_)/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      if (match[2] || match[6]) {
        // Bold
        parts.push(
          <strong key={match.index} className="font-bold text-white">
            {match[2] || match[6]}
          </strong>
        );
      } else if (match[4] || match[8]) {
        // Italic
        parts.push(
          <em key={match.index} className="italic text-zinc-200">
            {match[4] || match[8]}
          </em>
        );
      }
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const flushList = () => {
    if (currentList.length > 0) {
      if (isNumberedList) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 my-4 text-zinc-300">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderFormattedText(item)}
              </li>
            ))}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-4 text-zinc-300">
            {currentList.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderFormattedText(item)}
              </li>
            ))}
          </ul>
        );
      }
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check list items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      isNumberedList = false;
      currentList.push(trimmed.slice(2));
      return;
    }
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (numMatch) {
      isNumberedList = true;
      currentList.push(numMatch[2]);
      return;
    }

    // Flush any pending list
    flushList();

    if (!trimmed) {
      elements.push(<div key={`empty-${index}`} className="h-4" />);
      return;
    }

    // Horizontal Rule
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      elements.push(
        <hr key={`hr-${index}`} className="my-8 border-t border-zinc-800" />
      );
      return;
    }

    // Heading 1
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h1
          key={`h1-${index}`}
          className="text-3xl sm:text-4xl font-normal tracking-tight text-white mt-10 mb-4 pb-2 border-b border-zinc-800 font-sans"
        >
          {trimmed.slice(2)}
        </h1>
      );
      return;
    }

    // Heading 2
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${index}`}
          className="text-2xl sm:text-3xl font-normal tracking-tight text-white mt-8 mb-3 font-sans"
        >
          {trimmed.slice(3)}
        </h2>
      );
      return;
    }

    // Heading 3
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${index}`}
          className="text-xl sm:text-2xl font-normal text-amber-400 mt-6 mb-2 font-sans"
        >
          {trimmed.slice(4)}
        </h3>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className="border-l-2 border-amber-500 bg-zinc-950/60 pl-4 py-2 my-4 italic text-zinc-300 font-serif"
        >
          {renderFormattedText(trimmed.slice(2))}
        </blockquote>
      );
      return;
    }

    // Standard Paragraph
    elements.push(
      <p key={`p-${index}`} className="leading-relaxed text-zinc-300 my-2">
        {renderFormattedText(line)}
      </p>
    );
  });

  flushList();

  return (
    <div className={cn("formatted-manuscript max-w-none font-serif text-base sm:text-lg leading-relaxed", className)}>
      {elements}
    </div>
  );
}
