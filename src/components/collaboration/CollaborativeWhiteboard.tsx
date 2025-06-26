
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Pen, 
  Square, 
  Circle, 
  Type, 
  Eraser, 
  Undo, 
  Redo,
  Download,
  Share2,
  Palette,
  Users,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DrawingTool {
  type: 'pen' | 'rectangle' | 'circle' | 'text' | 'eraser';
  color: string;
  size: number;
}

interface CollaborativeUser {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  cursor?: { x: number; y: number };
}

const CollaborativeWhiteboard = () => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentTool, setCurrentTool] = useState<DrawingTool>({
    type: 'pen',
    color: '#3B82F6',
    size: 2
  });
  
  const [collaborators, setCollaborators] = useState<CollaborativeUser[]>([
    {
      id: 'user-1',
      name: 'You',
      color: '#3B82F6',
      isActive: true
    },
    {
      id: 'therapist-1',
      name: 'Dr. Sarah Chen',
      color: '#10B981',
      isActive: true,
      cursor: { x: 150, y: 200 }
    }
  ]);

  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16'
  ];

  const toolIcons = {
    pen: Pen,
    rectangle: Square,
    circle: Circle,
    text: Type,
    eraser: Eraser
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        // Initialize with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add some sample collaborative content
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(150, 200, 50, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add text annotation
        ctx.fillStyle = '#10B981';
        ctx.font = '14px sans-serif';
        ctx.fillText('Dr. Chen: Comfort zone', 120, 280);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = currentTool.color;
      ctx.lineWidth = currentTool.size;
      ctx.lineCap = 'round';
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
    if (ctx) {
      if (currentTool.type === 'pen') {
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (currentTool.type === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.arc(x, y, currentTool.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
    toast({
      title: "Canvas Cleared",
      description: "The whiteboard has been cleared for all participants.",
    });
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'therapy-session-whiteboard.png';
      link.href = canvas.toDataURL();
      link.click();
    }
    toast({
      title: "Whiteboard Saved",
      description: "The whiteboard has been saved as an image.",
    });
  };

  const shareCanvas = () => {
    toast({
      title: "Whiteboard Shared",
      description: "A link to this whiteboard has been shared with session participants.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-therapy-600" />
              <span>Collaborative Whiteboard</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{collaborators.length} active</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            {/* Drawing Tools */}
            <div className="flex items-center space-x-2">
              {Object.entries(toolIcons).map(([tool, Icon]) => (
                <Button
                  key={tool}
                  variant={currentTool.type === tool ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentTool(prev => ({ ...prev, type: tool as any }))}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            {/* Colors */}
            <div className="flex items-center space-x-1">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentTool(prev => ({ ...prev, color }))}
                  className={`w-6 h-6 rounded-full border-2 ${
                    currentTool.color === color ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Undo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={saveCanvas}>
                <Save className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={shareCanvas}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={clearCanvas}>
                <Eraser className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Canvas Area */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="w-full h-96 border border-gray-200 rounded-lg cursor-crosshair bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            
            {/* Collaborative Cursors */}
            {collaborators
              .filter(user => user.cursor && user.id !== 'user-1')
              .map((user) => (
                <div
                  key={user.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: user.cursor!.x,
                    top: user.cursor!.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div 
                    className="w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: user.color }}
                  />
                  <div 
                    className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                  >
                    {user.name}
                  </div>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>

      {/* Collaborators List */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Active Collaborators</h4>
            <div className="flex items-center space-x-3">
              {collaborators.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="text-sm">{user.name}</span>
                  {user.isActive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollaborativeWhiteboard;
