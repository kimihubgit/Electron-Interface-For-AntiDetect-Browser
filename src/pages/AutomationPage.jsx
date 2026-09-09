import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Home,
  Code,
  FileText,
  Search,
  Play,
  Square,
  Pause,
  Download,
  Globe,
  Folder,
  Clipboard,
  Clock,
  Edit3,
  Terminal,
  Trash2,
  Image as ImageIcon,
  Tag,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Maximize2,
  Lock,
  Unlock,
  Star,
  RotateCcw,
  RotateCw,
  Settings,
  Database,
  Grid,
  MoreVertical,
  MousePointer,
  Type,
  CheckCircle2,
  AlertCircle,
  X,
  Zap,
  Shield,
  Layers,
  Sparkles,
  Bot,
  Copy,
  Sliders,
  PanelLeft,
  Check
} from 'lucide-react';
import { useBrowser } from '../store/BrowserContext';

// ── COMPREHENSIVE BLOCK TEMPLATES CATALOG ──
const BLOCK_CATALOG = [
  // 1. General Blocks (Matching user screenshot)
  {
    id: 'start',
    type: 'start',
    category: 'General',
    title: 'Bắt Đầu',
    badge: 'TRIGGER',
    badgeColor: '#10B981',
    icon: Play,
    color: '#10B981',
    desc: 'Khối bắt đầu khởi chạy quy trình tự động',
    defaultData: {
      concurrency: 4,
      targetDesc: 'Tất cả 12 hồ sơ TikTok Shop'
    }
  },
  {
    id: 'end',
    type: 'end',
    category: 'General',
    title: 'Kết Thúc',
    badge: 'FINISH',
    badgeColor: '#EF4444',
    icon: Square,
    color: '#EF4444',
    desc: 'Dừng quy trình, lưu Cookie và đóng tab an toàn',
    defaultData: {
      closeTab: true,
      syncCookies: true
    }
  },
  {
    id: 'delay',
    type: 'delay',
    category: 'General',
    title: 'Tạm Dừng',
    badge: 'DELAY',
    badgeColor: '#F59E0B',
    icon: Clock,
    color: '#F59E0B',
    desc: 'Tạm dừng luồng trong khoảng thời gian ngẫu nhiên',
    defaultData: {
      seconds: 3,
      randomRange: '2s - 5s'
    }
  },
  {
    id: 'export_data',
    type: 'export_data',
    category: 'General',
    title: 'Xuất Dữ Liệu',
    badge: 'EXPORT',
    badgeColor: '#3B82F6',
    icon: Download,
    color: '#3B82F6',
    desc: 'Lưu dữ liệu kết quả ra file JSON/CSV hoặc API',
    defaultData: {
      format: 'JSON',
      outputFile: 'exports/accounts_data.json'
    }
  },
  {
    id: 'http_request',
    type: 'http_request',
    category: 'General',
    title: 'HTTP Request',
    badge: 'API REST',
    badgeColor: '#06B6D4',
    icon: Globe,
    color: '#06B6D4',
    desc: 'Gửi yêu cầu REST API GET/POST trực tiếp',
    defaultData: {
      method: 'GET',
      url: 'https://api.ipify.org?format=json'
    }
  },
  {
    id: 'group_blocks',
    type: 'group_blocks',
    category: 'General',
    title: 'Nhóm Khối',
    badge: 'GROUP',
    badgeColor: '#8B5CF6',
    icon: Folder,
    color: '#8B5CF6',
    desc: 'Gom các khối lặp lại thành một cụm chức năng',
    defaultData: {
      groupName: 'Cụm Xác Minh Bảo Mật'
    }
  },
  {
    id: 'clipboard',
    type: 'clipboard',
    category: 'General',
    title: 'Bộ Nhớ Tạm',
    badge: 'CLIPBOARD',
    badgeColor: '#6366F1',
    icon: Clipboard,
    color: '#6366F1',
    desc: 'Lưu hoặc đọc dữ liệu từ clipboard hệ thống',
    defaultData: {
      action: 'read',
      variable: 'auth_token'
    }
  },
  {
    id: 'wait_connection',
    type: 'wait_connection',
    category: 'General',
    title: 'Chờ Kết Nối',
    badge: 'NETWORK',
    badgeColor: '#EC4899',
    icon: Clock,
    color: '#EC4899',
    desc: 'Chờ proxy hoặc kết nối mạng sẵn sàng',
    defaultData: {
      maxRetry: 5,
      pingHost: 'google.com'
    }
  },
  {
    id: 'note',
    type: 'note',
    category: 'General',
    title: 'Ghi Chú',
    badge: 'NOTE',
    badgeColor: '#64748B',
    icon: Edit3,
    color: '#64748B',
    desc: 'Ghi chú tài liệu cho kịch bản',
    defaultData: {
      noteText: 'Kiểm tra token phiên trước khi chuyển bước'
    }
  },
  {
    id: 'logger',
    type: 'logger',
    category: 'General',
    title: 'Ghi Log',
    badge: 'CONSOLE',
    badgeColor: '#1E293B',
    icon: Terminal,
    color: '#1E293B',
    desc: 'In thông điệp ra console và lịch sử hệ thống',
    defaultData: {
      logMessage: 'Đang tiến hành đăng ký tài khoản...'
    }
  },
  {
    id: 'ram_cleaner',
    type: 'ram_cleaner',
    category: 'General',
    title: 'Giải Phóng RA...',
    badge: 'OPTIMIZE',
    badgeColor: '#D97706',
    icon: Trash2,
    color: '#D97706',
    desc: 'Dọn dẹp bộ nhớ đệm và RAM trình duyệt',
    defaultData: {
      cleanCache: true,
      cleanHistory: true
    }
  },
  {
    id: 'find_image',
    type: 'find_image',
    category: 'General',
    title: 'Tìm Hình Ảnh',
    badge: 'CV VISION',
    badgeColor: '#14B8A6',
    icon: ImageIcon,
    color: '#14B8A6',
    desc: 'Tìm kiếm nút bấm hoặc hình ảnh trên màn hình',
    defaultData: {
      similarity: 0.85,
      timeoutSec: 10
    }
  },
  {
    id: 'profile_tags',
    type: 'profile_tags',
    category: 'General',
    title: 'Profile Tags',
    badge: 'TAGS',
    badgeColor: '#84CC16',
    icon: Tag,
    color: '#84CC16',
    desc: 'Gán nhãn phân loại trạng thái hồ sơ sau khi chạy',
    defaultData: {
      tag: 'Reg_Thành_Công'
    }
  },
  {
    id: 'finally_execute',
    type: 'finally_execute',
    category: 'General',
    title: 'Finally Execute',
    badge: 'FINALLY',
    badgeColor: '#475569',
    icon: Code,
    color: '#475569',
    desc: 'Khối luôn thực thi bất kể kịch bản thành công hay lỗi',
    defaultData: {
      forceClean: true
    }
  },

  // 2. Browser & AI Agents
  {
    id: 'ai_navigator',
    type: 'ai_navigator',
    category: 'Browser & AI',
    title: 'AI Web Navigator',
    badge: 'AI VISION',
    badgeColor: '#8B5CF6',
    icon: Bot,
    color: '#8B5CF6',
    desc: 'AI thị giác đọc giao diện và tương tác như người thật',
    defaultData: {
      model: 'Gemini 1.5 Pro Vision',
      goal: 'Lướt xem sản phẩm, tìm kiếm từ khóa và lưu vào giỏ hàng',
      maxSteps: 5
    }
  },
  {
    id: 'ai_captcha',
    type: 'ai_captcha',
    category: 'Browser & AI',
    title: 'AI Captcha Solver',
    badge: 'AI SOLVER',
    badgeColor: '#EC4899',
    icon: Shield,
    color: '#EC4899',
    desc: 'Tự động giải Cloudflare Turnstile, hCaptcha, Slide Puzzle',
    defaultData: {
      captchaType: 'Turnstile / Slide Puzzle',
      timeoutSec: 15
    }
  },
  {
    id: 'browser_open',
    type: 'browser_open',
    category: 'Browser & AI',
    title: 'Mở Trang Web',
    badge: 'BROWSER',
    badgeColor: '#3B82F6',
    icon: Globe,
    color: '#3B82F6',
    desc: 'Điều hướng trình duyệt tới đường dẫn mục tiêu',
    defaultData: {
      url: 'https://redbubble.com/signup',
      waitPolicy: 'networkidle'
    }
  },
  {
    id: 'mouse_click',
    type: 'mouse_click',
    category: 'Browser & AI',
    title: 'Click Chuột',
    badge: 'HUMAN CLICK',
    badgeColor: '#F97316',
    icon: MousePointer,
    color: '#F97316',
    desc: 'Mô phỏng click chuột người thật theo tọa độ hoặc selector',
    defaultData: {
      selector: 'button.signup-submit-btn',
      humanSpeed: true
    }
  },
  {
    id: 'human_type',
    type: 'human_type',
    category: 'Browser & AI',
    title: 'Gõ Văn Bản',
    badge: 'HUMAN TYPE',
    badgeColor: '#6366F1',
    icon: Type,
    color: '#6366F1',
    desc: 'Gõ văn bản với độ trễ ngẫu nhiên giữa các phím',
    defaultData: {
      selector: 'input[name="email"]',
      text: 'vkhai2603@gmail.com',
      randomDelay: true
    }
  },
  {
    id: 'condition',
    type: 'condition',
    category: 'Browser & AI',
    title: 'Điều Kiện Rẽ Nhánh',
    badge: 'CONDITION',
    badgeColor: '#10B981',
    icon: Zap,
    color: '#10B981',
    desc: 'Kiểm tra phần tử hoặc biến để chia 2 luồng Đúng/Sai',
    defaultData: {
      condition: 'Có xuất hiện ô Captcha không?',
      selector: '#cf-turnstile-box'
    }
  },
  {
    id: 'js_code',
    type: 'js_code',
    category: 'Browser & AI',
    title: 'Javascript Code',
    badge: 'JS RUNNER',
    badgeColor: '#2563EB',
    icon: Code,
    color: '#2563EB',
    desc: 'Chạy đoạn mã JavaScript tùy biến trực tiếp trong tab',
    defaultData: {
      code: 'console.log("Đang bypass qua token Cloudflare");'
    }
  }
];

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

  // Initial Beautiful Nodes Layout
  const [nodes, setNodes] = useState([
    {
      id: 'node-start',
      type: 'start',
      title: 'Bắt đầu quy trình',
      badge: 'TRIGGER',
      badgeColor: '#10B981',
      color: '#10B981',
      icon: Play,
      x: 60,
      y: 190,
      status: 'idle',
      data: {
        concurrency: 4,
        targetDesc: 'Tất cả 12 hồ sơ trong nhóm Redbubble'
      }
    },
    {
      id: 'node-open',
      type: 'browser_open',
      title: 'Mở Trang Web',
      badge: 'BROWSER',
      badgeColor: '#3B82F6',
      color: '#3B82F6',
      icon: Globe,
      x: 350,
      y: 190,
      status: 'idle',
      data: {
        url: 'https://redbubble.com/signup',
        waitPolicy: 'networkidle'
      }
    },
    {
      id: 'node-captcha',
      type: 'ai_captcha',
      title: 'AI Captcha Solver',
      badge: 'AI SOLVER',
      badgeColor: '#EC4899',
      color: '#EC4899',
      icon: Shield,
      x: 650,
      y: 190,
      status: 'idle',
      data: {
        captchaType: 'Cloudflare Turnstile',
        timeoutSec: 15
      }
    },
    {
      id: 'node-cond',
      type: 'condition',
      title: 'Kiểm Tra Xác Minh',
      badge: 'CONDITION',
      badgeColor: '#10B981',
      color: '#10B981',
      icon: Zap,
      x: 950,
      y: 170,
      status: 'idle',
      data: {
        condition: 'Có xuất hiện ô mã OTP Email?',
        selector: '#otp-input'
      }
    },
    {
      id: 'node-type',
      type: 'human_type',
      title: 'Gõ Phím Người Thật',
      badge: 'HUMAN TYPE',
      badgeColor: '#6366F1',
      color: '#6366F1',
      icon: Type,
      x: 1260,
      y: 100,
      status: 'idle',
      data: {
        selector: 'input[name="password"]',
        text: '••••••••••••'
      }
    },
    {
      id: 'node-js',
      type: 'js_code',
      title: 'Javascript Code',
      badge: 'JS RUNNER',
      badgeColor: '#2563EB',
      color: '#2563EB',
      icon: Code,
      x: 1260,
      y: 310,
      status: 'idle',
      data: {
        code: 'window.fetchMailOtp();'
      }
    },
    {
      id: 'node-end',
      type: 'end',
      title: 'Lưu Cookie & Hoàn Tất',
      badge: 'FINISH',
      badgeColor: '#EF4444',
      color: '#EF4444',
      icon: Square,
      x: 1570,
      y: 200,
      status: 'idle',
      data: {
        closeTab: true,
        syncCookies: true
      }
    }
  ]);

  const [edges, setEdges] = useState([
    { id: 'e1', from: 'node-start', to: 'node-open', fromPort: 'default' },
    { id: 'e2', from: 'node-open', to: 'node-captcha', fromPort: 'default' },
    { id: 'e3', from: 'node-captcha', to: 'node-cond', fromPort: 'default' },
    { id: 'e4', from: 'node-cond', to: 'node-type', fromPort: 'true' },
    { id: 'e5', from: 'node-cond', to: 'node-js', fromPort: 'false' },
    { id: 'e6', from: 'node-type', to: 'node-end', fromPort: 'default' },
    { id: 'e7', from: 'node-js', to: 'node-end', fromPort: 'default' }
  ]);

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

  // ── ACCURATE COORDINATES ──
  const screenToCanvas = useCallback((clientX, clientY) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left - panOffset.x) / zoomLevel,
      y: (clientY - rect.top - panOffset.y) / zoomLevel
    };
  }, [panOffset, zoomLevel]);

  // ── WINDOW GLOBAL MOUSE LISTENERS (Zero Drop, Zero Jump) ──
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

        setNodes(prev => prev.map(n => n.id === draggingNodeState.id ? { ...n, x: newX, y: newY } : n));
        return;
      }

      // 3. Drawing wire
      if (connectingState) {
        const pos = screenToCanvas(e.clientX, e.clientY);
        setConnectingState(prev => prev ? { ...prev, currentX: pos.x, currentY: pos.y } : null);
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

  // ── WHEEL ZOOM ──
  const handleCanvasWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.05 : 0.05;
    setZoomLevel(prev => Math.min(1.8, Math.max(0.4, Number((prev + zoomDelta).toFixed(2)))));
  };

  // ── PANNING START ──
  const handleCanvasMouseDown = (e) => {
    if (e.target === canvasRef.current || e.target.id === 'canvas-svg-layer') {
      setSelectedNodeId(null);
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  // ── NODE DRAG START ──
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

  // ── ROBUST DRAG & DROP USING STRING ID (100% BUG-FREE) ──
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

  // ── PORT WIRE CONNECTORS ──
  const handleStartWire = (e, nodeId, fromPort = 'default') => {
    e.stopPropagation();
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const nodeWidth = 240;
    const startX = node.x + nodeWidth;
    const isCond = node.type === 'condition';
    const startY = isCond
      ? (fromPort === 'false' ? node.y + 115 : node.y + 70)
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
        edge => edge.from === connectingState.fromNodeId && edge.to === targetNodeId && edge.fromPort === connectingState.fromPort
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

  // ── RUN WORKFLOW SIMULATION ──
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
        setNodes(prev => prev.map(n => {
          if (n.id === curId) return { ...n, status: 'running' };
          if (sequence.indexOf(n.id) < idx) return { ...n, status: 'success' };
          return n;
        }));
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

  // Group blocks by category for sidebar
  const categories = ['General', 'Browser & AI'];

  return (
    <div style={{
      flex: 1,
      height: '100%',
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      overflow: 'hidden',
      userSelect: 'none',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>{`
        @keyframes pulseLineAnim {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        .wire-running {
          animation: pulseLineAnim 0.75s linear infinite;
        }
      `}</style>

      {/* ── TOP ACTION & TITLE BAR ── */}
      <div style={{
        height: '44px',
        borderBottom: '1px solid #E5E7EB',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 14px',
        flexShrink: 0,
        zIndex: 20
      }}>
        {/* Left: Back button, Sidebar toggle, Home, Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setActiveTab?.('profiles')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              background: 'transparent',
              fontSize: '13px',
              fontWeight: 500,
              color: '#374151',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft size={15} />
            <span>Quay lại</span>
          </button>

          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            title="Bật/tắt thư viện khối"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              background: isSidebarOpen ? '#F3F4F6' : '#FFFFFF',
              color: '#4B5563',
              cursor: 'pointer'
            }}
          >
            <PanelLeft size={15} />
          </button>

          <button
            onClick={() => setActiveTab?.('workspace')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              border: 'none',
              borderRadius: '6px',
              background: 'transparent',
              color: '#6B7280',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Home size={15} />
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#2563EB',
            padding: '4px 8px',
            borderBottom: '2px solid #2563EB',
            cursor: 'pointer'
          }}>
            <Code size={14} />
            <span>Editor</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
            color: '#6B7280',
            padding: '4px 8px',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#111827'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#6B7280'}
          >
            <FileText size={14} />
            <span>Input</span>
          </div>
        </div>

        {/* Right: Search box & Run button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Tìm khối"
              value={canvasSearchQuery}
              onChange={(e) => setCanvasSearchQuery(e.target.value)}
              style={{
                width: '180px',
                height: '30px',
                paddingLeft: '30px',
                paddingRight: '10px',
                fontSize: '12px',
                borderRadius: '16px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                outline: 'none',
                color: '#1F2937'
              }}
            />
          </div>

          <button
            onClick={handleRunWorkflow}
            disabled={isExecuting}
            style={{
              height: '32px',
              padding: '0 16px',
              borderRadius: '6px',
              backgroundColor: isExecuting ? '#EF4444' : '#10B981',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: isExecuting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            {isExecuting ? (
              <>
                <RotateCw size={13} className="spin" />
                <span>Đang thực thi...</span>
              </>
            ) : (
              <>
                <Play size={13} fill="#FFFFFF" />
                <span>Chạy quy trình</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── WORKSPACE BODY: LEFT BLOCK PALETTE + CANVAS ── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', position: 'relative', overflow: 'hidden' }}>

        {/* 1. LEFT PALETTE: SCRIPT INFO & BLOCK CARDS */}
        {isSidebarOpen && (
          <div style={{
            width: '215px',
            backgroundColor: '#FFFFFF',
            borderRight: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            zIndex: 10
          }}>
            {/* Script Title & Version */}
            <div style={{ padding: '12px 14px 10px 14px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} style={{ color: '#2563EB' }} />
                <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#111827' }}>
                  {workflowTitle}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '6px',
                padding: '4px 8px',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#4B5563',
                cursor: 'pointer'
              }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {workflowVersion}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Copy size={11} color="#9CA3AF" />
                  <ChevronDown size={11} color="#9CA3AF" />
                </div>
              </div>
            </div>

            {/* Icon Category Tabs (Play, Grid, Database, Settings, Code, More) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 12px',
              borderBottom: '1px solid #F1F5F9'
            }}>
              <button
                onClick={() => setActiveCategoryTab('general')}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeCategoryTab === 'general' ? '#2563EB' : 'transparent',
                  color: activeCategoryTab === 'general' ? '#FFFFFF' : '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Play size={13} fill={activeCategoryTab === 'general' ? '#FFFFFF' : 'none'} />
              </button>

              <button
                onClick={() => setActiveCategoryTab('grid')}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeCategoryTab === 'grid' ? '#2563EB' : 'transparent',
                  color: activeCategoryTab === 'grid' ? '#FFFFFF' : '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Grid size={14} />
              </button>

              <button
                onClick={() => setActiveCategoryTab('storage')}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeCategoryTab === 'storage' ? '#2563EB' : 'transparent',
                  color: activeCategoryTab === 'storage' ? '#FFFFFF' : '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Database size={14} />
              </button>

              <button
                onClick={() => setActiveCategoryTab('settings')}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeCategoryTab === 'settings' ? '#2563EB' : 'transparent',
                  color: activeCategoryTab === 'settings' ? '#FFFFFF' : '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Settings size={14} />
              </button>

              <button
                onClick={() => setActiveCategoryTab('code')}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeCategoryTab === 'code' ? '#2563EB' : 'transparent',
                  color: activeCategoryTab === 'code' ? '#FFFFFF' : '#6B7280',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Code size={14} />
              </button>

              <button
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <MoreVertical size={14} />
              </button>
            </div>

            {/* Quick Search */}
            <div style={{ padding: '8px 12px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={12} style={{ position: 'absolute', left: '8px', color: '#9CA3AF' }} />
                <input
                  type="text"
                  placeholder="Tìm kiếm ..."
                  value={blockSearchQuery}
                  onChange={(e) => setBlockSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    height: '28px',
                    paddingLeft: '26px',
                    paddingRight: '8px',
                    fontSize: '11px',
                    borderRadius: '6px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#FFFFFF',
                    outline: 'none',
                    color: '#1F2937'
                  }}
                />
              </div>
            </div>

            {/* Block Category Accordions */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {categories.map(catName => {
                const isOpen = openAccordions[catName] ?? true;
                const blocks = BLOCK_CATALOG.filter(b => b.category === catName).filter(b => {
                  if (!blockSearchQuery.trim()) return true;
                  return b.title.toLowerCase().includes(blockSearchQuery.toLowerCase()) ||
                         b.desc.toLowerCase().includes(blockSearchQuery.toLowerCase());
                });

                if (blocks.length === 0) return null;

                return (
                  <div key={catName} style={{ marginBottom: '2px' }}>
                    <div
                      onClick={() => setOpenAccordions(prev => ({ ...prev, [catName]: !isOpen }))}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        backgroundColor: '#F9FAFB',
                        borderTop: '1px solid #F1F5F9',
                        borderBottom: '1px solid #F1F5F9'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: catName === 'General' ? '#10B981' : '#3B82F6' }} />
                        <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#374151' }}>{catName}</span>
                      </div>
                      <ChevronDown
                        size={13}
                        color="#6B7280"
                        style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s ease' }}
                      />
                    </div>

                    {isOpen && (
                      <div style={{
                        padding: '8px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '7px'
                      }}>
                        {blocks.map(block => {
                          const IconComp = block.icon;
                          return (
                            <div
                              key={block.id}
                              draggable={true}
                              onDragStart={(e) => handlePaletteDragStart(e, block)}
                              onClick={() => handleAddBlockClick(block)}
                              title={`${block.title}: ${block.desc}`}
                              style={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                padding: '10px 4px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                cursor: 'grab',
                                transition: 'all 0.15s ease',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#2563EB';
                                e.currentTarget.style.boxShadow = '0 2px 6px rgba(37, 99, 235, 0.12)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#E5E7EB';
                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              <div style={{ color: block.color }}>
                                <IconComp size={18} />
                              </div>
                              <span style={{
                                fontSize: '11px',
                                fontWeight: 500,
                                color: '#374151',
                                textAlign: 'center',
                                lineHeight: 1.2,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '82px'
                              }}>
                                {block.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. MAIN CANVAS WITH DOT GRID & BEAUTIFUL NODES */}
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onWheel={handleCanvasWheel}
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
          style={{
            flex: 1,
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#FAFAFA',
            backgroundImage: 'radial-gradient(#D1D5DB 1.3px, transparent 1.3px)',
            backgroundSize: `${24 * zoomLevel}px ${24 * zoomLevel}px`,
            backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
            cursor: isPanning ? 'grabbing' : 'default'
          }}
        >
          {/* SVG Connecting Bezier Wires */}
          <svg
            id="canvas-svg-layer"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            {/* Existing Edges */}
            {edges.map(edge => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const nodeWidth = 240;
              const isCond = fromNode.type === 'condition';

              const startX = (fromNode.x + nodeWidth) * zoomLevel + panOffset.x;
              const startY = isCond
                ? (edge.fromPort === 'false' ? fromNode.y + 115 : fromNode.y + 70) * zoomLevel + panOffset.y
                : (fromNode.y + 55) * zoomLevel + panOffset.y;

              const endX = toNode.x * zoomLevel + panOffset.x;
              const endY = (toNode.y + 55) * zoomLevel + panOffset.y;

              const deltaX = Math.max(45, (endX - startX) * 0.5);
              const pathD = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;

              const isEdgeActive = isExecuting && (activeStepId === fromNode.id || activeStepId === toNode.id);

              return (
                <g key={edge.id} style={{ pointerEvents: 'auto' }}>
                  {/* Transparent hover path */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="14"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDeleteEdge(edge.id)}
                  />
                  {/* Visible wire */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isEdgeActive ? '#10B981' : edge.fromPort === 'false' ? '#EF4444' : '#64748B'}
                    strokeWidth={isEdgeActive ? 2.8 : 1.8}
                    strokeDasharray={isEdgeActive ? '5, 5' : 'none'}
                    className={isEdgeActive ? 'wire-running' : ''}
                  />
                  {/* Flow dot at midpoint */}
                  <circle
                    cx={(startX + endX) / 2}
                    cy={(startY + endY) / 2}
                    r={3}
                    fill={isEdgeActive ? '#10B981' : '#64748B'}
                  />
                </g>
              );
            })}

            {/* Connecting wire while dragging */}
            {connectingState && (
              (() => {
                const startX = connectingState.startX * zoomLevel + panOffset.x;
                const startY = connectingState.startY * zoomLevel + panOffset.y;
                const endX = connectingState.currentX * zoomLevel + panOffset.x;
                const endY = connectingState.currentY * zoomLevel + panOffset.y;
                const deltaX = Math.max(35, Math.abs(endX - startX) * 0.5);
                const pathD = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;

                return (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="2.2"
                    strokeDasharray="4, 4"
                  />
                );
              })()
            )}
          </svg>

          {/* ── BEAUTIFUL ORIGINAL NODE CARDS ── */}
          {nodes.map(node => {
            const IconComp = node.icon || Zap;
            const isSelected = selectedNodeId === node.id;
            const isRunning = node.status === 'running';
            const isDone = node.status === 'success';

            const cardWidth = 240;
            const isCondition = node.type === 'condition';

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleNodeMouseDown(e, node)}
                onDoubleClick={() => setEditingNode(node)}
                style={{
                  position: 'absolute',
                  left: `${node.x * zoomLevel + panOffset.x}px`,
                  top: `${node.y * zoomLevel + panOffset.y}px`,
                  width: `${cardWidth * zoomLevel}px`,
                  backgroundColor: '#FFFFFF',
                  borderRadius: `${12 * zoomLevel}px`,
                  border: isSelected
                    ? '2px solid #2563EB'
                    : isRunning
                    ? '2px solid #F59E0B'
                    : isDone
                    ? '1.5px solid #10B981'
                    : '1.5px solid #E2E8F0',
                  boxShadow: isSelected
                    ? '0 10px 25px -4px rgba(37, 99, 235, 0.25)'
                    : isRunning
                    ? '0 0 20px rgba(245, 158, 11, 0.35)'
                    : '0 4px 14px rgba(0, 0, 0, 0.05)',
                  padding: `${12 * zoomLevel}px ${14 * zoomLevel}px`,
                  cursor: isLocked ? 'default' : 'grab',
                  zIndex: isSelected ? 10 : 5,
                  overflow: 'visible',
                  transition: 'box-shadow 0.15s ease, border-color 0.15s ease'
                }}
              >
                {/* Left Input Port */}
                <div
                  title="Cổng nhận (Input)"
                  onMouseUp={(e) => handleEndWire(e, node.id)}
                  style={{
                    position: 'absolute',
                    left: `${-7 * zoomLevel}px`,
                    top: `${55 * zoomLevel}px`,
                    transform: 'translateY(-50%)',
                    width: `${13 * zoomLevel}px`,
                    height: `${13 * zoomLevel}px`,
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    border: '2px solid #64748B',
                    boxShadow: '0 0 4px rgba(0,0,0,0.15)',
                    cursor: 'crosshair',
                    zIndex: 20
                  }}
                />

                {/* 1. Header: Icon box + Title + Badge + Delete button */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: `${8 * zoomLevel}px`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: `${8 * zoomLevel}px` }}>
                    <div style={{
                      width: `${30 * zoomLevel}px`,
                      height: `${30 * zoomLevel}px`,
                      borderRadius: `${8 * zoomLevel}px`,
                      backgroundColor: `${node.color}15`,
                      color: node.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <IconComp size={16 * zoomLevel} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{
                        fontSize: `${12.5 * zoomLevel}px`,
                        fontWeight: 700,
                        color: '#0F172A',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: `${120 * zoomLevel}px`
                      }}>
                        {node.title}
                      </span>
                      <span style={{ fontSize: `${10 * zoomLevel}px`, color: '#64748B' }}>
                        {node.type}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: `${4 * zoomLevel}px` }}>
                    {/* Badge */}
                    <span style={{
                      fontSize: `${9 * zoomLevel}px`,
                      fontWeight: 700,
                      padding: `${2 * zoomLevel}px ${6 * zoomLevel}px`,
                      borderRadius: '10px',
                      backgroundColor: `${node.badgeColor || node.color}15`,
                      color: node.badgeColor || node.color
                    }}>
                      {node.badge || 'NODE'}
                    </span>

                    {/* Delete button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node.id);
                      }}
                      title="Xóa khối"
                      style={{
                        width: `${18 * zoomLevel}px`,
                        height: `${18 * zoomLevel}px`,
                        borderRadius: '4px',
                        border: 'none',
                        background: 'transparent',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#94A3B8'}
                    >
                      <X size={12 * zoomLevel} />
                    </button>
                  </div>
                </div>

                {/* 2. Body Panel (Parameters & Config Preview) */}
                <div style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: `${8 * zoomLevel}px`,
                  padding: `${7 * zoomLevel}px ${9 * zoomLevel}px`,
                  border: '1px solid #F1F5F9',
                  marginBottom: `${8 * zoomLevel}px`
                }}>
                  {node.data?.url && (
                    <div style={{ fontSize: `${10.5 * zoomLevel}px`, color: '#475569', display: 'flex', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ color: '#94A3B8' }}>URL:</span>
                      <strong style={{ color: '#2563EB', textDecoration: 'underline' }}>{node.data.url}</strong>
                    </div>
                  )}

                  {node.data?.selector && (
                    <div style={{ fontSize: `${10.5 * zoomLevel}px`, color: '#475569', display: 'flex', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ color: '#94A3B8' }}>Selector:</span>
                      <code>{node.data.selector}</code>
                    </div>
                  )}

                  {node.data?.goal && (
                    <div style={{ fontSize: `${10.5 * zoomLevel}px`, color: '#475569', fontStyle: 'italic', lineHeight: 1.3 }}>
                      "{node.data.goal}"
                    </div>
                  )}

                  {node.data?.condition && (
                    <div style={{ fontSize: `${10.5 * zoomLevel}px`, color: '#059669', fontWeight: 600 }}>
                      {node.data.condition}
                    </div>
                  )}

                  {node.data?.code && (
                    <div style={{ fontSize: `${10 * zoomLevel}px`, fontFamily: 'monospace', color: '#1E293B', backgroundColor: '#FFFFFF', padding: '2px 4px', borderRadius: '4px' }}>
                      {node.data.code}
                    </div>
                  )}

                  {node.data?.targetDesc && (
                    <div style={{ fontSize: `${10.5 * zoomLevel}px`, color: '#475569' }}>
                      {node.data.targetDesc}
                    </div>
                  )}

                  {node.data?.seconds && (
                    <div style={{ fontSize: `${10.5 * zoomLevel}px`, color: '#475569' }}>
                      Chờ ngẫu nhiên: <strong>{node.data.seconds}s</strong>
                    </div>
                  )}
                </div>

                {/* 3. Bottom Row: Status & Ports */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: `${2 * zoomLevel}px`
                }}>
                  {isRunning ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: `${10 * zoomLevel}px`, color: '#D97706', fontWeight: 600 }}>
                      <RotateCw size={11 * zoomLevel} className="spin" /> Đang thực thi...
                    </span>
                  ) : isDone ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: `${10 * zoomLevel}px`, color: '#10B981', fontWeight: 600 }}>
                      <Check size={11 * zoomLevel} /> Hoàn tất
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: `${10 * zoomLevel}px`, color: '#64748B' }}>
                      <span style={{ width: `${6 * zoomLevel}px`, height: `${6 * zoomLevel}px`, borderRadius: '50%', backgroundColor: '#94A3B8' }} /> Sẵn sàng
                    </span>
                  )}

                  {isCondition && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                      <span style={{ fontSize: `${9 * zoomLevel}px`, fontWeight: 600, color: '#10B981' }}>● Đúng</span>
                      <span style={{ fontSize: `${9 * zoomLevel}px`, fontWeight: 600, color: '#EF4444' }}>● Sai</span>
                    </div>
                  )}
                </div>

                {/* Right Output Port(s) */}
                {isCondition ? (
                  <>
                    {/* True Port */}
                    <div
                      title="Kéo dây nhánh Đúng (True)"
                      onMouseDown={(e) => handleStartWire(e, node.id, 'true')}
                      style={{
                        position: 'absolute',
                        right: `${-7 * zoomLevel}px`,
                        top: `${70 * zoomLevel}px`,
                        width: `${13 * zoomLevel}px`,
                        height: `${13 * zoomLevel}px`,
                        borderRadius: '50%',
                        backgroundColor: '#10B981',
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 0 4px rgba(0,0,0,0.15)',
                        cursor: 'crosshair',
                        zIndex: 20
                      }}
                    />
                    {/* False Port */}
                    <div
                      title="Kéo dây nhánh Sai (False)"
                      onMouseDown={(e) => handleStartWire(e, node.id, 'false')}
                      style={{
                        position: 'absolute',
                        right: `${-7 * zoomLevel}px`,
                        top: `${115 * zoomLevel}px`,
                        width: `${13 * zoomLevel}px`,
                        height: `${13 * zoomLevel}px`,
                        borderRadius: '50%',
                        backgroundColor: '#EF4444',
                        border: '2px solid #FFFFFF',
                        boxShadow: '0 0 4px rgba(0,0,0,0.15)',
                        cursor: 'crosshair',
                        zIndex: 20
                      }}
                    />
                  </>
                ) : (
                  <div
                    title="Kéo dây kết nối (Output)"
                    onMouseDown={(e) => handleStartWire(e, node.id, 'default')}
                    style={{
                      position: 'absolute',
                      right: `${-7 * zoomLevel}px`,
                      top: `${55 * zoomLevel}px`,
                      transform: 'translateY(-50%)',
                      width: `${13 * zoomLevel}px`,
                      height: `${13 * zoomLevel}px`,
                      borderRadius: '50%',
                      backgroundColor: node.color || '#2563EB',
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 0 4px rgba(0,0,0,0.15)',
                      cursor: 'crosshair',
                      zIndex: 20
                    }}
                  />
                )}
              </div>
            );
          })}

          {/* ── FLOATING ZOOM & CANVAS TOOLBAR ── */}
          <div style={{
            position: 'absolute',
            left: '16px',
            bottom: '24px',
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 15
          }}>
            <button
              onClick={() => setZoomLevel(z => Math.min(1.8, z + 0.1))}
              title="Phóng to"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'transparent',
                color: '#374151',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Plus size={15} />
            </button>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            <button
              onClick={() => setZoomLevel(z => Math.max(0.4, z - 0.1))}
              title="Thu nhỏ"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'transparent',
                color: '#374151',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Minus size={15} />
            </button>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            <button
              onClick={() => {
                setZoomLevel(0.85);
                setPanOffset({ x: 50, y: 35 });
              }}
              title="Căn vừa màn hình"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'transparent',
                color: '#374151',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Maximize2 size={13} />
            </button>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            <button
              onClick={() => setIsLocked(l => !l)}
              title={isLocked ? 'Mở khóa bảng vẽ' : 'Khóa bảng vẽ'}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                backgroundColor: isLocked ? '#FEE2E2' : 'transparent',
                color: isLocked ? '#EF4444' : '#374151',
                cursor: 'pointer'
              }}
            >
              {isLocked ? <Lock size={13} /> : <Unlock size={13} />}
            </button>

            <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

            <button
              title="Lưu yêu thích"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                background: 'transparent',
                color: '#F59E0B',
                cursor: 'pointer'
              }}
            >
              <Star size={13} fill="#F59E0B" />
            </button>
          </div>

          {/* ── MINIMAP PREVIEW (Bottom Right) ── */}
          <div style={{
            position: 'absolute',
            right: '16px',
            bottom: '16px',
            width: '160px',
            height: '95px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(4px)',
            border: '1px solid #E5E7EB',
            borderRadius: '8px',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 15
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '9.5px', fontWeight: 600, color: '#64748B' }}>
                Bản đồ ({nodes.length} khối)
              </span>
              <span style={{ fontSize: '9px', color: '#94A3B8' }}>{Math.round(zoomLevel * 100)}%</span>
            </div>

            <div style={{
              flex: 1,
              backgroundColor: '#F8FAFC',
              borderRadius: '4px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {nodes.map(n => (
                <div
                  key={`mini-${n.id}`}
                  style={{
                    position: 'absolute',
                    left: `${(n.x / 1800) * 100}%`,
                    top: `${(n.y / 650) * 100}%`,
                    width: '12px',
                    height: '6px',
                    borderRadius: '2px',
                    backgroundColor: n.status === 'running' ? '#F59E0B' : n.status === 'success' ? '#10B981' : n.color || '#3B82F6'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3. NODE INSPECTOR DRAWER (Right) */}
        {editingNode && (
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '320px',
            height: '100%',
            backgroundColor: '#FFFFFF',
            borderLeft: '1px solid #E5E7EB',
            boxShadow: '-4px 0 16px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 30
          }}>
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={16} color="#2563EB" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>
                  Cấu hình: {editingNode.title}
                </span>
              </div>
              <button
                onClick={() => setEditingNode(null)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Tên khối
                </label>
                <input
                  type="text"
                  value={editingNode.title}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNodes(prev => prev.map(n => n.id === editingNode.id ? { ...n, title: val } : n));
                    setEditingNode(prev => ({ ...prev, title: val }));
                  }}
                  style={{
                    width: '100%',
                    height: '32px',
                    padding: '0 10px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    outline: 'none'
                  }}
                />
              </div>

              {editingNode.type === 'browser_open' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                    Đường dẫn URL
                  </label>
                  <input
                    type="text"
                    value={editingNode.data?.url || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNodes(prev => prev.map(n => n.id === editingNode.id ? { ...n, data: { ...n.data, url: val } } : n));
                      setEditingNode(prev => ({ ...prev, data: { ...prev.data, url: val } }));
                    }}
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 10px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              {editingNode.type === 'mouse_click' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                    CSS Selector nút click
                  </label>
                  <input
                    type="text"
                    value={editingNode.data?.selector || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNodes(prev => prev.map(n => n.id === editingNode.id ? { ...n, data: { ...n.data, selector: val } } : n));
                      setEditingNode(prev => ({ ...prev, data: { ...prev.data, selector: val } }));
                    }}
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 10px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              {editingNode.type === 'human_type' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                    Văn bản cần gõ
                  </label>
                  <input
                    type="text"
                    value={editingNode.data?.text || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNodes(prev => prev.map(n => n.id === editingNode.id ? { ...n, data: { ...n.data, text: val } } : n));
                      setEditingNode(prev => ({ ...prev, data: { ...prev.data, text: val } }));
                    }}
                    style={{
                      width: '100%',
                      height: '32px',
                      padding: '0 10px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              {editingNode.type === 'ai_navigator' && (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '4px' }}>
                    Mục tiêu AI Vision
                  </label>
                  <textarea
                    rows={3}
                    value={editingNode.data?.goal || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNodes(prev => prev.map(n => n.id === editingNode.id ? { ...n, data: { ...n.data, goal: val } } : n));
                      setEditingNode(prev => ({ ...prev, data: { ...prev.data, goal: val } }));
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      border: '1px solid #D1D5DB',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>
              )}

              <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', paddingTop: '16px' }}>
                <button
                  onClick={() => handleDeleteNode(editingNode.id)}
                  style={{
                    flex: 1,
                    height: '34px',
                    borderRadius: '6px',
                    border: '1px solid #FCA5A5',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={14} />
                  <span>Xóa</span>
                </button>

                <button
                  onClick={() => setEditingNode(null)}
                  style={{
                    flex: 1,
                    height: '34px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Lưu & Đóng
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
