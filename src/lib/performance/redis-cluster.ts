// Redis Cluster Manager
import { createClient } from 'redis';

class RedisCluster {
  private static clients: ReturnType<typeof createClient>[] = [];
  private static currentIndex = 0;

  static async initialize() {
    const nodes = (process.env.REDIS_CLUSTER_NODES || 'localhost:6379').split(',');
    
    for (const node of nodes) {
      const [host, port] = node.split(':');
      const client = createClient({
        socket: { host, port: parseInt(port) },
        password: process.env.REDIS_PASSWORD
      });
      
      await client.connect();
      this.clients.push(client);
    }
  }

  static getClient() {
    if (this.clients.length === 0) return null;
    const client = this.clients[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.clients.length;
    return client;
  }

  static async disconnect() {
    await Promise.all(this.clients.map(c => c.quit()));
    this.clients = [];
  }
}

export default RedisCluster;
