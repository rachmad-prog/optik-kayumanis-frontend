// Signature motif: a cinnamon-stick curl rendered as a repeating wave,
// used as a quiet section divider throughout the site.
export default function CurlDivider({ flip = false }) {
  return (
    <div className={`curl-divider ${flip ? "rotate-180" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 1200 48" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0,24 C100,4 200,44 300,24 C400,4 500,44 600,24 C700,4 800,44 900,24 C1000,4 1100,44 1200,24"
          fill="none"
          stroke="#EAA06E"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}
