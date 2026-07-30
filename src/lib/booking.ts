/* Shared between the booking form and its Server Action. It lives here
   rather than beside the action because a "use server" module may only
   export async functions. */

export type BookingField = "name" | "email" | "shootType" | "date" | "message";

export type BookingState = {
  status: "idle" | "success" | "error";
  errors: Partial<Record<BookingField, string>>;
};

export const initialBookingState: BookingState = {
  status: "idle",
  errors: {},
};
