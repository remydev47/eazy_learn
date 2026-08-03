"use client";

/**
 * Blocks right-click / long-press "Save" on the media it wraps. A light deterrent
 * against casual downloading — it can't stop screen capture or dev-tools, nothing in
 * a browser can. Kept as a tiny client island so the surrounding player stays server.
 */
export default function NoContextMenu({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className} onContextMenu={(e) => e.preventDefault()}>
      {children}
    </div>
  );
}
