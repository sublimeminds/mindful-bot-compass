import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Clock, Users, Brain, Target, Star, Lightbulb } from 'lucide-react';

interface TherapyType {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  conditions: string[];
  icon: string;
  gradient: string;
  isPremium?: boolean;
  isNew?: boolean;
}

interface TherapyDetailsModalProps {
  therapy: TherapyType | null;
  isOpen: boolean;
  onClose: () => void;
  onStartAssessment: () => void;
}

// Extended therapy details data
const therapyDetails: Record<string, {
  fullDescription: string;
  researchEvidence: string[];
  whatToExpect: string[];
  suitability: {
    bestFor: string[];
    notRecommendedFor: string[];
  };
  timeline: {
    typical: string;
    sessions: string;
    frequency: string;
  };
  techniques: string[];
  successStories: string;
  relatedApproaches: string[];
}> = {
  cbt: {
    fullDescription: "Cognitive Behavioral Therapy (CBT) is a highly structured, evidence-based approach that helps you identify and change negative thought patterns and behaviors. It's based on the idea that our thoughts, feelings, and behaviors are interconnected, and by changing one, we can positively impact the others.",
    researchEvidence: [
      "Over 2,000 research studies support CBT effectiveness",
      "75-80% improvement rate for anxiety disorders",
      "Equally effective as medication for depression",
      "Long-lasting results that prevent relapse"
    ],
    whatToExpect: [
      "Structured sessions with clear agendas",
      "Homework assignments between sessions",
      "Learning to identify thought patterns",
      "Developing coping strategies and skills",
      "Regular progress monitoring"
    ],
    suitability: {
      bestFor: [
        "People who prefer structured approaches",
        "Those comfortable with homework assignments",
        "Individuals wanting practical tools",
        "People with anxiety, depression, or PTSD"
      ],
      notRecommendedFor: [
        "Those preferring less structured therapy",
        "People uncomfortable with self-monitoring",
        "Individuals in acute crisis situations"
      ]
    },
    timeline: {
      typical: "12-20 sessions",
      sessions: "45-60 minutes",
      frequency: "Weekly initially, then bi-weekly"
    },
    techniques: [
      "Thought records and monitoring",
      "Behavioral experiments",
      "Exposure exercises",
      "Problem-solving skills",
      "Relaxation techniques"
    ],
    successStories: "Sarah, a 28-year-old teacher, overcame severe social anxiety using CBT techniques. After 16 sessions, she was able to present to her colleagues and pursue a promotion she'd been avoiding for years.",
    relatedApproaches: ["DBT", "ACT", "Mindfulness-Based Therapy"]
  },
  dbt: {
    fullDescription: "Dialectical Behavior Therapy (DBT) combines cognitive-behavioral techniques with mindfulness practices. Originally developed for borderline personality disorder, it's now widely used for emotional regulation difficulties and impulsive behaviors.",
    researchEvidence: [
      "Reduces suicidal behaviors by 50% in studies",
      "Effective for borderline personality disorder",
      "Significant improvement in emotional regulation",
      "Reduces hospitalizations and self-harm"
    ],
    whatToExpect: [
      "Skills training in four modules",
      "Individual therapy sessions",
      "Group skills training",
      "24/7 phone coaching",
      "Team consultation for therapists"
    ],
    suitability: {
      bestFor: [
        "People with intense emotions",
        "Those with relationship difficulties",
        "Individuals with self-harm behaviors",
        "People wanting practical skills"
      ],
      notRecommendedFor: [
        "Those not ready for skills practice",
        "People preferring insight-oriented therapy",
        "Individuals unwilling to commit to homework"
      ]
    },
    timeline: {
      typical: "6-12 months",
      sessions: "60-90 minutes",
      frequency: "Weekly individual + group"
    },
    techniques: [
      "Distress tolerance skills",
      "Emotion regulation techniques",
      "Interpersonal effectiveness",
      "Mindfulness practices",
      "Crisis survival strategies"
    ],
    successStories: "Mark learned to manage his intense anger and saved his marriage using DBT skills. The STOP technique and emotion regulation tools helped him respond rather than react during conflicts.",
    relatedApproaches: ["CBT", "Mindfulness-Based Therapy", "ACT"]
  },
  // Add more therapy details as needed
  mindfulness: {
    fullDescription: "Mindfulness-Based Therapy integrates contemplative practices with psychological healing. It emphasizes present-moment awareness, acceptance, and non-judgmental observation of thoughts and feelings.",
    researchEvidence: [
      "Reduces anxiety and depression symptoms",
      "Improves emotional regulation",
      "Decreases rumination and worry",
      "Enhances overall well-being"
    ],
    whatToExpect: [
      "Guided meditation practices",
      "Body awareness exercises",
      "Mindful movement",
      "Daily mindfulness homework",
      "Integration with daily activities"
    ],
    suitability: {
      bestFor: [
        "People interested in meditation",
        "Those with chronic stress",
        "Individuals with anxiety or depression",
        "People wanting holistic approaches"
      ],
      notRecommendedFor: [
        "Those preferring action-oriented therapy",
        "People in acute psychological crisis",
        "Individuals uncomfortable with meditation"
      ]
    },
    timeline: {
      typical: "8-12 weeks",
      sessions: "60-90 minutes",
      frequency: "Weekly with daily practice"
    },
    techniques: [
      "Breath awareness meditation",
      "Body scan practices",
      "Mindful walking",
      "Loving-kindness meditation",
      "Present-moment anchoring"
    ],
    successStories: "Jennifer, a busy executive, reduced her chronic stress and improved sleep quality through mindfulness practices. She now starts each day with a 10-minute meditation and feels more centered throughout her workday.",
    relatedApproaches: ["ACT", "CBT", "Somatic Therapy"]
  }
};

