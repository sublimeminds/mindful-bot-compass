
interface SecurityIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'data_breach' | 'unauthorized_access' | 'malware' | 'ddos' | 'phishing' | 'insider_threat';
  status: 'detected' | 'investigating' | 'contained' | 'resolved' | 'closed';
  affected_systems: string[];
  affected_users: string[];
  detection_time: Date;
  response_time?: Date;
  resolution_time?: Date;
  assigned_to?: string;
  timeline: IncidentTimelineEntry[];
  evidence: IncidentEvidence[];
  containment_actions: string[];
  recovery_actions: string[];
  lessons_learned?: string;
  post_incident_report?: string;
}

interface IncidentTimelineEntry {
  id: string;
  timestamp: Date;
  event: string;
  actor: string;
  details: string;
}

interface IncidentEvidence {
  id: string;
  type: 'log' | 'screenshot' | 'network_trace' | 'user_report' | 'system_alert';
  description: string;
  file_path?: string;
  collected_at: Date;
  collected_by: string;
}

interface IncidentResponse {
  incident_id: string;
  response_plan: ResponsePlan;
  status: 'initiated' | 'in_progress' | 'completed';
  steps_completed: string[];
  next_actions: string[];
}

interface ResponsePlan {
  severity_level: string;
  immediate_actions: string[];
  investigation_steps: string[];
  containment_steps: string[];
  recovery_steps: string[];
  communication_plan: string[];
  stakeholders_to_notify: string[];
}

export class IncidentResponseSystem {
  private static instance: IncidentResponseSystem;
  private incidents: SecurityIncident[] = [];
  private responsePlans: Map<string, ResponsePlan> = new Map();

  private constructor() {
    this.initializeResponsePlans();
    this.loadStoredIncidents();
  }

  static getInstance(): IncidentResponseSystem {
    if (!IncidentResponseSystem.instance) {
      IncidentResponseSystem.instance = new IncidentResponseSystem();
    }
    return IncidentResponseSystem.instance;
  }

  private initializeResponsePlans(): void {
    // Critical severity response plan
    this.responsePlans.set('critical', {
      severity_level: 'critical',
      immediate_actions: [
        'Activate incident response team immediately',
        'Isolate affected systems from network',
        'Preserve evidence and logs',
        'Notify senior management within 15 minutes',
        'Contact legal and compliance teams',
        'Prepare external communication plan'
      ],
      investigation_steps: [
        'Conduct forensic analysis of affected systems',
        'Interview affected users and witnesses',
        'Analyze security logs and network traffic',
        'Determine root cause and attack vector',
        'Assess scope of compromise'
      ],
      containment_steps: [
        'Block malicious IP addresses',
        'Disable compromised user accounts',
        'Patch vulnerable systems immediately',
        'Deploy additional monitoring',
        'Implement emergency access controls'
      ],
      recovery_steps: [
        'Restore systems from clean backups',
        'Reset all potentially compromised credentials',
        'Update security configurations',
        'Gradually restore services with monitoring',
        'Conduct security validation testing'
      ],
      communication_plan: [
        'Notify affected users immediately',
        'Issue public statement if required',
        'Report to regulatory authorities',
        'Coordinate with law enforcement if needed',
        'Update stakeholders regularly'
      ],
      stakeholders_to_notify: [
        'CEO/Senior Management',
        'Legal Team',
        'Compliance Officer',
        'Public Relations',
        'Affected Customers',
        'Regulatory Bodies'
      ]
    });

    // High severity response plan
    this.responsePlans.set('high', {
      severity_level: 'high',
      immediate_actions: [
        'Activate incident response team within 30 minutes',
        'Isolate affected systems',
        'Preserve evidence',
        'Notify management within 1 hour',
        'Begin containment procedures'
      ],
      investigation_steps: [
        'Analyze security logs',
        'Identify affected systems and data',
        'Determine attack timeline',
        'Assess potential data exposure'
      ],
      containment_steps: [
        'Block suspicious network traffic',
        'Disable compromised accounts',
        'Apply security patches',
        'Increase monitoring'
      ],
      recovery_steps: [
        'Restore affected systems',
        'Reset compromised credentials',
        'Update security controls',
        'Monitor for continued threats'
      ],
      communication_plan: [
        'Internal notification to relevant teams',
        'Prepare customer communication if needed',
        'Consider regulatory notification'
      ],
      stakeholders_to_notify: [
        'IT Security Team',
        'Department Managers',
        'Legal Team (if required)',
        'Affected Users'
      ]
    });

    // Medium and low severity plans...
    this.responsePlans.set('medium', {
      severity_level: 'medium',
      immediate_actions: [
        'Log incident details',
        'Assign to security analyst',
        'Begin initial assessment',
        'Monitor for escalation'
      ],
      investigation_steps: [
        'Review relevant logs',
        'Check for similar incidents',
        'Assess potential impact'
      ],
      containment_steps: [
        'Apply standard security measures',
        'Block if necessary',
        'Update filters/rules'
      ],
      recovery_steps: [
        'Apply fixes or patches',
        'Monitor affected systems',
        'Document resolution'
      ],
      communication_plan: [
        'Internal team notification',
        'Update incident tracking system'
      ],
      stakeholders_to_notify: [
        'Security Team',
        'System Administrators'
      ]
    });
  }

