import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How The Tesla Wrap Shop collects, uses and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container-x max-w-3xl py-16 md:py-24">
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-4 text-muted">
        Last updated {new Date().getFullYear()}. This policy explains how{" "}
        {site.name} collects, uses and safeguards your information.
      </p>

      <div className="prose-tws mt-10">
        <h2>Who we are</h2>
        <p>
          Our website address is {site.url}. If you have any questions about this
          policy, contact us at {site.email} or {site.phone}.
        </p>

        <h2>Information we collect</h2>
        <p>
          When you submit a quote request or contact form, we collect the
          information you provide — such as your name, email address, phone
          number, Tesla model and any photos or messages you send. When you leave
          a comment or otherwise interact with the site, we may also collect your
          IP address and browser user-agent string to help with spam detection.
        </p>

        <h2>How we use your information</h2>
        <p>
          We use the information you provide solely to respond to your enquiry,
          prepare a quote, schedule your service and communicate with you about
          your project. We do not sell your personal information.
        </p>

        <h2>Media</h2>
        <p>
          If you upload images to the website, please avoid uploading images with
          embedded location (EXIF GPS) data, as visitors can download and extract
          that data.
        </p>

        <h2>Cookies</h2>
        <p>
          Our site may use cookies to remember your preferences and improve your
          browsing experience. You can disable cookies in your browser settings,
          though some features may not function as intended.
        </p>

        <h2>Embedded content from other websites</h2>
        <p>
          Articles on this site may include embedded content (for example maps or
          videos). Embedded content from other websites behaves in the exact same
          way as if you had visited the other website, which may collect data
          about you, use cookies and monitor your interaction with that content.
        </p>

        <h2>How long we retain your data</h2>
        <p>
          Quote requests and messages are retained so we can follow up and keep a
          record of the services we&apos;ve discussed or provided. You can request
          removal of your personal data at any time.
        </p>

        <h2>Your rights over your data</h2>
        <p>
          You can request a copy of the personal data we hold about you, or ask us
          to erase it — excluding any data we are required to keep for legal,
          administrative or security purposes. To make a request, contact us at{" "}
          {site.email}.
        </p>

        <h2>Messaging terms &amp; privacy</h2>
        <p>
          By providing your phone number you agree to receive informational
          messages related to your enquiry. Message and data rates may apply, and
          you can opt out at any time by replying STOP. No mobile information will
          be shared with third parties or affiliates for marketing or promotional
          purposes.
        </p>

        <h2>Contact us</h2>
        <p>
          {site.name}
          <br />
          Phone: {site.phone}
          <br />
          Email: {site.email}
        </p>
      </div>
    </div>
  );
}
