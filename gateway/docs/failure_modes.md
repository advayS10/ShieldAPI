# Failure Modes & Interview Summary — ShieldAPI

This page summarizes key failure modes for ShieldAPI and concise phrasing you can use in interviews.

1) Redis overload or outage
- Symptom: Redis becomes slow/unresponsive under heavy load (e.g., 1,000K ops/sec).
- Immediate effect: Rate-limiting and login/signup throttles rely on Redis. When Redis times out or errors, the middleware falls back to an in-memory token bucket (conservative). Without fallback the previous behavior allowed requests (fail-open). With fallback the gateway enforces limited local throttling but capacity is per gateway instance only.
- Secondary effects: Downstream services may get higher unthrottled traffic; memory pressure in Redis (many per-IP keys) can cause eviction; longer request latency and client timeouts (axios 5s) increase.
- Interview phrasing: "If Redis saturates, rate-limiting becomes degraded; we fall back to a local in-memory token bucket per gateway instance, which preserves some protection but is not globally consistent. This reduces blast radius while ops restore Redis or scale it up."

2) MongoDB outage
- Symptom: `connectDB()` fails at startup or DB disconnects after start.
- Immediate effect at startup: `server.js` calls `connectDB()` and exits on failure (process.exit), so the gateway won't start.
- Immediate effect at runtime: Auth-protected endpoints that call `Auth.findOne()` will fail; users will be unable to authenticate and requests requiring auth will be rejected or error.
- Interview phrasing: "A MongoDB outage prevents token issuance and user lookups; in our current code the server exits if DB connection fails at boot. In production we'd move to a retry/backoff and graceful degraded mode for public endpoints."

3) Gateway process crash or single-instance failure
- Symptom: Container or process crash.
- Immediate effect: Single gateway instance is a single point of failure; clients lose access to all backend services until container restart.
- Interview phrasing: "Currently we run a single gateway container in Compose; for HA we'd run multiple gateway instances behind a load balancer and make circuit state shared (e.g., Redis) so failover is seamless."

4) Backend service failures (user/post)
- Symptom: One or more replicas crash.
- Immediate effect: Health checks run every 10s; until next health check the gateway may continue to send requests to a failed replica. Circuit breaker is implemented in code but not integrated into proxy, so repeated failures are not short-circuited until healthcheck marks service unhealthy.
- Interview phrasing: "Because the circuit breaker isn't wired into the proxy, the gateway will keep trying failed services until the health check removes them; this is a gap we've identified and documented."

5) High latency cascading
- Symptom: Slow Redis/DB/backends.
- Immediate effect: Increased request latency, more concurrent requests pile up at the gateway, axios timeouts, elevated 5xx responses.
- Interview phrasing: "High downstream latency increases gateway concurrency and can cause timeouts; the gateway currently uses a 5s proxy timeout and logs errors."

6) Practical emergency steps (what ops should do)
- Scale Redis (add replicas or cluster) and restore from snapshot.
- Restart or scale gateway instances and add an external load balancer.
- Temporarily enable stricter throttling at the edge (WAF or cloud rate-limits) to protect backends.

7) One-liner for interviews
"If Redis is overwhelmed, our middleware falls back to a local in-memory token bucket per gateway instance—this preserves limited protection but is not globally consistent; downstream services will still be at risk until Redis is recovered or an edge throttle is applied."

---

Keep this file handy for short, precise answers in interviews.
