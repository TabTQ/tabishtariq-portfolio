"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dagre from "dagre";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type ReactFlowInstance,
  MarkerType,
} from "@xyflow/react";
import { nodeTypes } from "./nodes";
import { DiagramStateContext } from "./DiagramState";
import type { DiagramSpec, NodeKind } from "@/lib/types";

const SIZE: Record<NodeKind, { w: number; h: number }> = {
  root: { w: 230, h: 74 },
  step: { w: 220, h: 80 },
  domain: { w: 210, h: 66 },
  service: { w: 210, h: 66 },
  group: { w: 200, h: 66 },
  storage: { w: 180, h: 58 },
  device: { w: 180, h: 58 },
  metric: { w: 190, h: 58 },
};

/** Zoom/fit bounds scale with diagram size: small maps shouldn't render
 *  oversized-and-empty, large ones shouldn't crush labels to fit. */
function viewportConfig(nodeCount: number) {
  if (nodeCount <= 6) return { minZoom: 0.4, maxZoom: 1.6, padding: 0.24, fitMaxZoom: 1.0 };
  if (nodeCount <= 12) return { minZoom: 0.3, maxZoom: 1.6, padding: 0.18, fitMaxZoom: 1.1 };
  if (nodeCount <= 20) return { minZoom: 0.2, maxZoom: 1.6, padding: 0.14, fitMaxZoom: 1.2 };
  return { minZoom: 0.12, maxZoom: 1.6, padding: 0.1, fitMaxZoom: 1.2 };
}

function layout(spec: DiagramSpec): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: spec.direction,
    nodesep: spec.direction === "TB" ? 56 : 64,
    ranksep: spec.direction === "TB" ? 88 : 120,
    marginx: 16,
    marginy: 16,
  });

  spec.nodes.forEach((n) => {
    const s = SIZE[n.kind];
    g.setNode(n.id, { width: s.w, height: s.h });
  });
  spec.edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  const nodes: Node[] = spec.nodes.map((n) => {
    const pos = g.node(n.id);
    const s = SIZE[n.kind];
    return {
      id: n.id,
      type: n.kind,
      position: { x: pos.x - s.w / 2, y: pos.y - s.h / 2 },
      data: { ...n, dir: spec.direction },
      // Pin the rendered width to the width dagre reserved, so siblings can't overlap.
      style: { width: s.w },
      draggable: false,
      connectable: false,
      selectable: Boolean(n.route),
    };
  });

  const edges: Edge[] = spec.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    type: "smoothstep",
    animated: Boolean(e.dashed),
    style: e.dashed ? { strokeDasharray: "5 4" } : undefined,
    markerEnd: { type: MarkerType.ArrowClosed, color: "#4a4038", width: 16, height: 16 },
  }));

  return { nodes, edges };
}

export function SystemMap({
  spec,
  height = 460,
  filter = "",
}: {
  spec: DiagramSpec;
  height?: number | string;
  filter?: string;
}) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const instanceRef = useRef<ReactFlowInstance | null>(null);
  const lastFilterRef = useRef("");

  const { nodes: baseNodes, edges: baseEdges } = useMemo(() => layout(spec), [spec]);
  const view = viewportConfig(spec.nodes.length);

  const query = filter.trim().toLowerCase();
  const matchedIds = useMemo(() => {
    if (!query) return new Set<string>();
    return new Set(
      spec.nodes
        .filter(
          (n) =>
            n.label.toLowerCase().includes(query) ||
            (n.sublabel ?? "").toLowerCase().includes(query),
        )
        .map((n) => n.id),
    );
  }, [spec, query]);

  // Pan/zoom to the matched nodes whenever the search query changes.
  useEffect(() => {
    if (query === lastFilterRef.current) return;
    lastFilterRef.current = query;
    const instance = instanceRef.current;
    if (!instance) return;
    if (matchedIds.size > 0) {
      instance.fitView({
        nodes: [...matchedIds].map((id) => ({ id })),
        padding: 0.4,
        maxZoom: view.fitMaxZoom,
        duration: 350,
      });
    } else if (!query) {
      instance.fitView({ padding: view.padding, maxZoom: view.fitMaxZoom, duration: 350 });
    }
  }, [query, matchedIds, view.fitMaxZoom, view.padding]);

  // Hover focus: dim everything not connected to the hovered node.
  const neighborIds = useMemo(() => {
    if (!hoveredId) return null;
    const ids = new Set([hoveredId]);
    for (const e of spec.edges) {
      if (e.source === hoveredId) ids.add(e.target);
      if (e.target === hoveredId) ids.add(e.source);
    }
    return ids;
  }, [spec, hoveredId]);

  const diagramState = useMemo(
    () => ({ neighborIds, matchedIds }),
    [neighborIds, matchedIds],
  );

  const edges = useMemo<Edge[]>(
    () =>
      baseEdges.map((e) => {
        const dimmed =
          neighborIds !== null &&
          !(e.source === hoveredId || e.target === hoveredId);
        return {
          ...e,
          style: {
            ...e.style,
            opacity: dimmed ? 0.2 : 1,
            transition: "opacity 200ms ease",
          },
        };
      }),
    [baseEdges, neighborIds, hoveredId],
  );

  const onNodeClick = useCallback<NodeMouseHandler>(
    (_evt, node) => {
      const route = (node.data as { route?: string }).route;
      if (!route) return;
      if (route.startsWith("#")) {
        const el = document.getElementById(route.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-accent");
          setTimeout(() => el.classList.remove("ring-2", "ring-accent"), 1600);
        }
      } else {
        router.push(route);
      }
    },
    [router],
  );

  return (
    <DiagramStateContext.Provider value={diagramState}>
    <div
      className="overflow-hidden rounded-xl border border-border bg-bg-2"
      style={{ height }}
    >
      <ReactFlow
        nodes={baseNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onNodeMouseEnter={(_evt, node) => setHoveredId(node.id)}
        onNodeMouseLeave={() => setHoveredId(null)}
        onInit={(instance) => {
          instanceRef.current = instance;
        }}
        fitView
        fitViewOptions={{ padding: view.padding, maxZoom: view.fitMaxZoom }}
        minZoom={view.minZoom}
        maxZoom={view.maxZoom}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnScroll
        zoomOnScroll={false}
        preventScrolling={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#332b24" />
        <Controls showInteractive={false} position="bottom-right" />
        {spec.nodes.length > 10 ? (
          <MiniMap
            pannable
            zoomable
            position="bottom-left"
            style={{ width: 140, height: 96 }}
            bgColor="rgba(20, 16, 13, 0.85)"
            maskColor="rgba(20, 16, 13, 0.6)"
            nodeColor="#4a4038"
            nodeStrokeColor="#6b5d50"
          />
        ) : null}
      </ReactFlow>
    </div>
    </DiagramStateContext.Provider>
  );
}
