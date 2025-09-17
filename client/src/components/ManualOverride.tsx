
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Save, X, AlertTriangle, User } from 'lucide-react';

interface ManualOverrideProps {
  analysisId: string;
  currentScore?: number;
  onOverrideSubmit?: (override: ManualOverride) => void;
}

interface ManualOverride {
  officialName: string;
  officialId: string;
  overrideReason: string;
  newScore?: number;
  additionalNotes: string;
  timestamp: Date;
  action: 'approve' | 'reject' | 'modify' | 'request_revision';
}

export function ManualOverride({ analysisId, currentScore, onOverrideSubmit }: ManualOverrideProps) {
  const [isOverriding, setIsOverriding] = useState(false);
  const [overrideData, setOverrideData] = useState({
    officialName: 'Dr. Rajesh Kumar (Senior Project Officer)',
    officialId: 'MDN001234',
    overrideReason: '',
    newScore: currentScore || 0,
    additionalNotes: '',
    action: 'modify' as const
  });
  const { toast } = useToast();

  const handleSubmitOverride = () => {
    if (!overrideData.overrideReason.trim()) {
      toast({
        title: 'Reason Required',
        description: 'Please provide a reason for the manual override',
        variant: 'destructive'
      });
      return;
    }

    const override: ManualOverride = {
      ...overrideData,
      timestamp: new Date()
    };

    onOverrideSubmit?.(override);
    
    toast({
      title: 'Override Submitted',
      description: 'Manual assessment override has been recorded',
    });

    setIsOverriding(false);
    setOverrideData(prev => ({ ...prev, overrideReason: '', additionalNotes: '' }));
  };

  if (!isOverriding) {
    return (
      <Card className="p-6 border-2 border-orange-200 bg-orange-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <User className="text-orange-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Official Override Available</h3>
              <p className="text-sm text-muted-foreground">
                Authorized officials can override AI assessment with manual review
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsOverriding(true)}
            variant="outline"
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            <Edit3 className="mr-2" size={16} />
            Manual Override
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-2 border-orange-300 bg-orange-50">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center">
            <AlertTriangle className="mr-2 text-orange-600" size={20} />
            Manual Assessment Override
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOverriding(false)}
          >
            <X size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Official Details</label>
            <div className="p-3 bg-white rounded-lg border">
              <p className="font-medium">{overrideData.officialName}</p>
              <p className="text-sm text-muted-foreground">ID: {overrideData.officialId}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Override Action</label>
            <select
              value={overrideData.action}
              onChange={(e) => setOverrideData(prev => ({ 
                ...prev, 
                action: e.target.value as any 
              }))}
              className="w-full p-3 border rounded-lg bg-white"
            >
              <option value="approve">Approve Despite AI Concerns</option>
              <option value="reject">Reject Despite AI Approval</option>
              <option value="modify">Modify AI Score</option>
              <option value="request_revision">Request Project Revision</option>
            </select>
          </div>
        </div>

        {overrideData.action === 'modify' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              New Overall Score (Current: {currentScore}%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={overrideData.newScore}
              onChange={(e) => setOverrideData(prev => ({ 
                ...prev, 
                newScore: parseInt(e.target.value) || 0 
              }))}
              className="w-full p-3 border rounded-lg"
            />
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Override Reason <span className="text-red-500">*</span>
          </label>
          <Textarea
            value={overrideData.overrideReason}
            onChange={(e) => setOverrideData(prev => ({ 
              ...prev, 
              overrideReason: e.target.value 
            }))}
            placeholder="Provide detailed justification for manual override (regulatory requirements, local context, etc.)"
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Additional Notes</label>
          <Textarea
            value={overrideData.additionalNotes}
            onChange={(e) => setOverrideData(prev => ({ 
              ...prev, 
              additionalNotes: e.target.value 
            }))}
            placeholder="Any additional observations or instructions..."
            className="min-h-[80px]"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <Badge variant="outline" className="mr-2">AUDIT TRAIL</Badge>
            This action will be logged and auditable
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsOverriding(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitOverride}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Save className="mr-2" size={16} />
              Submit Override
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
