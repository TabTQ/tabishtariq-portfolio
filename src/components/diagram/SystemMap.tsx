"use client";

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import dagre from "dagre";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
  type NodeMouseHandler,
  MarkerType,
} from "@xyflow/react";
import { nodeTypes } from "./nodes";
import type { DiagramSpec, NodeKind } from "@/data/types";

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
}: {
  spec: DiagramSpec;
  height?: number;
}) {
  const router = useRouter();
  const { nodes, edges } = useMemo(() => layout(spec), [spec]);

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
    <div
      className="overflow-hidden rounded-xl border border-border bg-bg-2"
      style={{ height }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.3}
        maxZoom={1.6}
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
      </ReactFlow>
    </div>
  );
}
