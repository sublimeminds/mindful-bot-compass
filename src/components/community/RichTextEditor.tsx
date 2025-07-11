import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  Quote, 
  Type 
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  rows = 6
}) => {
  const insertText = (before: string, after: string = '') => {
    const textarea = document.getElementById('rich-text-area') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length, 
        start + before.length + selectedText.length
      );
    }, 0);
  };

  const formatActions = [
    { 
      icon: Bold, 
      label: 'Bold', 
      action: () => insertText('**', '**'),
      shortcut: 'Ctrl+B' 
    },
    { 
      icon: Italic, 
      label: 'Italic', 
      action: () => insertText('*', '*'),
      shortcut: 'Ctrl+I' 
    },
    { 
      icon: Quote, 
      label: 'Quote', 
      action: () => insertText('> '),
      shortcut: 'Ctrl+Shift+.' 
    },
    { 
      icon: List, 
      label: 'List', 
      action: () => insertText('- '),
      shortcut: 'Ctrl+Shift+8' 
    },
    { 
      icon: Link, 
      label: 'Link', 
      action: () => insertText('[', '](url)'),
      shortcut: 'Ctrl+K' 
    }
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          insertText('**', '**');
          break;
        case 'i':
          e.preventDefault();
          insertText('*', '*');
          break;
        case 'k':
          e.preventDefault();
          insertText('[', '](url)');
          break;
      }
    }
  };

  return (
    <div className="space-y-2">
      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1 p-2 border rounded-md bg-gray-50">
        {formatActions.map((action, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            onClick={action.action}
            className="h-8 w-8 p-0"
            title={`${action.label} (${action.shortcut})`}
          >
            <action.icon className="h-4 w-4" />
          </Button>
        ))}
        <div className="h-6 w-px bg-gray-300 mx-2" />
        <span className="text-xs text-gray-500">
          <Type className="h-3 w-3 inline mr-1" />
          Markdown supported
        </span>
      </div>
      
      {/* Text Area */}
      <Textarea
        id="rich-text-area"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className="font-mono text-sm"
      />
      
      {/* Preview Mode Toggle */}
      <div className="text-xs text-gray-500">
        Tip: Use **bold**, *italic*, {'>'} quotes, - lists, and [links](url) for formatting
      </div>
    </div>
  );
};

export default RichTextEditor;