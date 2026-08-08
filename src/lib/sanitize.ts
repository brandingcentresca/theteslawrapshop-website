import sanitizeHtml from "sanitize-html";

// Blog post content is authored as HTML in the admin WYSIWYG editor and stored
// in the database. It is always run through this allow-list before rendering so
// a compromised/edited row can never inject scripts, event handlers, iframes,
// or javascript: URLs into the public site.
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "u", "s", "del", "mark", "sub", "sup",
    "blockquote", "code", "pre",
    "ul", "ol", "li",
    "a", "img",
    "table", "thead", "tbody", "tr", "th", "td",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https"] },
  // Force safe rel/target on every link regardless of what was stored.
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        target: "_blank",
        rel: "noopener noreferrer nofollow",
      },
    }),
  },
  // Drop the contents of any disallowed tag entirely (e.g. <script>…</script>).
  disallowedTagsMode: "discard",
  nonTextTags: ["script", "style", "textarea", "option", "noscript"],
};

export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html ?? "", OPTIONS);
}
