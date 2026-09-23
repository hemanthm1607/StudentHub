import * as React from "react";

interface SafeMarkdownProps {
  content: string;
  className?: string;
}

/**
 * XSS-Safe Markdown renderer.
 * Renders structured markdown directly into React DOM elements without
 * dangerouslySetInnerHTML or arbitrary HTML execution.
 */
export function SafeMarkdown({ content, className = "" }: SafeMarkdownProps) {
  if (!content) return null;

  // Split content into blocks: code blocks vs text blocks
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  const blocks: Array<{ type: "code" | "text"; language?: string; content: string }> = [];

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      blocks.push({
        type: "text",
        content: content.slice(lastIndex, match.index),
      });
    }
    blocks.push({
      type: "code",
      language: match[1] || "text",
      content: match[2].trimEnd(),
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    blocks.push({
      type: "text",
      content: content.slice(lastIndex),
    });
  }

  return (
    <div className={`space-y-4 text-slate-700 leading-relaxed ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === "code") {
          return (
            <div key={idx} className="my-5 rounded-lg border border-slate-200 bg-slate-900 text-slate-100 overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <span>{(block.language || "code").toUpperCase()}</span>
                <span>Read-only snippet</span>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono leading-normal">
                <code>{block.content}</code>
              </pre>
            </div>
          );
        }

        return <TextBlock key={idx} text={block.content} />;
      })}
    </div>
  );
}

function TextBlock({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === "ul") {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-2 pl-2 text-sm">
          {currentList.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 my-2 pl-2 text-sm">
          {currentList.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Headings
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={`h3-${i}`} className="text-base font-semibold text-slate-900 mt-6 mb-2 tracking-tight">
          {renderInline(trimmed.slice(4))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg font-bold text-slate-900 mt-8 mb-3 tracking-tight">
          {renderInline(trimmed.slice(3))}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushList();
      elements.push(
        <h1 key={`h1-${i}`} className="text-xl font-extrabold text-slate-900 mt-8 mb-3 tracking-tight">
          {renderInline(trimmed.slice(2))}
        </h1>
      );
      continue;
    }

    // Unordered List
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!currentList || currentList.type !== "ul") {
        flushList();
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(trimmed.slice(2));
      continue;
    }

    // Ordered List
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== "ol") {
        flushList();
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(olMatch[2]);
      continue;
    }

    // Standard paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="text-sm text-slate-700 my-2 leading-relaxed">
        {renderInline(trimmed)}
      </p>
    );
  }

  flushList();

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  // Parse inline `code` and **bold**
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }

    const token = match[0];
    if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={`code-${match.index}`}
          className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-xs border border-slate-200"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>
      );
    }

    lastIdx = match.index + token.length;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  return parts.length === 0 ? text : <>{parts}</>;
}
