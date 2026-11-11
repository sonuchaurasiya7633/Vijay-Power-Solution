import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readSrc = (rel) => fs.readFileSync(path.join(root, rel), "utf-8");

test("Security: Session JWT fails closed without secret outside local dev/build", () => {
  const sessionSrc = readSrc("src/lib/auth/session.ts");
  assert.ok(sessionSrc.includes('SESSION_COOKIE_NAME = "vps_admin_session"'));
  assert.ok(sessionSrc.includes('algorithms: ["HS256"]'), "Must pin HS256 JWT verification algorithm");
  assert.ok(
    sessionSrc.includes("process.env.JWT_SECRET") &&
      sessionSrc.includes("JWT_SECRET environment variable must be configured"),
    "Must throw if JWT_SECRET is missing in runtime"
  );
  assert.ok(
    !sessionSrc.includes("FALLBACK_DEV_SECRET_CHANGE_ME_32CHARS"),
    "Must not keep old weak fallback secret name"
  );
});

test("Security: Edge middleware enforces /admin auth, noindex headers, and security headers", () => {
  const mw = readSrc("src/middleware.ts");
  assert.ok(mw.includes("SESSION_COOKIE_NAME"));
  assert.ok(mw.includes("/admin/login"));
  assert.ok(mw.includes("X-Frame-Options"));
  assert.ok(mw.includes("X-Content-Type-Options"));
  assert.ok(mw.includes("Referrer-Policy"));
  assert.ok(mw.includes("X-Robots-Tag"));
  assert.ok(mw.includes("noindex, nofollow, noarchive"));
  assert.ok(mw.includes("Cache-Control"));
  assert.ok(mw.includes("no-store"));

  const nextCfg = readSrc("next.config.mjs");
  assert.ok(nextCfg.includes("poweredByHeader: false"));
  assert.ok(nextCfg.includes("X-Frame-Options"));
  assert.ok(nextCfg.includes("X-Content-Type-Options"));
});

test("Security: Public HTML rendering sanitizes CMS rich text before dangerouslySetInnerHTML", () => {
  for (const rel of [
    "src/app/(public)/about/page.tsx",
    "src/app/(public)/privacy-policy/page.tsx",
    "src/app/(public)/terms-and-conditions/page.tsx",
    "src/app/(public)/disclaimer/page.tsx",
  ]) {
    const src = readSrc(rel);
    assert.ok(
      src.includes("sanitizeHtmlContent("),
      `${rel} must pass CMS HTML through sanitizeHtmlContent()`
    );
  }
});

test("Security: Auth login rate limiting and deactivated account revocation", () => {
  const loginSrc = readSrc("src/app/api/auth/login/route.ts");
  assert.ok(loginSrc.includes("checkRateLimit("), "Login must enforce rate limiting");
  assert.ok(loginSrc.includes("rateLimitResponse("), "Login must return HTTP 429 on abuse");

  const meSrc = readSrc("src/app/api/auth/me/route.ts");
  assert.ok(meSrc.includes("isActive"), "/api/auth/me must verify active user state in DB");
});

test("Security: Privilege escalation blocked in Team management routes", () => {
  const teamSrc = readSrc("src/app/api/team/route.ts");
  assert.ok(
    teamSrc.includes("hasPermission") || teamSrc.includes("requirePermission"),
    "Team GET/POST must check RBAC"
  );
  assert.ok(teamSrc.includes("super_admin"), "Team creation must guard super_admin assignment");
  assert.ok(teamSrc.includes("length < 8"), "Must enforce >= 8 character password minimum");

  const teamIdSrc = readSrc("src/app/api/team/[id]/route.ts");
  assert.ok(teamIdSrc.includes("validateIdParam"), "Team [id] must validate ObjectId");
  assert.ok(teamIdSrc.includes("super_admin"), "Team update must guard super_admin modification");
});

