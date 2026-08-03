import 'server-only'
import sanitizeHtml from 'sanitize-html'

// Moodle base (same env the client uses), e.g. https://lms.kodeclass.com
const MOODLE_URL = process.env.MOODLE_URL ?? ''

const proxy = (url: string) => `/api/course-file?url=${encodeURIComponent(url)}`

/**
 * Run over EVERY HTML field returned from Moodle (labels, page content, section
 * summaries, forum intros) before rendering.
 *
 *  1. Rewrites embedded Moodle file URLs — both the absolute `.../pluginfile.php/...`
 *     form and the `@@PLUGINFILE@@` placeholder — to our login-gated `/api/course-file`
 *     proxy, so inline images/media load (and the Moodle token stays server-side).
 *  2. Sanitizes. Content is self-authored (trusted), but this strips stray <script>
 *     from copy-pasted material and constrains iframes to the video hosts we embed.
 */
export function rewriteAndSanitize(html: string | null | undefined): string {
  if (!html) return ''

  const rewritten = html
    // @@PLUGINFILE@@ placeholder → real pluginfile endpoint, then caught by the proxy rewrite below.
    .replace(/@@PLUGINFILE@@/g, `${MOODLE_URL}/webservice/pluginfile.php`)
    // Absolute pluginfile.php refs (src/href) → proxy.
    .replace(
      /(src|href)=["']([^"']*\/pluginfile\.php\/[^"']+)["']/gi,
      (_m, attr, url) => `${attr}="${proxy(url)}"`,
    )

  return sanitizeHtml(rewritten, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'video', 'audio', 'source', 'iframe', 'figure', 'figcaption',
    ]),
    allowedAttributes: {
      '*': ['class', 'style', 'id'],
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      video: ['src', 'controls', 'width', 'height', 'poster'],
      audio: ['src', 'controls'],
      source: ['src', 'type'],
      iframe: ['src', 'width', 'height', 'allow', 'allowfullscreen', 'frameborder'],
    },
    // Only the video hosts we actually embed — never arbitrary iframes.
    allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
  })
}
