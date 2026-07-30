"use server";

import { services } from "@/lib/site";
import type { BookingField, BookingState } from "@/lib/booking";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const VALID_SHOOT_TYPES = new Set(services.map((service) => service.slug));

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

  /* TODO(client): connect a delivery provider here — Resend, Postmark or a
     form service. Until then the enquiry is only written to the server log,
     so nothing is emailed to anyone. See README.md → "Wiring up the form". */
  console.info("[booking enquiry]", enquiry);

  return { status: "success", errors: {} };
}