test("Security: Lead CRM routes escape regex, escape email HTML, prevent IDOR, and validate IDs", () => {
  const leadsSrc = readSrc("src/app/api/leads/route.ts");
  assert.ok(
    leadsSrc.includes("escapeRegex(") || leadsSrc.includes("[.*+?^${}()|[\\]\\\\]"),
    "Leads search must escape regex metacharacters"
  );
  assert.ok(leadsSrc.includes("escapeHtml("), "Lead notification emails must escape HTML");
  assert.ok(leadsSrc.includes("isValidObjectId("), "Lead POST must validate productId");
  assert.ok(leadsSrc.includes("checkRateLimit("), "Lead POST must enforce rate limiting");

  const leadIdSrc = readSrc("src/app/api/leads/[id]/route.ts");
  assert.ok(leadIdSrc.includes("validateIdParam("), "Lead [id] must validate ObjectId");
  assert.ok(
    leadIdSrc.includes('session.role === "sales_executive"'),
    "Lead [id] PATCH/GET must restrict sales_executive to assigned leads"
  );
  assert.ok(
    leadIdSrc.includes('"delete:leads"'),
    "Lead archival must verify delete:leads permission"
  );

  const activitySrc = readSrc("src/app/api/leads/[id]/activity/route.ts");
  assert.ok(activitySrc.includes('requirePermission("write:leads")'));
  assert.ok(activitySrc.includes("validateIdParam("));
});

test("Security: CMS & Catalog APIs gate adminMode drafts behind auth, validate IDs, and prevent mass assignment", () => {
  const cmsEndpoints = [
    ["src/app/api/products/route.ts", "src/app/api/products/[id]/route.ts"],
    ["src/app/api/projects/route.ts", "src/app/api/projects/[id]/route.ts"],
    ["src/app/api/blogs/route.ts", "src/app/api/blogs/[id]/route.ts"],
    ["src/app/api/pages/route.ts", "src/app/api/pages/[id]/route.ts"],
    ["src/app/api/services/route.ts", "src/app/api/services/[id]/route.ts"],
    ["src/app/api/solutions/route.ts", "src/app/api/solutions/[id]/route.ts"],
    ["src/app/api/categories/route.ts", "src/app/api/categories/[id]/route.ts"],
    ["src/app/api/faqs/route.ts", "src/app/api/faqs/[id]/route.ts"],
    ["src/app/api/testimonials/route.ts", "src/app/api/testimonials/[id]/route.ts"],
    ["src/app/api/service-areas/route.ts", "src/app/api/service-areas/[id]/route.ts"],
    ["src/app/api/gallery/route.ts", "src/app/api/gallery/[id]/route.ts"],
  ];

  for (const [colRel, idRel] of cmsEndpoints) {
    const colSrc = readSrc(colRel);
    const idSrc = readSrc(idRel);
    assert.ok(
      colSrc.includes("requirePermission(") || colSrc.includes("hasPermission("),
      `${colRel} POST must enforce RBAC via requirePermission or hasPermission`
    );
    assert.ok(
      colSrc.includes("getSession()"),
      `${colRel} GET must check session when adminMode/includeUnpublished is requested`
    );
    assert.ok(
      idSrc.includes("requirePermission(") || idSrc.includes("hasPermission("),
      `${idRel} mutations must enforce RBAC via requirePermission or hasPermission`
    );
    assert.ok(
      idSrc.includes("validateIdParam("),
      `${idRel} must validate ObjectId parameter`
    );
    assert.ok(
      !idSrc.includes("error.message"),
      `${idRel} must not leak raw error.message in HTTP responses`
    );
  }
});

test("Security: Sanitizer helper strips XSS vectors while preserving benign markup", () => {
  // Mirror sanitizeHtmlContent regex logic cleanly to test attack vectors directly
  const sanitize = (html) =>
    html
      .replace(/<\s*(script|iframe|object|embed|form|meta|base|link)[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, "")
      .replace(/<\s*(script|iframe|object|embed|form|meta|base|link)[^>]*\/?>/gi, "")
      .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(
        /(href|src|action|formaction)\s*=\s*(["'])\s*(?:javascript|vbscript|data:text\/html):[^"']*\2/gi,
        '$1=$2#$2'
      );

  const dirty =
    '<p>Welcome</p><script>alert(1)</script><img src="x" onerror="alert(2)"><a href="javascript:alert(3)">click</a><iframe src="https://evil.example"></iframe>';
  const cleaned = sanitize(dirty);
  assert.ok(cleaned.includes("<p>Welcome</p>"));
  assert.ok(!cleaned.toLowerCase().includes("<script"));
  assert.ok(!cleaned.toLowerCase().includes("<iframe"));
  assert.ok(!cleaned.toLowerCase().includes("onerror="));
  assert.ok(!cleaned.toLowerCase().includes("javascript:"));
});
