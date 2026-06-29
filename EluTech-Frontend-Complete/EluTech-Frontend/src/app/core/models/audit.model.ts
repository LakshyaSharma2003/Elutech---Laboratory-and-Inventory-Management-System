export interface AuditLog {
  id: number;
  userId?: number;
  action: string;
  entityName: string;
  ipAddress: string;
  timestamp: string;
}
