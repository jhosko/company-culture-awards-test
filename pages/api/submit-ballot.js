import crypto from "crypto";

const PERSONAL_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com"
]);

const GENERIC_PREFIXES = new Set([
  "info",
  "sales",
  "admin",
  "support",
  "contact",
  "hello",
  "office",
  "hr",
  "jobs",
  "careers",
  "billing",
  "accounts",
  "reception",
  "team",
  "inquiries"
]);

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value) {
  return clean(value).toLowerCase();
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashValue(value) {
  return crypto
    .createHash("sha256")
    .update(value)
    .digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      ok: false,
      error: "Method not allowed."
    });
  }

  try {
    const {
      company_name,
      industry,
      company_size,
      employee_name,
      work_email,
      top_category,
      second_category,
      third_category,
      culture_score,
      employee_comment,
      employee_confirmation
    } = req.body || {};

    const email = normalizeEmail(work_email);

    if (
      !clean(company_name) ||
      !clean(industry) ||
      !clean(company_size) ||
      !clean(employee_name) ||
      !email ||
      !clean(top_category) ||
      !clean(employee_comment)
    ) {
      return res.status(400).json({
        ok: false,
        error: "Please complete all required fields."
      });
    }

    if (employee_confirmation !== true) {
      return res.status(400).json({
        ok: false,
        error: "Please confirm that you currently work for this company."
      });
    }

    if (!validEmail(email)) {
      return res.status(400).json({
        ok: false,
        error: "Please enter a valid work email address."
      });
    }

    const [prefix, domain] = email.split("@");

    if (PERSONAL_EMAIL_DOMAINS.has(domain)) {
      return res.status(400).json({
        ok: false,
        error:
          "Please use your company email address. Personal email addresses are not eligible."
      });
    }

    if (GENERIC_PREFIXES.has(prefix)) {
      return res.status(400).json({
        ok: false,
        error:
          "Please use your individual company email address rather than a shared or general inbox."
      });
    }

    const score = Number(culture_score);

    if (!Number.isInteger(score) || score < 1 || score > 100) {
      return res.status(400).json({
        ok: false,
        error: "Culture score must be between 1 and 100."
      });
    }

    const categories = [
      clean(top_category),
      clean(second_category),
      clean(third_category)
    ].filter(Boolean);

    if (new Set(categories).size !== categories.length) {
      return res.status(400).json({
        ok: false,
        error: "Please select different culture categories."
      });
    }

    const allowedCompanySizes = new Set([
      "Small (10 to 49 employees)",
      "Medium (50 to 249 employees)",
      "Large (250 or more employees)"
    ]);

    if (!allowedCompanySizes.has(clean(company_size))) {
      return res.status(400).json({
        ok: false,
        error: "Please select a valid company size."
      });
    }

    const forwardedFor = req.headers["x-forwarded-for"];
    const ip =
      typeof forwardedFor === "string"
        ? forwardedFor.split(",")[0].trim()
        : req.socket?.remoteAddress || "";

    const ipHash = ip ? hashValue(ip) : null;

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenHash = hashValue(verificationToken);

    const verificationExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Supabase environment variables are missing.");

      return res.status(500).json({
        ok: false,
        error: "The ballot service is temporarily unavailable."
      });
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/ballots`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        company_name: clean(company_name),
        industry: clean(industry),
        company_size: clean(company_size),

        employee_name: clean(employee_name),
        work_email: email,

        top_category: clean(top_category),
        second_category: clean(second_category) || null,
        third_category: clean(third_category) || null,

        culture_score: score,
        employee_comment: clean(employee_comment),

        employee_confirmation: true,

        verification_status: "pending",
        verification_token_hash: verificationTokenHash,
        verification_expires_at: verificationExpiresAt,

        review_status: "normal",

        ip_hash: ipHash,
        user_agent: clean(req.headers["user-agent"])
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Supabase ballot insert failed:", result);

      if (response.status === 409 || result?.code === "23505") {
        return res.status(409).json({
          ok: false,
          error:
            "A ballot has already been submitted using this work email address."
        });
      }

      return res.status(500).json({
        ok: false,
        error: "We could not save your ballot. Please try again."
      });
    }

    /*
      IMPORTANT:

      The ballot is now safely stored as PENDING.

      In our next step we will connect the transactional email service
      and send verificationToken to the employee in a verification URL.

      We deliberately do NOT return the verification token to the browser.
    */

    return res.status(201).json({
      ok: true,
      message:
        "Your ballot has been received. You will need to verify your work email before your vote is counted."
    });
  } catch (error) {
    console.error("Ballot submission error:", error);

    return res.status(500).json({
      ok: false,
      error: "Something went wrong. Please try again."
    });
  }
}