  private loadStoredIncidents(): void {
    try {
      const stored = localStorage.getItem('security_incidents');
      if (stored) {
        this.incidents = JSON.parse(stored).map((incident: any) => ({
          ...incident,
          detection_time: new Date(incident.detection_time),
          response_time: incident.response_time ? new Date(incident.response_time) : undefined,
          resolution_time: incident.resolution_time ? new Date(incident.resolution_time) : undefined,
          timeline: incident.timeline.map((entry: any) => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          })),
          evidence: incident.evidence.map((evidence: any) => ({
            ...evidence,
            collected_at: new Date(evidence.collected_at)
          }))
        }));
      }
    } catch (error) {
      console.error('Failed to load stored incidents:', error);
    }
  }

  private saveIncidents(): void {
    try {
      localStorage.setItem('security_incidents', JSON.stringify(this.incidents));
    } catch (error) {
      console.error('Failed to save incidents:', error);
    }
  }

  createIncident(
    title: string,
    description: string,
    severity: SecurityIncident['severity'],
    type: SecurityIncident['type'],
    affectedSystems: string[] = [],
    affectedUsers: string[] = []
  ): SecurityIncident {
    const incident: SecurityIncident = {
      id: crypto.randomUUID(),
      title,
      description,
      severity,
      type,
      status: 'detected',
      affected_systems: affectedSystems,
      affected_users: affectedUsers,
      detection_time: new Date(),
      timeline: [{
        id: crypto.randomUUID(),
        timestamp: new Date(),
        event: 'Incident detected',
        actor: 'Security System',
        details: description
      }],
      evidence: [],
      containment_actions: [],
      recovery_actions: []
    };

    this.incidents.push(incident);
    this.saveIncidents();

    // Automatically initiate response based on severity
    this.initiateResponse(incident.id);

    console.log(`Security incident created: ${incident.id} (${severity})`);
    return incident;
  }

  initiateResponse(incidentId: string): IncidentResponse | null {
    const incident = this.getIncident(incidentId);
    if (!incident) {
      console.error(`Incident not found: ${incidentId}`);
      return null;
    }

    const responsePlan = this.responsePlans.get(incident.severity);
    if (!responsePlan) {
      console.error(`No response plan found for severity: ${incident.severity}`);
      return null;
    }

    // Update incident status
    this.updateIncidentStatus(incidentId, 'investigating');
    this.addTimelineEntry(incidentId, 'Response initiated', 'Incident Response System', 
      `Automated response plan activated for ${incident.severity} severity incident`);

    // Mark response time
    const incidentIndex = this.incidents.findIndex(i => i.id === incidentId);
    if (incidentIndex !== -1) {
      this.incidents[incidentIndex].response_time = new Date();
      this.saveIncidents();
    }

    const response: IncidentResponse = {
      incident_id: incidentId,
      response_plan: responsePlan,
      status: 'initiated',
      steps_completed: [],
      next_actions: responsePlan.immediate_actions
    };

    // For critical incidents, send immediate alerts
    if (incident.severity === 'critical') {
      this.sendCriticalAlert(incident);
    }

    console.log(`Response initiated for incident: ${incidentId}`);
    return response;
  }

  private sendCriticalAlert(incident: SecurityIncident): void {
    // In a real implementation, this would send emails, SMS, or push notifications
    console.warn('🚨 CRITICAL SECURITY INCIDENT DETECTED 🚨');
    console.warn(`Incident: ${incident.title}`);
    console.warn(`Type: ${incident.type}`);
    console.warn(`Time: ${incident.detection_time.toISOString()}`);
    console.warn(`Affected Systems: ${incident.affected_systems.join(', ')}`);
    
    // Create browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Critical Security Incident', {
        body: `${incident.title} - Immediate response required`,
        icon: '/favicon.ico',
        requireInteraction: true
      });
    }

    // Dispatch custom event for real-time notifications
    window.dispatchEvent(new CustomEvent('criticalSecurityAlert', {
      detail: incident
    }));
  }

  updateIncidentStatus(incidentId: string, status: SecurityIncident['status']): void {
    const incidentIndex = this.incidents.findIndex(i => i.id === incidentId);
    if (incidentIndex !== -1) {
      this.incidents[incidentIndex].status = status;
      
      if (status === 'resolved') {
        this.incidents[incidentIndex].resolution_time = new Date();
      }
      
      this.addTimelineEntry(incidentId, `Status changed to ${status}`, 'System', 
        `Incident status updated to ${status}`);
      this.saveIncidents();
    }
  }

  addTimelineEntry(incidentId: string, event: string, actor: string, details: string): void {
    const incidentIndex = this.incidents.findIndex(i => i.id === incidentId);
    if (incidentIndex !== -1) {
      this.incidents[incidentIndex].timeline.push({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        event,
        actor,
        details
      });
      this.saveIncidents();
    }
  }

  addEvidence(incidentId: string, evidence: Omit<IncidentEvidence, 'id' | 'collected_at'>): void {
    const incidentIndex = this.incidents.findIndex(i => i.id === incidentId);
    if (incidentIndex !== -1) {
      this.incidents[incidentIndex].evidence.push({
        id: crypto.randomUUID(),
        collected_at: new Date(),
        ...evidence
      });
      this.addTimelineEntry(incidentId, 'Evidence collected', evidence.collected_by, 
        `Evidence added: ${evidence.description}`);
      this.saveIncidents();
    }
  }

  getIncident(incidentId: string): SecurityIncident | undefined {
    return this.incidents.find(i => i.id === incidentId);
  }

  getAllIncidents(): SecurityIncident[] {
    return [...this.incidents].sort((a, b) => 
      b.detection_time.getTime() - a.detection_time.getTime()
    );
  }

  getActiveIncidents(): SecurityIncident[] {
    return this.incidents.filter(i => 
      i.status !== 'resolved' && i.status !== 'closed'
    );
  }

  generateIncidentReport(incidentId: string): string {
    const incident = this.getIncident(incidentId);
    if (!incident) return '';

    const responseTime = incident.response_time ? 
      incident.response_time.getTime() - incident.detection_time.getTime() : null;
    const resolutionTime = incident.resolution_time ? 
      incident.resolution_time.getTime() - incident.detection_time.getTime() : null;

    return `
# Security Incident Report

## Incident Details
- **ID**: ${incident.id}
- **Title**: ${incident.title}
- **Type**: ${incident.type}
- **Severity**: ${incident.severity}
- **Status**: ${incident.status}

## Timeline
- **Detection Time**: ${incident.detection_time.toISOString()}
- **Response Time**: ${incident.response_time?.toISOString() || 'N/A'}
- **Resolution Time**: ${incident.resolution_time?.toISOString() || 'N/A'}
- **Response Duration**: ${responseTime ? `${Math.round(responseTime / 1000 / 60)} minutes` : 'N/A'}
- **Total Duration**: ${resolutionTime ? `${Math.round(resolutionTime / 1000 / 60)} minutes` : 'Ongoing'}

## Description
${incident.description}

## Affected Systems
${incident.affected_systems.map(system => `- ${system}`).join('\n')}

## Affected Users
${incident.affected_users.map(user => `- ${user}`).join('\n')}

## Timeline of Events
${incident.timeline.map(entry => 
  `- **${entry.timestamp.toISOString()}** (${entry.actor}): ${entry.event} - ${entry.details}`
).join('\n')}

## Evidence Collected
${incident.evidence.map(evidence => 
  `- **${evidence.type}**: ${evidence.description} (Collected by ${evidence.collected_by} at ${evidence.collected_at.toISOString()})`
).join('\n')}

## Containment Actions
${incident.containment_actions.map(action => `- ${action}`).join('\n')}

## Recovery Actions
${incident.recovery_actions.map(action => `- ${action}`).join('\n')}

## Lessons Learned
${incident.lessons_learned || 'To be completed'}

## Post-Incident Analysis
${incident.post_incident_report || 'To be completed'}
    `.trim();
  }

  // Auto-detect incidents from security events
  processSecurityEvent(event: any): void {
    // Critical event detection
    if (event.severity === 'critical' || event.type === 'security_violation') {
      this.createIncident(
        `Security Event: ${event.type}`,
        `Critical security event detected: ${event.details || 'No details provided'}`,
        'critical',
        'unauthorized_access',
        ['Web Application'],
        [event.userId].filter(Boolean)
      );
    }
    
    // Multiple failed login attempts
    if (event.type === 'auth_failure') {
      const recentFailures = this.incidents.filter(i => 
        i.type === 'unauthorized_access' && 
        Date.now() - i.detection_time.getTime() < 5 * 60 * 1000 // Last 5 minutes
      );
      
      if (recentFailures.length >= 3) {
        this.createIncident(
          'Multiple Authentication Failures',
          'Multiple failed login attempts detected, possible brute force attack',
          'high',
          'unauthorized_access',
          ['Authentication System'],
          [event.userId].filter(Boolean)
        );
      }
    }
  }
}

export const incidentResponseSystem = IncidentResponseSystem.getInstance();
