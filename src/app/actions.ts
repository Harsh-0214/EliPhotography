"use server";

import { Resend } from "resend";
import { services, site } from "@/lib/site";
import type { BookingField, BookingState } from "@/lib/booking";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_SHOOT_TYPES = new Set(services.map((service) => service.slug));

/** Null in any environment without a key (e.g. local dev) — the enquiry is
 * still logged in that case, just not emailed. See README → "Wiring up the
 * form". */
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function submitBooking(
  _previous: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const value = (field: BookingField) =>
    String(formData.get(field) ?? "").trim();

  const enquiry = {
    name: value("name"),
    email: value("email"),
    shootType: value("shootType"),
    date: value("date"),
    message: value("message"),
  };

  const errors: BookingState["errors"] = {};

  if (enquiry.name.length < 2) {
    errors.name = "Enter the name the session should be booked under.";
  }
  if (!EMAIL.test(enquiry.email)) {
    errors.email = "Enter an email address Elish can reply to.";
  }
  if (!VALID_SHOOT_TYPES.has(enquiry.shootType)) {
    errors.shootType = "Choose the kind of session you have in mind.";
  }
  if (enquiry.date) {
    const chosen = new Date(`${enquiry.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(chosen.getTime())) {
      errors.date = "Use the date picker to choose a day.";
    } else if (chosen < today) {
      errors.date = "Choose a date that hasn't passed yet.";
    }
  }
  if (enquiry.message.length < 10) {
    errors.message = "Add a sentence or two about what you're planning.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", errors };
  }

  const shootName = services.find((s) => s.slug === enquiry.shootType)?.name ?? enquiry.shootType;

  if (resend) {
    const { error } = await resend.emails.send({
      from: process.env.BOOKING_FROM_EMAIL ?? "Elish Modi Photography <onboarding@resend.dev>",
      to: site.email,
      replyTo: enquiry.email,
      subject: `New enquiry: ${shootName} — ${enquiry.name}`,
      text: [
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Shoot type: ${shootName}`,
        `Preferred date: ${enquiry.date || "Not specified"}`,
        "",
        enquiry.message,
      ].join("\n"),
    });

    // A delivery hiccup shouldn't strand the person who just filled out the
    // form — they've done everything right, and site.email/phone are on
    // screen as a backup. Log loudly so it's caught from the hosting
    // provider's function logs, and keep the enquiry itself recoverable.
    if (error) {
      console.error("[booking enquiry] Resend send failed", error);
      console.info("[booking enquiry]", enquiry);
    }
  } else {
    console.warn(
      "[booking enquiry] RESEND_API_KEY is not set — enquiry logged only, not emailed. See README → \"Wiring up the form\".",
    );
    console.info("[booking enquiry]", enquiry);
  }

  return { status: "success", errors: {} };
}
