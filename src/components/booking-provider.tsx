"use client";

import * as React from "react";
import { MotionConfig } from "motion/react";

type BookingContextValue = {
  shootType: string;
  /** Called from the rate card so the booking form arrives pre-filled. */
  setShootType: (slug: string) => void;
};

const BookingContext = React.createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [shootType, setShootType] = React.useState("");
  const value = React.useMemo(
    () => ({ shootType, setShootType }),
    [shootType],
  );

  return (
    <BookingContext.Provider value={value}>
      {/* reducedMotion="user" makes every motion component below drop
          transform and layout animation when the OS asks for it, while
          keeping opacity changes that carry meaning. */}
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = React.useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used inside <BookingProvider>");
  }
  return context;
}
