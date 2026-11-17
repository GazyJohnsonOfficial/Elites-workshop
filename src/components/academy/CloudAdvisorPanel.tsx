"use client";

import React, { useState } from "react";
import { ArrowRight, Cloud, Search } from "lucide-react";

function renderInlineMarkdown(str: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(str)) !== null) {
    if (match.index > lastIdx) {
      parts.push(str.slice(lastIdx, match.index));
    }
    const token = match[0];
    if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code key={match.index} className="acad-advisor-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(<strong key={match.index}>{token.slice(2, -2)}</strong>);
    }
    lastIdx = regex.lastIndex;
  }
  if (lastIdx < str.length) {
    parts.push(str.slice(lastIdx));
  }
  return parts.length > 0 ? parts : [str];
}

function AdvisorMarkdown({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushList = (key: number) => {
    if (!currentList) return null;
    const ListTag = currentList.type;
    const items = currentList.items.map((item, idx) => (
      <li key={idx}>{renderInlineMarkdown(item)}</li>
    ));
    const listElement = (
      <ListTag key={`list-${key}`} className="acad-advisor-list">
        {items}
      </ListTag>
    );
    currentList = null;
    return listElement;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentList) {
        const flushed = flushList(index);
        if (flushed) elements.push(flushed);
      }
      return;
    }

    if (trimmed.startsWith("### ")) {
      if (currentList) {
        const flushed = flushList(index);
        if (flushed) elements.push(flushed);
      }
      elements.push(
        <h4 key={`h4-${index}`} className="acad-advisor-h4">
          {renderInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      if (currentList) {
        const flushed = flushList(index);
        if (flushed) elements.push(flushed);
      }
      elements.push(
        <h3 key={`h3-${index}`} className="acad-advisor-h3">
          {renderInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
        </h3>
      );
      return;
    }

    const bulletMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      if (currentList && currentList.type !== "ul") {
        const flushed = flushList(index);
        if (flushed) elements.push(flushed);
      }
      if (!currentList) {
        currentList = { type: "ul", items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      return;
    }

    const numberedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (numberedMatch) {
      if (currentList && currentList.type !== "ol") {
        const flushed = flushList(index);
        if (flushed) elements.push(flushed);
      }
      if (!currentList) {
        currentList = { type: "ol", items: [] };
      }
      currentList.items.push(numberedMatch[1]);
      return;
    }

    if (currentList) {
      const flushed = flushList(index);
      if (flushed) elements.push(flushed);
    }
    elements.push(
      <p key={`p-${index}`} className="acad-advisor-p">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  });

  if (currentList) {
    const flushed = flushList(lines.length);
    if (flushed) elements.push(flushed);
  }

  return <div className="acad-advisor-prose">{elements}</div>;
}

const ADVISOR_PRESETS = [
  "Terraform State",
  "AWS Well-Architected",
  "Python & dbt ETL",
  "CIS vs NIST CSF",
] as const;

export function CloudAdvisorPanel({ selectedCategory }: { selectedCategory: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [searchSources, setSearchSources] = useState<Array<{ title: string; uri: string }>>([]);
  const [searchMode, setSearchMode] = useState<"live" | "curated" | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleCloudSearch = async (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const q = customQ !== undefined ? customQ : searchQuery;
    if (!q.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const res = await fetch("/api/academy/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, category: selectedCategory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch guidance");
      setSearchResult(data.text);
      setSearchSources(data.sources || []);
      setSearchMode(data.mode || "curated");
    } catch (err: unknown) {
      setSearchError(err instanceof Error ? err.message : "Failed to query technical advisor");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="acad-section acad-section-compact" id="advisor">
      <div className="container">
        <div className="acad-advisor">
          <div className="acad-advisor-head">
            <div className="acad-advisor-title">
              <div className="acad-advisor-icon" aria-hidden="true">
                <Cloud size={22} />
              </div>
              <div>
                <h2>Cloud Architecture &amp; Technical Documentation Advisor</h2>
                <p>
                  Query production cloud architecture baselines, security compliance frameworks, data engineering patterns, and official reference documentation.
                </p>
              </div>
            </div>
            <div className="acad-advisor-presets">
              {ADVISOR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  disabled={isSearching}
                  onClick={() => {
                    setSearchQuery(preset);
                    handleCloudSearch(undefined, preset);
                  }}
                  className="acad-advisor-preset"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <form className="acad-advisor-form" onSubmit={(e) => handleCloudSearch(e)}>
            <label htmlFor="acad-advisor-input" className="acad-sr-only">
              Ask the technical advisor a cloud, data, or security question
            </label>
            <div className="acad-advisor-input-wrap">
              <Search size={16} aria-hidden="true" />
              <input
                id="acad-advisor-input"
                type="text"
                maxLength={300}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask about Terraform drift, Well-Architected pillars, dbt models, or CIS controls..."
                className="acad-input"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="btn btn-navy"
            >
              {isSearching ? "Retrieving…" : "Ask Advisor"}
            </button>
          </form>

          {searchError && (
            <div className="acad-advisor-error" role="alert">
              {searchError}
            </div>
          )}

          {(searchResult || isSearching) && (
            <div className="acad-advisor-result" aria-live="polite">
              {isSearching ? (
                <div className="acad-advisor-loading">
                  <span className="acad-advisor-spinner" aria-hidden="true" />
                  <span>Retrieving architecture guidance…</span>
                </div>
              ) : (
                <>
                  {searchMode && (
                    <span className={`acad-advisor-badge ${searchMode}`}>
                      {searchMode === "live"
                        ? "Grounded Reference"
                        : "Elites Architecture Reference"}
                    </span>
                  )}
                  <AdvisorMarkdown text={searchResult ?? ""} />
                  {searchSources.length > 0 && (
                    <div className="acad-advisor-sources">
                      <span className="acad-advisor-sources-label">
                        References &amp; documentation
                      </span>
                      <div className="acad-advisor-sources-list">
                        {searchSources.map((src, i) => (
                          <a
                            key={`${src.uri}-${i}`}
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{src.title}</span>
                            <ArrowRight size={12} aria-hidden="true" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
