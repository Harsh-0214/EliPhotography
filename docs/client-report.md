# Elish Modi Photography — Website Report

_Prepared by Strive Web Design_

## Thank you

Thank you for building your website with Strive Web Design. This document
is a plain-language handoff report covering how your site works, what
protects it and your visitors, and what we did to help keep your photos
from being casually saved by people browsing the site. Nothing here
requires you to know any code — that's the point.

## What your website does

Your site is a fast, modern portfolio: a homepage that opens on your work,
a filterable gallery of every session, a reviews section where each client
can open their own photo album, and a booking form that emails enquiries
straight to your inbox. It's built the same way sites for major brands are
built today, and hosted on Vercel, one of the most widely used and
reliable hosting platforms for sites like this.

## Where it lives and why that's reliable

Your site is hosted on **Vercel**. Practically, that means:
- Every visit is served securely (HTTPS) automatically — no setup needed.
- Vercel spreads your site across a global network, so it loads quickly
  wherever a visitor is.
- Vercel actively defends against common attacks (like traffic floods
  aimed at knocking a site offline) at the network level, before traffic
  ever reaches your site's code.

## Protecting your photos

We know privacy around your work matters, so we added several layers that
make it noticeably harder for a casual visitor to save your photos:

- **Right-click "Save image" is disabled** on every photo.
- **Dragging a photo off the page to save it is disabled.**
- **On iPhone, holding down on a photo no longer offers "Save to Photos."**
  This is the one most people don't expect to be fixable, and it is.

**One honest note:** no website — ours, or any professional photography
platform — can make an image 100% impossible to save. A browser has to
receive the picture to show it to a visitor, and a technically
determined person can always find a way around visual protections. What
we've built removes every *casual* path to saving your work, which is
what actually matters day to day. If you'd like to go further later — for
example, capping the resolution shown on the site, or adding a subtle
watermark — that's a straightforward follow-up whenever you're ready.

## Protecting your site and your visitors

We ran a full security review and put several protections in place:

- **Security headers** on every page — these are instructions your site
  sends to every visitor's browser that shut down several common attack
  techniques (clickjacking, content-sniffing tricks, and more) before they
  can do anything.
- **A Content Security Policy** — a strict allowlist of exactly what's
  allowed to run on your site, which is one of the strongest defenses
  against malicious scripts ever getting a foothold.
- **All the photo/data handling stays server-side** — nothing sensitive
  (like your email service credentials) is ever visible to visitors or
  exposed in the site's code.
- **Zero known security vulnerabilities** in any of the software packages
  the site is built on, checked and confirmed as of this report, with
  automated weekly checks going forward so this doesn't quietly go stale.

## What's already done vs. what's next

**Done:**
- Security headers and Content Security Policy, sitewide.
- Photo-saving deterrents (right-click, drag, iPhone long-press).
- Full dependency security check — clean.
- Automated weekly checks for newly discovered vulnerabilities in the
  software the site depends on.

**Planned for next session (not yet built):**
- Spam/bot protection on the booking form. Right now, the form works
  correctly for real visitors, but there's no defense yet against an
  automated script submitting it repeatedly. This is scoped and ready to
  build whenever you'd like to schedule it — it doesn't put anything at
  risk in the meantime, it just means we're not done hardening that one
  piece yet.

## Questions or changes

If you'd like anything adjusted — new photos, copy changes, additional
protections, or anything else — just reach out to Strive Web Design and
we'll take it from there.
