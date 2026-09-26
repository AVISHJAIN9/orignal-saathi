-- Sample rows for local dev/testing. Run after the migration:
--   psql "$DATABASE_URL" -f scripts/seed.sql
--
-- Three conversations for the same demo user, with deliberately
-- different updated_at values so GET /conversations?userId=user-demo-1
-- has something meaningful to sort/paginate.

INSERT INTO conversations (id, user_id, title, created_at, updated_at) VALUES
  ('a1111111-1111-4111-8111-111111111111', 'user-demo-1', 'Hallmarking process for gold jewellery', now() - interval '2 days', now() - interval '1 hour'),
  ('a2222222-2222-4222-8222-222222222222', 'user-demo-1', 'IS 302 certification for electric kettles', now() - interval '5 days', now() - interval '3 days'),
  ('a3333333-3333-4333-8333-333333333333', 'user-demo-1', 'BIS licence renewal timeline', now() - interval '10 days', now() - interval '9 days')
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, role, content, citations, created_at) VALUES
  ('b1111111-0001-4111-8111-111111111111', 'a1111111-1111-4111-8111-111111111111', 'user', 'What is the hallmarking process for gold jewellery?', NULL, now() - interval '2 days'),
  ('b1111111-0002-4111-8111-111111111111', 'a1111111-1111-4111-8111-111111111111', 'assistant', 'Gold jewellery hallmarking under BIS requires registration with a BIS-recognised Assaying & Hallmarking Centre before sale.', '[{"documentId": "is-1417-2016", "sectionTitle": "Scope"}]', now() - interval '2 days' + interval '5 seconds'),
  ('b1111111-0003-4111-8111-111111111111', 'a1111111-1111-4111-8111-111111111111', 'user', 'What about the fee?', NULL, now() - interval '1 hour'),
  ('b1111111-0004-4111-8111-111111111111', 'a1111111-1111-4111-8111-111111111111', 'assistant', 'Hallmarking fees vary by category and are set by the individual BIS-recognised AHC, not by BIS centrally.', NULL, now() - interval '1 hour' + interval '4 seconds')
ON CONFLICT (id) DO NOTHING;
