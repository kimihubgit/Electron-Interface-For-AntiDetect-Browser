import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useBrowser } from '../../store/BrowserContext';

import { BLOCK_CATALOG, INITIAL_NODES, INITIAL_EDGES } from './data/blockCatalog';
import AutomationTopBar from './components/AutomationTopBar';
import AutomationSidebar from './components/AutomationSidebar';
import AutomationCanvas from './components/AutomationCanvas';
import AutomationInspectorDrawer from './components/AutomationInspectorDrawer';

export default function AutomationPage() {
  const { setActiveTab, addLog } = useBrowser();

  // Sidebar Controls
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeCategoryTab, setActiveCategoryTab] = useState('general');
  const [blockSearchQuery, setBlockSearchQuery] = useState('');
  const [canvasSearchQuery, setCanvasSearchQuery] = useState('');
  const [openAccordions, setOpenAccordions] = useState({ General: true, 'Browser & AI': true });

  // Script Metadata
  const [workflowTitle, setWorkflowTitle] = useState('Reg Bubble');
  const [workflowVersion, setWorkflowVersion] = useState('6 : Reg Redbubble New');

  // Canvas Transform (Pan & Zoom)
  const [zoomLevel, setZoomLevel] = useState(0.85);
  const [panOffset, setPanOffset] = useState({ x: 50, y: 35 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isLocked, setIsLocked] = useState(false);

  // Nodes and Edges State
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);

  // Selected & Editing Node
  const [selectedNodeId, setSelectedNodeId] = useState('node-cond');
  const [editingNode, setEditingNode] = useState(null);

  // Delta Dragging State (mathematically immune to pan/zoom jumping)
  const [draggingNodeState, setDraggingNodeState] = useState(null);

  // Live Wire Connection
  const [connectingState, setConnectingState] = useState(null);

  // Execution Simulation
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeStepId, setActiveStepId] = useState(null);

  const canvasRef = useRef(null);

  // Screen to canvas coordinate conversion
  const screenToCanvas = useCallback((clientX, clientY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - panOffset.x) / zoomLevel,
      y: (clientY - rect.top - panOffset.y) / zoomLevel
    };
  }, [panOffset, zoomLevel]);

  // Global mouse listeners for panning, node dragging, and wire drawing
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      // 1. Canvas Pan
      if (isPanning) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y
        });
        return;
      }

      // 2. Node Drag (Delta formula)
      if (draggingNodeState) {
        const deltaX = (e.clientX - draggingNodeState.startClientX) / zoomLevel;
        const deltaY = (e.clientY - draggingNodeState.startClientY) / zoomLevel;
        const newX = Math.round(draggingNodeState.startNodeX + deltaX);
        const newY = Math.round(draggingNodeState.startNodeY + deltaY);

        setNodes(prev => prev.map(n => (n.id === draggingNodeState.id ? { ...n, x: newX, y: newY } : n)));
        return;
      }

      // 3. Drawing wire
      if (connectingState) {
        const pos = screenToCanvas(e.clientX, e.clientY);
        setConnectingState(prev => (prev ? { ...prev, currentX: pos.x, currentY: pos.y } : null));
      }
    };

    const handleGlobalMouseUp = () => {
      setIsPanning(false);
      setDraggingNodeState(null);
      setConnectingState(null);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isPanning, panStart, draggingNodeState, connectingState, zoomLevel, screenToCanvas]);

  // Wheel zoom
  const handleCanvasWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoomLevel(prev => Math.min(1.8, Math.max(0.4, Number((prev + zoomDelta).toFixed(2)))));
  };

  // Pan start
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.id === 'canvas-svg-layer') {
      setSelectedNodeId(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  // Node drag start
  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    if (isLocked) return;
    setSelectedNodeId(node.id);
    setDraggingNodeState({
      id: node.id,
      startNodeX: node.x,
      startNodeY: node.y,
      startClientX: e.clientX,
      startClientY: e.clientY
    });
  };

  // Drag and drop palette block
  const handlePaletteDragStart = (e, block) => {
    e.dataTransfer.setData('text/plain', block.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleCanvasDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleCanvasDrop = (e) => {
    e.preventDefault();
    const blockId = e.dataTransfer.getData('text/plain');
    if (!blockId) return;

    const template = BLOCK_CATALOG.find(b => b.id === blockId);
    if (!template) return;

    const pos = screenToCanvas(e.clientX, e.clientY);
    const newNode = {
      id: `node-${Date.now().toString().slice(-4)}`,
      type: template.type,
      title: template.title,
      badge: template.badge,
      badgeColor: template.badgeColor,
      color: template.color,
      icon: template.icon,
      x: Math.round(pos.x - 120),
      y: Math.round(pos.y - 45),
      status: 'idle',
      data: { ...template.defaultData }
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    addLog?.(`Đã thêm khối "${template.title}" vào quy trình`, 'info');
  };

  const handleAddBlockClick = (template) => {
    const newNode = {
      id: `node-${Date.now().toString().slice(-4)}`,
      type: template.type,
      title: template.title,
      badge: template.badge,
      badgeColor: template.badgeColor,
      color: template.color,
      icon: template.icon,
      x: 350 + Math.floor(Math.random() * 60),
      y: 190 + Math.floor(Math.random() * 60),
      status: 'idle',
      data: { ...template.defaultData }
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    addLog?.(`Đã thêm khối "${template.title}"`, 'info');
  };

  // Wire connect handlers
  const handleStartWire = (e, nodeId, fromPort = 'default') => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const nodeWidth = 240;
    const startX = node.x + nodeWidth;
    const isCond = node.type === 'condition';
    const startY = isCond
      ? fromPort === 'false'
        ? node.y + 115
        : node.y + 70
      : node.y + 55;

    setConnectingState({
      fromNodeId: nodeId,
      fromPort,
      startX,
      startY,
      currentX: startX,
      currentY: startY
    });
  };

  const handleEndWire = (e, targetNodeId) => {
    e.stopPropagation();
    if (connectingState && connectingState.fromNodeId !== targetNodeId) {
      const exists = edges.some(
        edge =>
          edge.from === connectingState.fromNodeId &&
          edge.to === targetNodeId &&
          edge.fromPort === connectingState.fromPort
      );
      if (!exists) {
        setEdges(prev => [
          ...prev,
          {
            id: `e-${Date.now().toString().slice(-4)}`,
            from: connectingState.fromNodeId,
            to: targetNodeId,
            fromPort: connectingState.fromPort
          }
        ]);
        addLog?.('Đã liên kết 2 khối quy trình thành công', 'success');
      }
    }
    setConnectingState(null);
  };

  const handleDeleteNode = (nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId));
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
    if (editingNode?.id === nodeId) setEditingNode(null);
  };

  const handleDeleteEdge = (edgeId) => {
    setEdges(prev => prev.filter(e => e.id !== edgeId));
  };

  // Run simulation
  const handleRunWorkflow = () => {
    if (isExecuting) return;
    setIsExecuting(true);
    addLog?.('▶ Đang chạy quy trình tự động hóa RPA Visual Flow...', 'success');

    setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })));
    const sequence = nodes.map(n => n.id);
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < sequence.length) {
        const curId = sequence[idx];
        setActiveStepId(curId);
        setNodes(prev =>
          prev.map(n => {
            if (n.id === curId) return { ...n, status: 'running' };
            if (sequence.indexOf(n.id) < idx) return { ...n, status: 'success' };
            return n;
          })
        );
        idx++;
      } else {
        clearInterval(interval);
        setActiveStepId(null);
        setNodes(prev => prev.map(n => ({ ...n, status: 'success' })));
        setIsExecuting(false);
        addLog?.('✓ Quy trình đã thực thi hoàn tất 100%!', 'success');
      }
    }, 900);
  };

  return (
    <div
      style={{
        flex: 1,
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        userSelect: 'none',
        fontFamily: 'inherit'
      }}
    >
      <style>{`
        @keyframes pulseLineAnim {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .wire-running {
          animation: pulseLineAnim 0.75s linear infinite;
        }
      `}</style>

      {/* Top Action & Title Bar */}
      <AutomationTopBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        canvasSearchQuery={canvasSearchQuery}
        setCanvasSearchQuery={setCanvasSearchQuery}
        isExecuting={isExecuting}
        onRunWorkflow={handleRunWorkflow}
        onBack={() => setActiveTab?.('profiles')}
        onHome={() => setActiveTab?.('workspace')}
      />

      {/* Workspace Body */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Left Palette */}
        {isSidebarOpen && (
          <AutomationSidebar
            workflowTitle={workflowTitle}
            workflowVersion={workflowVersion}
            activeCategoryTab={activeCategoryTab}
            setActiveCategoryTab={setActiveCategoryTab}
            blockSearchQuery={blockSearchQuery}
            setBlockSearchQuery={setBlockSearchQuery}
            openAccordions={openAccordions}
            setOpenAccordions={setOpenAccordions}
            onPaletteDragStart={handlePaletteDragStart}
            onAddBlockClick={handleAddBlockClick}
          />
        )}

        {/* Main Canvas */}
        <AutomationCanvas
          canvasRef={canvasRef}
          nodes={nodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          isExecuting={isExecuting}
          activeStepId={activeStepId}
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          panOffset={panOffset}
          setPanOffset={setPanOffset}
          isPanning={isPanning}
          isLocked={isLocked}
          setIsLocked={setIsLocked}
          connectingState={connectingState}
          onCanvasMouseDown={handleCanvasMouseDown}
          onCanvasWheel={handleCanvasWheel}
          onCanvasDragOver={handleCanvasDragOver}
          onCanvasDrop={handleCanvasDrop}
          onNodeMouseDown={handleNodeMouseDown}
          onNodeDoubleClick={(node) => setEditingNode(node)}
          onDeleteNode={handleDeleteNode}
          onDeleteEdge={handleDeleteEdge}
          onStartWire={handleStartWire}
          onEndWire={handleEndWire}
        />

        {/* Node Inspector Drawer */}
        <AutomationInspectorDrawer
          editingNode={editingNode}
          setEditingNode={setEditingNode}
          setNodes={setNodes}
          onDeleteNode={handleDeleteNode}
        />
      </div>
    </div>
  );
}
