"use client";

import { createContext, useContext } from "react";

/** Hover/search state shared with the custom node renderers via context, so
 *  React Flow's node objects stay referentially stable (mutating them resets
 *  its measurement cycle and hides nodes). */
export interface DiagramState {
  /** Hovered node + its direct neighbors; null when nothing is hovered. */
  neighborIds: Set<string> | null;
  /** Nodes matching the current search query; empty when no query. */
  matchedIds: Set<string>;
}

export const DiagramStateContext = createContext<DiagramState>({
  neighborIds: null,
  matchedIds: new Set(),
});

export function useDiagramState(): DiagramState {
  return useContext(DiagramStateContext);
}

export function nodeVisualState(id: string, state: DiagramState) {
  const { neighborIds, matchedIds } = state;
  const active = matchedIds.has(id);
  const dimmed = neighborIds
    ? !neighborIds.has(id)
    : matchedIds.size > 0 && !active;
  return { active, dimmed };
}
