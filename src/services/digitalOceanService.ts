
interface DigitalOceanConfig {
  apiToken: string;
  spacesEndpoint: string;
  spacesRegion: string;
  spacesAccessKey: string;
  spacesSecretKey: string;
  defaultRegion: string;
  projectId?: string;
}

interface DOSpace {
  name: string;
  region: string;
  endpoint: string;
  createdAt: Date;
  sizeBytes: number;
  isPublic: boolean;
}

interface DODroplet {
  id: number;
  name: string;
  status: string;
  ip: string;
  region: string;
  size: string;
  createdAt: Date;
  tags: string[];
}

interface DODatabase {
  id: string;
  name: string;
  engine: string;
  version: string;
  size: string;
  region: string;
  status: string;
  connection: {
    host: string;
    port: number;
    database: string;
    user: string;
  };
}

interface DOLoadBalancer {
  id: string;
  name: string;
  ip: string;
  status: string;
  region: string;
  healthCheck: {
    protocol: string;
    port: number;
    path: string;
  };
}

interface DOMonitoringAlert {
  id: string;
  type: string;
  description: string;
  entities: string[];
  tags: string[];
  alerts: {
    email: string[];
    slack?: {
      channel: string;
      url: string;
    };
  };
}

export class DigitalOceanService {
  private static instance: DigitalOceanService;
  private config: DigitalOceanConfig;
  private baseUrl = 'https://api.digitalocean.com/v2';

  private constructor() {
    this.config = {
      apiToken: '',
      spacesEndpoint: 'https://nyc3.digitaloceanspaces.com',
      spacesRegion: 'nyc3',
      spacesAccessKey: '',
      spacesSecretKey: '',
      defaultRegion: 'nyc3'
    };
  }

  static getInstance(): DigitalOceanService {
    if (!DigitalOceanService.instance) {
      DigitalOceanService.instance = new DigitalOceanService();
    }
    return DigitalOceanService.instance;
  }

