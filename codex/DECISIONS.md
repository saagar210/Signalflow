# Decisions Log

1. **Documented backend test blocker rather than attempting environment-level package installs.**
   - Rationale: Host dependency (`glib-2.0`) is outside repo scope; changing environment would reduce reproducibility.
   - Alternative rejected: installing system libs ad hoc during session.

2. **Use declarative metadata (`required`) instead of expanding hard-coded key checks.**
   - Rationale: reduces drift risk and keeps requirements in node definitions.
   - Alternative rejected: adding more key names in `flowValidator.ts`.

3. **Mark expression-like config fields as required.**
   - Rationale: Empty expression/code values almost always indicate misconfiguration and should be warned pre-run.
   - Alternative rejected: keep optional and rely on runtime node errors only.

4. **Keep warnings as `severity: "warning"` even for required config emptiness.**
   - Rationale: preserves existing UX semantics and avoids introducing run-blocking behavior change.
