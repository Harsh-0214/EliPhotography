"use client";

import * as React from "react";
import { useActionState } from "react";
import { motion } from "motion/react";
import { SectionHeading } from "@/components/section-heading";
import { EASE, Reveal } from "@/components/motion/reveal";
import { ApertureMark } from "@/components/brand/aperture";
import { Button } from "@/components/ui/button";
import { FieldError, Input, Label, Textarea } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBooking } from "@/components/booking-provider";
import { submitBooking } from "@/app/actions";
import { initialBookingState } from "@/lib/booking";
import { services, site } from "@/lib/site";

export function Contact() {
  const { shootType, setShootType } = useBooking();
  const [state, formAction, pending] = useActionState(
    submitBooking,
    initialBookingState,
  );

  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const shootRef = React.useRef<HTMLButtonElement>(null);
  const dateRef = React.useRef<HTMLInputElement>(null);
  const messageRef = React.useRef<HTMLTextAreaElement>(null);

  // Send focus to the first field that needs attention, not to the top.
  React.useEffect(() => {
    if (state.status !== "error") return;
    const order = [
      [state.errors.name, nameRef],
      [state.errors.email, emailRef],
      [state.errors.shootType, shootRef],
      [state.errors.date, dateRef],
      [state.errors.message, messageRef],
    ] as const;
    order.find(([error]) => Boolean(error))?.[1].current?.focus();
  }, [state]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section
      id="contact"
      className="bg-ivory py-[var(--section-y)]"
    >
      <div className="shell grid gap-14 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)] lg:gap-24">
        <div>
          <SectionHeading
            kicker="Booking"
            title="Let’s put a date on it"
            standfirst="Tell me who the session is for and roughly when. I reply to every enquiry within two days."
          />

          <Reveal delay={0.1}>
            <dl className="mt-11 space-y-6 border-t border-ivory-3 pt-8">
              <div>
                <dt className="kicker-sm text-ink-muted">Email</dt>
                <dd className="mt-1.5">
                  <a
                    href={`mailto:${site.email}`}
                    className="display text-[1.15rem] text-ink underline decoration-brass/50 underline-offset-[6px] transition-[color,text-decoration-color] duration-200 hover:text-brass-deep hover:decoration-brass-deep"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="kicker-sm text-ink-muted">Phone</dt>
                <dd className="mt-1.5">
                  <a
                    href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                    className="display text-[1.15rem] text-ink underline decoration-brass/50 underline-offset-[6px] transition-[color,text-decoration-color] duration-200 hover:text-brass-deep hover:decoration-brass-deep"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="kicker-sm text-ink-muted">Studio</dt>
                <dd className="display mt-1.5 text-[1.15rem] text-ink">
                  {site.location}
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.05} className="lg:pt-2">
          {state.status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="flex flex-col items-start border border-brass/40 bg-ivory-2 p-8 md:p-11"
              role="status"
            >
              <ApertureMark className="h-8 w-8 text-brass-deep" strokeWidth={3} />
              <h3 className="display mt-6 text-[1.9rem] text-ink">
                Enquiry received
              </h3>
              <p className="mt-4 max-w-[42ch] text-[1.0625rem] leading-relaxed text-ink-muted">
                Thank you — it’s in. Elish replies to every enquiry within two
                days, usually with a couple of dates to choose from.
              </p>
            </motion.div>
          ) : (
            <form action={formAction} noValidate className="space-y-8">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">
                    Name <span className="text-brass-deep">*</span>
                  </Label>
                  <Input
                    ref={nameRef}
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(state.errors.name)}
                    aria-describedby={state.errors.name ? "name-error" : undefined}
                    placeholder="Your name"
                  />
                  <span id="name-error">
                    <FieldError>{state.errors.name}</FieldError>
                  </span>
                </div>

                <div>
                  <Label htmlFor="email">
                    Email <span className="text-brass-deep">*</span>
                  </Label>
                  <Input
                    ref={emailRef}
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(state.errors.email)}
                    aria-describedby={
                      state.errors.email ? "email-error" : undefined
                    }
                    placeholder="you@example.com"
                  />
                  <span id="email-error">
                    <FieldError>{state.errors.email}</FieldError>
                  </span>
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <Label htmlFor="shootType">
                    Shoot type <span className="text-brass-deep">*</span>
                  </Label>
                  <Select
                    name="shootType"
                    value={shootType}
                    onValueChange={setShootType}
                  >
                    <SelectTrigger
                      ref={shootRef}
                      id="shootType"
                      aria-invalid={Boolean(state.errors.shootType)}
                      aria-describedby={
                        state.errors.shootType ? "shootType-error" : undefined
                      }
                    >
                      {/* Radix reads the label from the open menu, which is
                          portalled away after a re-render — so the label is
                          passed explicitly and survives a failed submit. */}
                      <SelectValue placeholder="Choose a session">
                        {services.find(
                          (service) => service.slug === shootType,
                        )?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.slug} value={service.slug}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span id="shootType-error">
                    <FieldError>{state.errors.shootType}</FieldError>
                  </span>
                </div>

                <div>
                  <Label htmlFor="date">Preferred date</Label>
                  <Input
                    ref={dateRef}
                    id="date"
                    name="date"
                    type="date"
                    min={today}
                    className="[color-scheme:light]"
                    aria-invalid={Boolean(state.errors.date)}
                    aria-describedby={state.errors.date ? "date-error" : undefined}
                  />
                  <span id="date-error">
                    <FieldError>{state.errors.date}</FieldError>
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="message">
                  About the session <span className="text-brass-deep">*</span>
                </Label>
                <Textarea
                  ref={messageRef}
                  id="message"
                  name="message"
                  required
                  aria-invalid={Boolean(state.errors.message)}
                  aria-describedby={
                    state.errors.message ? "message-error" : undefined
                  }
                  placeholder="Who is it for, how many people, and where were you picturing it?"
                />
                <span id="message-error">
                  <FieldError>{state.errors.message}</FieldError>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-2">
                <Button type="submit" size="lg" disabled={pending}>
                  {pending ? "Sending…" : "Send enquiry"}
                </Button>
                <p className="kicker-sm text-ink-muted">
                  <span className="text-brass-deep">*</span> Required
                </p>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
