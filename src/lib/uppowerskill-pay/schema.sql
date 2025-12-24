-- upPowerSkill Pay Database Schema

-- Skill Wallets (Closed-loop Credits)
CREATE TABLE skill_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  learning_credits DECIMAL(10,2) DEFAULT 0,
  exam_credits DECIMAL(10,2) DEFAULT 0,
  ai_credits DECIMAL(10,2) DEFAULT 0,
  funding_credits DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Trust Ledger (Immutable Records)
CREATE TABLE trust_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  entry_type VARCHAR(50) NOT NULL,
  entry_data JSONB NOT NULL,
  hash VARCHAR(64) NOT NULL,
  signature VARCHAR(128),
  block_height BIGINT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wallet Transactions
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES skill_wallets(id),
  transaction_type VARCHAR(20) NOT NULL, -- CREDIT, DEBIT
  credit_type VARCHAR(20) NOT NULL, -- learning, exam, ai, funding
  amount DECIMAL(10,2) NOT NULL,
  purpose VARCHAR(255),
  source VARCHAR(255),
  status VARCHAR(20) DEFAULT 'COMPLETED',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Funding Programs
CREATE TABLE funding_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- GRANT, INVESTMENT, CORPORATE_TRAINING
  total_budget DECIMAL(15,2),
  available_budget DECIMAL(15,2),
  eligibility_criteria JSONB,
  milestones JSONB,
  escrow_rules JSONB,
  status VARCHAR(20) DEFAULT 'DRAFT',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Milestone Completions
CREATE TABLE milestone_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES funding_programs(id),
  milestone_id VARCHAR(255) NOT NULL,
  user_id UUID NOT NULL,
  evidence JSONB,
  verification_status VARCHAR(20) DEFAULT 'PENDING',
  funding_released DECIMAL(10,2),
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Payment Orchestration Logs
CREATE TABLE payment_orchestration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id VARCHAR(255) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'THB',
  status VARCHAR(20) NOT NULL,
  retry_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_skill_wallets_user_id ON skill_wallets(user_id);
CREATE INDEX idx_trust_ledger_user_id ON trust_ledger(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_milestone_completions_program_id ON milestone_completions(program_id);
CREATE INDEX idx_payment_logs_request_id ON payment_orchestration_logs(request_id);