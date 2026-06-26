# Actual Neon DB Schema (verified Jun 15, 2026)

## dating_profiles (23 columns)
- id uuid
- user_id uuid
- bio text
- interests text (JSON array as string)
- photos text (JSON array as string)
- verification_status USER-DEFINED enum
- verified boolean
- verified_at timestamp
- age_range varchar  ← NOTE: NOT age_min/age_max
- looking_for varchar
- relationship_goal varchar
- height varchar
- body_type varchar
- education varchar
- occupation varchar
- income varchar
- smoking varchar
- drinking varchar
- religion varchar
- ethnicity varchar
- languages text (JSON array as string)
- created_at timestamp
- updated_at timestamp

## professional_profiles (20 columns)
- id uuid
- user_id uuid
- headline varchar
- bio text
- profile_photo text
- cover_photo text
- skills text (JSON array as string)
- certifications text
- experience text (JSON array as string)
- education text (JSON array as string)
- portfolio text
- location varchar
- industry varchar
- job_title varchar
- company varchar
- years_of_experience integer
- availability varchar
- open_to_work boolean
- open_to_mentoring boolean
- verification_status USER-DEFINED enum
- verified boolean
- created_at timestamp
- updated_at timestamp

## subscriptions (base columns + payment columns added by migration)
- id uuid
- user_id uuid
- plan_id varchar
- status USER-DEFINED enum
- mode varchar
- price numeric
- currency varchar
- stripe_subscription_id varchar
- stripe_customer_id varchar
- flutterwave_tx_ref varchar
- flutterwave_transaction_id varchar
- payment_provider varchar
- manual_provider_override boolean
- current_period_start timestamp
- current_period_end timestamp
- cancel_at_period_end boolean
- cancelled_at timestamp
- trial_end timestamp
- promo_code varchar
- discount_amount numeric
- created_at timestamp
- updated_at timestamp

## users (from schema.ts)
- id uuid
- name varchar
- email varchar
- password_hash varchar
- country varchar
- gender varchar
- date_of_birth date
- avatar text
- bio text
- email_verified boolean
- is_active boolean
- role USER-DEFINED enum
- created_at timestamp
- updated_at timestamp

## user_modes
- id uuid
- user_id uuid
- current_mode varchar
- created_at timestamp
- updated_at timestamp
