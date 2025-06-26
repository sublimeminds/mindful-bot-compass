
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Paintbrush, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  Users, 
  Share2,
  Download,
  Trash2,
  Undo,
  Redo,
  Palette
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DrawingData {
  id: string;
  type: 'draw' | 'text' | 'shape';
  x: number;
  y: number;
  data: any;
  timestamp: number;
  userId: string;
}

interface Participant {
  id: string;
  name: string;
  color: string;
  cursor: { x: number; y: number };
  isDrawing: boolean;
}

const CollaborativeWhiteboard = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'text' | 'rectangle' | 'circle'>('pen');
  const [color, setColor] = useState('#3B82F6');
  const [brushSize, setBrushSize] = useState(3);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'You', color: '#3B82F6', cursor: { x: 0, y: 0 }, isDrawing: false },
    { id: '2', name: 'Dr. Smith', color: '#10B981', cursor: { x: 100, y: 100 }, isDrawing: false },
    { id: '3', name: 'Sarah', color: '#F59E0B', cursor: { x: 200, y: 150 }, isDrawing: false }
  ]);
  const [history, setHistory] = useState<DrawingData[]>([]);
  const [historyStep, setHistoryStep] = useState(0);

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ];

  const tools = [
    { id: 'pen', icon: Paintbrush, label: 'Pen' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' }
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = color;
  }, [brushSize, color]);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    toast({
      title: "Canvas Cleared",
      description: "The whiteboard has been cleared for all participants.",
    });
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "Canvas Saved",
      description: "The whiteboard has been saved as an image.",
    });
  };

  const shareSession = () => {
    navigator.clipboard.writeText(window.location.href + '?session=abc123');
    toast({
      title: "Session Link Copied",
      description: "Share this link to invite others to collaborate.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Users className="h-7 w-7 mr-2 text-therapy-600" />
            Collaborative Whiteboard
          </h2>
          <p className="text-muted-foreground">Real-time collaborative drawing and brainstorming</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={shareSession} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share Session
          </Button>
          <Button onClick={saveCanvas} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Participants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Active Participants ({participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <Badge
                key={participant.id}
                variant="outline"
                className="flex items-center space-x-2"
                style={{ borderColor: participant.color }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: participant.color }}
                />
                <span>{participant.name}</span>
                {participant.isDrawing && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Tools */}
            <div className="flex items-center space-x-2">
              {tools.map((t) => {
                const IconComponent = t.icon;
                return (
                  <Button
                    key={t.id}
                    variant={tool === t.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTool(t.id as any)}
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>

            {/* Colors */}
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              {colors.map((c) => (
                <button
                  key={c}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color === c ? 'border-gray-800' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>

            {/* Brush Size */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Size:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm font-medium">{brushSize}px</span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-auto">
              <Button variant="outline" size="sm">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas */}
      <Card>
        <CardContent className="p-0">
          <canvas
            ref={canvasRef}
            className="w-full h-96 cursor-crosshair border-b"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </CardContent>
      </Card>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Dr. Smith added a rectangle at 2:34 PM
            </div>
            <div className="flex items-center text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              You added text "Goals for next week" at 2:33 PM
            </div>
            <div className="flex items-center text-muted-foreground">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
              Sarah joined the session at 2:30 PM
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborativeWhiteboard;
