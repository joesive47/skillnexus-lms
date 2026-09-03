-- Phase 9: Security Tables Migration
-- MFA, Threat Detection, and Audit Logging

-- MFA Settings Table
CREATE TABLE IF NOT EXISTS mfa_settings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  method TEXT NOT NULL CHECK(method IN ('TOTP', 'SMS', 'EMAIL', 'BIOMETRIC')),
  secret TEXT,
  backup_codes TEXT,
  is_enabled BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, method),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mfa_settings_user ON mfa_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_settings_enabled ON mfa_settings(is_enabled);

-- MFA Logs Table
CREATE TABLE IF NOT EXISTS mfa_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  method TEXT NOT NULL,
  success BOOLEAN NOT NULL,
  note TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_mfa_logs_user ON mfa_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_mfa_logs_created ON mfa_logs(created_at);

-- Threat Logs Table
CREATE TABLE IF NOT EXISTS threat_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  type TEXT NOT NULL,
  level TEXT NOT NULL CHECK(level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  user_id TEXT,
  ip TEXT NOT NULL,
  user_agent TEXT,
  endpoint TEXT NOT NULL,
  payload TEXT,
  action TEXT NOT NULL CHECK(action IN ('BLOCK', 'ALERT', 'LOG', 'QUARANTINE')),
  reason TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_threat_logs_ip ON threat_logs(ip);
CREATE INDEX IF NOT EXISTS idx_threat_logs_type ON threat_logs(type);
CREATE INDEX IF NOT EXISTS idx_threat_logs_level ON threat_logs(level);
CREATE INDEX IF NOT EXISTS idx_threat_logs_created ON threat_logs(created_at);

-- Blocked IPs Table
CREATE TABLE IF NOT EXISTS blocked_ips (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  ip TEXT NOT NULL UNIQUE,
  reason TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_blocked_ips_ip ON blocked_ips(ip);
CREATE INDEX IF NOT EXISTS idx_blocked_ips_expires ON blocked_ips(expires_at);

-- Security Audit Logs Table (Enhanced)
CREATE TABLE IF NOT EXISTS security_audit_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  status TEXT NOT NULL CHECK(status IN ('SUCCESS', 'FAILURE', 'BLOCKED')),
  details TEXT,
  risk_score INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_security_audit_user ON security_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_action ON security_audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_security_audit_status ON security_audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_security_audit_created ON security_audit_logs(created_at);

-- Add quarantine fields to users table
ALTER TABLE users ADD COLUMN is_quarantined BOOLEAN DEFAULT 0;
ALTER TABLE users ADD COLUMN quarantined_at DATETIME;
ALTER TABLE users ADD COLUMN quarantine_reason TEXT;

-- Session Security Table
CREATE TABLE IF NOT EXISTS secure_sessions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  fingerprint TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  device_info TEXT,
  is_active BOOLEAN DEFAULT 1,
  last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_secure_sessions_user ON secure_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_secure_sessions_token ON secure_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_secure_sessions_active ON secure_sessions(is_active);

-- Compliance Logs Table
CREATE TABLE IF NOT EXISTS compliance_logs (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  type TEXT NOT NULL CHECK(type IN ('GDPR', 'SOC2', 'ISO27001', 'PCI_DSS')),
  action TEXT NOT NULL,
  user_id TEXT,
  data_subject TEXT,
  details TEXT,
  status TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_compliance_logs_type ON compliance_logs(type);
CREATE INDEX IF NOT EXISTS idx_compliance_logs_created ON compliance_logs(created_at);
