
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/contexts/SessionContext";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

interface SessionEndModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SessionEndModal = ({ isOpen, onClose }: SessionEndModalProps) => {
  const [moodAfter, setMoodAfter] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { endSession } = useSession();
  const { toast } = useToast();

  const handleEndSession = async () => {
    setIsSubmitting(true);
    try {
      await endSession(moodAfter, notes);
      toast({
        title: "Session Completed",
        description: "Your therapy session has been saved successfully.",
      });
      onClose();
      setMoodAfter(5);
      setNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Your Session</DialogTitle>
          <DialogDescription>
            How are you feeling now? Rate your mood and add any notes about this session.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="mood">Current Mood (1-10)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="mood"
                type="number"
                min="1"
                max="10"
                value={moodAfter}
                onChange={(e) => setMoodAfter(Number(e.target.value))}
                className="w-20"
              />
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-4 w-4 cursor-pointer ${
                      rating <= moodAfter
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onClick={() => setMoodAfter(rating)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Session Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did this session help you? Any key insights or techniques that worked well?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleEndSession} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Complete Session'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionEndModal;