const TherapyDetailsModal: React.FC<TherapyDetailsModalProps> = ({
  therapy,
  isOpen,
  onClose,
  onStartAssessment
}) => {
  if (!therapy) return null;

  const details = therapyDetails[therapy.id] || {
    fullDescription: therapy.description,
    researchEvidence: ["Evidence-based approach", "Clinically proven techniques"],
    whatToExpect: ["Professional guidance", "Personalized treatment plan"],
    suitability: {
      bestFor: therapy.conditions,
      notRecommendedFor: ["Acute crisis situations"]
    },
    timeline: {
      typical: "12-16 sessions",
      sessions: "50 minutes",
      frequency: "Weekly"
    },
    techniques: therapy.benefits,
    successStories: "Many clients have found significant improvement using this approach.",
    relatedApproaches: ["CBT", "Mindfulness-Based Therapy"]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${therapy.gradient} flex items-center justify-center text-2xl flex-shrink-0`}>
              {therapy.icon}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">{therapy.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{therapy.category}</Badge>
                {therapy.isPremium && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    Premium
                  </Badge>
                )}
                {therapy.isNew && (
                  <Badge variant="outline">New</Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Overview</h3>
            <p className="text-muted-foreground leading-relaxed">
              {details.fullDescription}
            </p>
          </div>

          <Separator />

          {/* Research Evidence */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Research Evidence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {details.researchEvidence.map((evidence, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{evidence}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* What to Expect */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              What to Expect
            </h3>
            <div className="space-y-2">
              {details.whatToExpect.map((expectation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-therapy-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{expectation}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Treatment Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="font-medium text-sm">Duration</div>
                <div className="text-muted-foreground text-sm">{details.timeline.typical}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="font-medium text-sm">Session Length</div>
                <div className="text-muted-foreground text-sm">{details.timeline.sessions}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <div className="font-medium text-sm">Frequency</div>
                <div className="text-muted-foreground text-sm">{details.timeline.frequency}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Suitability */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Who This Approach Suits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-700 mb-2">Best For:</h4>
                <div className="space-y-1">
                  {details.suitability.bestFor.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-orange-700 mb-2">Consider Alternatives If:</h4>
                <div className="space-y-1">
                  {details.suitability.notRecommendedFor.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0">•</span>
                      <span className="text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Techniques */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Key Techniques
            </h3>
            <div className="flex flex-wrap gap-2">
              {details.techniques.map((technique, index) => (
                <Badge key={index} variant="secondary">{technique}</Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Success Story */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Success Story
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 italic text-muted-foreground">
              "{details.successStories}"
            </div>
          </div>

          <Separator />

          {/* Related Approaches */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Related Approaches</h3>
            <div className="flex flex-wrap gap-2">
              {details.relatedApproaches.map((approach, index) => (
                <Badge key={index} variant="outline">{approach}</Badge>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-therapy-50 via-harmony-50 to-balance-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-4">
              Our AI assessment will determine if this approach is right for you and create a personalized treatment plan.
            </p>
            <Button 
              onClick={onStartAssessment}
              className="bg-gradient-to-r from-therapy-500 to-harmony-600 hover:from-therapy-600 hover:to-harmony-700"
            >
              Start AI Assessment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TherapyDetailsModal;