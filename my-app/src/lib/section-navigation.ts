export type SectionId = "momo" | "buffett" | "company" | "quiz" | "agentgame";

export const SECTION_EVENT = "mainagent:section";

export function requestSection(id: SectionId) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(SECTION_EVENT, { detail: id }));
}
