/**
 * The login-screen logo. The client should see his own brand when he opens
 * the panel, not the CMS vendor's.
 */
export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
      <Mark size={38} />
      <span
        style={{
          fontFamily: "Amiri, 'Times New Roman', serif",
          fontSize: 34,
          lineHeight: 1,
          paddingBottom: 4,
          color: "#1b1a17",
        }}
      >
        الرواد
      </span>
    </div>
  );
}

/** The sidebar mark. */
export function Icon() {
  return <Mark size={22} />;
}

/** The survey benchmark: corner brackets, a reticle, one datum line. */
function Mark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="#9a6b3f"
      strokeWidth="1.3"
      aria-hidden="true"
    >
      <path d="M4 4h5M4 4v5M28 4h-5M28 4v5M4 28h5M4 28v-5M28 28h-5M28 28v-5" />
      <circle cx="16" cy="16" r="6.2" />
      <path d="M16 6.6v18.8M6.6 16h18.8" />
      <path d="M2 21.6h28" strokeWidth="1.7" />
    </svg>
  );
}