  // Configuration
  configure(config: Partial<DigitalOceanConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    if (!this.config.apiToken) {
      throw new Error('DigitalOcean API token not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`DigitalOcean API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Spaces (Object Storage) Management
  async createSpace(name: string, region: string = this.config.defaultRegion): Promise<DOSpace> {
    const response = await this.makeRequest('/spaces', {
      method: 'POST',
      body: JSON.stringify({
        name,
        region
      })
    });

    return {
      name: response.space.name,
      region: response.space.region,
      endpoint: response.space.endpoint_url,
      createdAt: new Date(response.space.created_at),
      sizeBytes: 0,
      isPublic: false
    };
  }

  async listSpaces(): Promise<DOSpace[]> {
    const response = await this.makeRequest('/spaces');
    return response.spaces.map((space: any) => ({
      name: space.name,
      region: space.region,
      endpoint: space.endpoint_url,
      createdAt: new Date(space.created_at),
      sizeBytes: space.size_gigabytes * 1024 * 1024 * 1024,
      isPublic: space.acl === 'public-read'
    }));
  }

  async uploadToSpace(spaceName: string, key: string, data: Blob | ArrayBuffer | string, isPublic: boolean = false): Promise<string> {
    const endpoint = `${this.config.spacesEndpoint}/${spaceName}/${key}`;
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      body: data,
      headers: {
        'Authorization': this.generateSpacesAuth('PUT', `/${spaceName}/${key}`),
        'Content-Type': 'application/octet-stream',
        'x-amz-acl': isPublic ? 'public-read' : 'private'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to upload to Spaces: ${response.status}`);
    }

    return `${endpoint}`;
  }

  async downloadFromSpace(spaceName: string, key: string): Promise<ArrayBuffer> {
    const endpoint = `${this.config.spacesEndpoint}/${spaceName}/${key}`;
    
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': this.generateSpacesAuth('GET', `/${spaceName}/${key}`)
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to download from Spaces: ${response.status}`);
    }

    return response.arrayBuffer();
  }

  private generateSpacesAuth(method: string, path: string): string {
    // Simplified AWS signature - in production, use proper AWS SDK
    const timestamp = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '');
    return `AWS4-HMAC-SHA256 Credential=${this.config.spacesAccessKey}/${timestamp.slice(0, 8)}/${this.config.spacesRegion}/s3/aws4_request, SignedHeaders=host;x-amz-date, Signature=placeholder`;
  }

  // Droplets (Compute) Management
  async createDroplet(name: string, region: string, size: string, image: string, sshKeys?: string[]): Promise<DODroplet> {
    const response = await this.makeRequest('/droplets', {
      method: 'POST',
      body: JSON.stringify({
        name,
        region,
        size,
        image,
        ssh_keys: sshKeys || [],
        tags: ['therapy-platform', 'security']
      })
    });

    return {
      id: response.droplet.id,
      name: response.droplet.name,
      status: response.droplet.status,
      ip: response.droplet.networks?.v4?.[0]?.ip_address || '',
      region: response.droplet.region.slug,
      size: response.droplet.size.slug,
      createdAt: new Date(response.droplet.created_at),
      tags: response.droplet.tags
    };
  }

  async listDroplets(): Promise<DODroplet[]> {
    const response = await this.makeRequest('/droplets');
    return response.droplets.map((droplet: any) => ({
      id: droplet.id,
      name: droplet.name,
      status: droplet.status,
      ip: droplet.networks?.v4?.[0]?.ip_address || '',
      region: droplet.region.slug,
      size: droplet.size.slug,
      createdAt: new Date(droplet.created_at),
      tags: droplet.tags
    }));
  }

  async deleteDroplet(dropletId: number): Promise<void> {
    await this.makeRequest(`/droplets/${dropletId}`, {
      method: 'DELETE'
    });
  }

  // Database Management
  async createDatabase(name: string, engine: string = 'pg', size: string = 'db-s-1vcpu-1gb'): Promise<DODatabase> {
    const response = await this.makeRequest('/databases', {
      method: 'POST',
      body: JSON.stringify({
        name,
        engine,
        version: engine === 'pg' ? '13' : '8.0',
        size,
        region: this.config.defaultRegion,
        num_nodes: 1,
        tags: ['therapy-platform', 'backup']
      })
    });

    return {
      id: response.database.id,
      name: response.database.name,
      engine: response.database.engine,
      version: response.database.version,
      size: response.database.size,
      region: response.database.region,
      status: response.database.status,
      connection: {
        host: response.database.connection.host,
        port: response.database.connection.port,
        database: response.database.connection.database,
        user: response.database.connection.user
      }
    };
  }

  async listDatabases(): Promise<DODatabase[]> {
    const response = await this.makeRequest('/databases');
    return response.databases.map((db: any) => ({
      id: db.id,
      name: db.name,
      engine: db.engine,
      version: db.version,
      size: db.size,
      region: db.region,
      status: db.status,
      connection: {
        host: db.connection.host,
        port: db.connection.port,
        database: db.connection.database,
        user: db.connection.user
      }
    }));
  }

  // Load Balancer Management
  async createLoadBalancer(name: string, dropletIds: number[]): Promise<DOLoadBalancer> {
    const response = await this.makeRequest('/load_balancers', {
      method: 'POST',
      body: JSON.stringify({
        name,
        algorithm: 'round_robin',
        status: 'new',
        created_at: new Date().toISOString(),
        ip: '',
        id: crypto.randomUUID(),
        tag: '',
        droplet_ids: dropletIds,
        region: this.config.defaultRegion,
        health_check: {
          protocol: 'http',
          port: 80,
          path: '/health',
          check_interval_seconds: 10,
          response_timeout_seconds: 5,
          unhealthy_threshold: 3,
          healthy_threshold: 2
        },
        sticky_sessions: {
          type: 'cookies',
          cookie_name: 'lb',
          cookie_ttl_seconds: 300
        },
        forwarding_rules: [
          {
            entry_protocol: 'https',
            entry_port: 443,
            target_protocol: 'http',
            target_port: 80,
            certificate_id: '',
            tls_passthrough: false
          }
        ]
      })
    });

    return {
      id: response.load_balancer.id,
      name: response.load_balancer.name,
      ip: response.load_balancer.ip,
      status: response.load_balancer.status,
      region: response.load_balancer.region.slug,
      healthCheck: {
        protocol: response.load_balancer.health_check.protocol,
        port: response.load_balancer.health_check.port,
        path: response.load_balancer.health_check.path
      }
    };
  }

  // Monitoring and Alerting
  async createMonitoringAlert(description: string, type: string, entities: string[]): Promise<DOMonitoringAlert> {
    const alertId = crypto.randomUUID();
    
    // Simulate creating monitoring alert - would use actual DO monitoring API
    const alert: DOMonitoringAlert = {
      id: alertId,
      type,
      description,
      entities,
      tags: ['therapy-platform', 'security'],
      alerts: {
        email: ['admin@therapy-platform.com']
      }
    };

    console.log('Created monitoring alert:', alert);
    return alert;
  }

  async getDropletMetrics(dropletId: number, startTime: Date, endTime: Date): Promise<any> {
    const response = await this.makeRequest(`/monitoring/metrics/droplet/cpu?host_id=${dropletId}&start=${startTime.toISOString()}&end=${endTime.toISOString()}`);
    return response.data;
  }

  // VPC Management
  async createVPC(name: string, ipRange: string = '10.0.0.0/24'): Promise<any> {
    const response = await this.makeRequest('/vpcs', {
      method: 'POST',
      body: JSON.stringify({
        name,
        region: this.config.defaultRegion,
        ip_range: ipRange,
        description: 'Therapy Platform VPC for secure networking'
      })
    });

    return response.vpc;
  }

  // Container Registry
  async getContainerRegistry(): Promise<any> {
    try {
      const response = await this.makeRequest('/registry');
      return response.registry;
    } catch (error) {
      console.warn('Container registry not available:', error);
      return null;
    }
  }

  // Kubernetes Management
  async createKubernetesCluster(name: string, nodePoolSize: string = 's-2vcpu-2gb'): Promise<any> {
    const response = await this.makeRequest('/kubernetes/clusters', {
      method: 'POST',
      body: JSON.stringify({
        name,
        region: this.config.defaultRegion,
        version: '1.28.2-do.0',
        auto_upgrade: true,
        surge_upgrade: true,
        tags: ['therapy-platform', 'security'],
        node_pools: [
          {
            size: nodePoolSize,
            count: 2,
            name: 'security-worker-pool',
            tags: ['security', 'worker'],
            auto_scale: true,
            min_nodes: 1,
            max_nodes: 5
          }
        ]
      })
    });

    return response.kubernetes_cluster;
  }

  // Utility Methods
  async getAccountInfo(): Promise<any> {
    const response = await this.makeRequest('/account');
    return response.account;
  }

  async listRegions(): Promise<any[]> {
    const response = await this.makeRequest('/regions');
    return response.regions;
  }

  async listSizes(): Promise<any[]> {
    const response = await this.makeRequest('/sizes');
    return response.sizes;
  }

  // Integration with existing backup system
  async integrateWithBackupSystem(): Promise<void> {
    try {
      // Create dedicated backup space
      await this.createSpace('therapy-platform-backups', this.config.defaultRegion);
      
      // Create monitoring alerts for backup operations
      await this.createMonitoringAlert(
        'Backup operation failed',
        'backup_failure',
        ['backup-space']
      );

      console.log('DigitalOcean backup integration completed');
    } catch (error) {
      console.error('Failed to integrate with backup system:', error);
    }
  }
}

export const digitalOceanService = DigitalOceanService.getInstance();
