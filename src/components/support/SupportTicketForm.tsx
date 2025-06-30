
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface TicketFormData {
  subject: string;
  category: string;
  priority: string;
  description: string;
  email: string;
  attachments: File[];
}

const SupportTicketForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TicketFormData>({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    email: user?.email || '',
    attachments: []
  });

  const categories = [
    { value: 'technical', label: 'Technical Issue', description: 'App bugs, errors, performance issues' },
    { value: 'billing', label: 'Billing & Account', description: 'Subscription, payment, account questions' },
    { value: 'therapy', label: 'Therapy Features', description: 'AI therapist, sessions, features' },
    { value: 'privacy', label: 'Privacy & Security', description: 'Data protection, privacy concerns' },
    { value: 'feature', label: 'Feature Request', description: 'Suggest new features or improvements' },
    { value: 'other', label: 'Other', description: 'General questions or feedback' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800', description: 'General questions, minor issues' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Standard support requests' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', description: 'Blocking issues, urgent needs' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800', description: 'Service down, critical problems' }
  ];

  const handleInputChange = (field: keyof TicketFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.subject.trim()) {
      toast({ title: "Please enter a subject", variant: "destructive" });
      return false;
    }
    if (!formData.category) {
      toast({ title: "Please select a category", variant: "destructive" });
      return false;
    }
    if (!formData.description.trim()) {
      toast({ title: "Please describe your issue", variant: "destructive" });
      return false;
    }
    if (!formData.email.trim()) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate ticket number
      const ticketNumber = `TS-${Date.now().toString().slice(-6)}`;
      
      toast({
        title: "Support ticket created successfully!",
        description: `Your ticket number is ${ticketNumber}. We'll respond within 24 hours.`,
      });

      // Reset form
      setFormData({
        subject: '',
        category: '',
        priority: 'medium',
        description: '',
        email: user?.email || '',
        attachments: []
      });

    } catch (error) {
      toast({
        title: "Failed to create ticket",
        description: "Please try again or contact support directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories.find(c => c.value === formData.category);
  const selectedPriority = priorities.find(p => p.value === formData.priority);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Your Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="your.email@example.com"
          required
        />
      </div>

      {/* Subject Field */}
      <div className="space-y-2">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          value={formData.subject}
          onChange={(e) => handleInputChange('subject', e.target.value)}
          placeholder="Brief description of your issue"
          required
        />
      </div>

      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select issue category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div>
                  <div className="font-medium">{category.label}</div>
                  <div className="text-xs text-slate-500">{category.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCategory && (
          <p className="text-sm text-slate-600">{selectedCategory.description}</p>
        )}
      </div>

      {/* Priority Selection */}
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                <div className="flex items-center space-x-2">
                  <Badge className={priority.color}>
                    {priority.label}
                  </Badge>
                  <span className="text-sm">{priority.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedPriority && (
          <div className="flex items-center space-x-2">
            <Badge className={selectedPriority.color}>
              {selectedPriority.label}
            </Badge>
            <span className="text-sm text-slate-600">{selectedPriority.description}</span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Please describe your issue in detail. Include steps to reproduce if it's a technical problem."
          rows={6}
          required
        />
      </div>

      {/* File Attachments */}
      <div className="space-y-2">
        <Label htmlFor="attachments">Attachments (Optional)</Label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
          <input
            type="file"
            id="attachments"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            accept=".jpg,.jpeg,.png,.gif,.pdf,.txt,.doc,.docx"
          />
          <label htmlFor="attachments" className="cursor-pointer">
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600">
              Click to upload screenshots or files
            </p>
            <p className="text-xs text-slate-500">
              Supported: JPG, PNG, PDF, DOC (Max 10MB each)
            </p>
          </label>
        </div>
        
        {/* Attachment List */}
        {formData.attachments.length > 0 && (
          <div className="space-y-2">
            {formData.attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                <span className="text-sm text-slate-700">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Priority Notice */}
      {formData.priority === 'urgent' && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Urgent Priority Selected</p>
                <p className="text-sm">
                  For mental health emergencies, please call 988 (Suicide & Crisis Lifeline) or 911 immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setFormData({
            subject: '',
            category: '',
            priority: 'medium',
            description: '',
            email: user?.email || '',
            attachments: []
          })}
        >
          Clear Form
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="therapy-gradient-bg text-white border-0"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating Ticket...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Support Ticket
            </>
          )}
        </Button>
      </div>

      {/* Response Time Info */}
      <Card className="bg-therapy-50 border-therapy-200">
        <CardContent className="pt-4">
          <div className="text-sm text-therapy-700">
            <p className="font-medium mb-1">Response Times:</p>
            <ul className="text-xs space-y-1">
              <li>• Low/Medium Priority: Within 24 hours</li>
              <li>• High Priority: Within 4 hours</li>
              <li>• Urgent: Within 1 hour</li>
              <li>• Crisis Support: Immediate (24/7)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default SupportTicketForm;
