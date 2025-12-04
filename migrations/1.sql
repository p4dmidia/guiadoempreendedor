
CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  referred_by TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  subscription_start_date DATE,
  subscription_end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_referral_code ON members(referral_code);
CREATE INDEX idx_members_referred_by ON members(referred_by);

CREATE TABLE referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_member_id INTEGER NOT NULL,
  referred_member_id INTEGER NOT NULL,
  level INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_member_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_member_id);

CREATE TABLE commissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  member_id INTEGER NOT NULL,
  referral_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  percentage REAL NOT NULL,
  status TEXT NOT NULL,
  payment_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_commissions_member ON commissions(member_id);
CREATE INDEX idx_commissions_status ON commissions(status);
