-- PostgreSQL function that generates expenses for active subscriptions
-- whose nextBillingDate <= today. Can be scheduled with pg_cron.
--
-- Usage with pg_cron (run daily at 00:05):
--   SELECT cron.schedule('generate-subscription-expenses', '5 0 * * *', 'SELECT generate_subscription_expenses()');
--
-- Manual run:
--   SELECT generate_subscription_expenses();

CREATE OR REPLACE FUNCTION generate_subscription_expenses()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  sub RECORD;
  next_date DATE;
  end_limit DATE;
  last_day INT;
  clamped_day INT;
BEGIN
  FOR sub IN
    SELECT *
    FROM subscriptions
    WHERE active = true
      AND "nextBillingDate" <= CURRENT_DATE
  LOOP
    IF sub."endDate" IS NOT NULL AND sub."endDate" < sub."nextBillingDate" THEN
      CONTINUE;
    END IF;

    next_date := sub."nextBillingDate"::date;
    end_limit := COALESCE(sub."endDate"::date, CURRENT_DATE);

    WHILE next_date <= CURRENT_DATE AND next_date <= end_limit LOOP
      INSERT INTO expenses (
        id, description, amount, currency, "categoryId", date,
        "paymentMethod", "cardId", "subscriptionId", "createdAt", "updatedAt"
      ) VALUES (
        gen_random_uuid()::text,
        sub.name,
        sub.amount,
        sub.currency,
        sub."categoryId",
        next_date,
        sub."paymentMethod",
        sub."cardId",
        sub.id,
        NOW(),
        NOW()
      );

      -- Advance next_date
      IF sub."billingCycle" = 'MONTHLY' THEN
        next_date := (next_date + INTERVAL '1 month')::date;
      ELSE
        next_date := (next_date + INTERVAL '1 year')::date;
      END IF;

      -- Clamp day to last day of the target month
      last_day := EXTRACT(DAY FROM (DATE_TRUNC('month', next_date) + INTERVAL '1 month - 1 day'));
      clamped_day := LEAST(sub."billingDay", last_day);
      next_date := DATE_TRUNC('month', next_date)::date + (clamped_day - 1);
    END LOOP;

    UPDATE subscriptions
    SET "nextBillingDate" = next_date, "updatedAt" = NOW()
    WHERE id = sub.id;
  END LOOP;
END;
$$;
