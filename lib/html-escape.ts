/**
 * HTML entity escaping for values interpolated into outbound email bodies.
 *
 * Every caller here is building an HTML email out of untrusted, user-supplied
 * form input (names, messages, uploaded filenames). The recipient's mail client
 * renders that HTML, so an unescaped `<script>`/`<img onerror=...>` in a form
 * field is a live XSS sink pointed at the sales inbox rather than at the site.
 *
 * Shared by lib/lead-delivery.ts and lib/careers-delivery.ts so the two can
 * never drift apart on which characters they consider dangerous.
 */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}
