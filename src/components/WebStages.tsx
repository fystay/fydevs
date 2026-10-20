/*
 * Four steps, no surprises: the same website at each step, from sticky notes to live.
 * Phones swipe through them; wider screens show all four in a row.
 * Everything inside the screens is an example.
 */

const STAGES = [
  { id: "enquire", title: "Enquire", line: "Tell us what you need." },
  { id: "scope", title: "Scope", line: "A fixed price, in writing." },
  { id: "build", title: "Build", line: "Designed and built with you." },
  { id: "launch", title: "Launch", line: "Live, handed over, supported." },
] as const;

function Screen({ stage }: { stage: (typeof STAGES)[number]["id"] }) {
  if (stage === "enquire")
    return (
      <div className="bs-notes">
        <span style={{ rotate: "-4deg" }}>Our site breaks on phones</span>
        <span style={{ rotate: "3deg" }}>Enquiries go nowhere</span>
        <span style={{ rotate: "-2deg" }}>Nobody finds us on Google</span>
      </div>
    );
  const real = stage !== "scope";
  return (
    <>
      {stage === "launch" && <div className="bs-live">You&apos;re live</div>}
      <div className="ws-url">
        {real ? (stage === "launch" ? "oakandember.co.uk" : "preview.oakandember.co.uk") : <i className="bs-bar" style={{ width: "60%" }} />}
      </div>
      <div className="ws-nav">
        {real ? <b>Oak &amp; Ember</b> : <i className="bs-bar" style={{ width: "35%" }} />}
        <i className="ws-menu" />
      </div>
      <div className="ws-photo">{stage === "build" && <span className="ws-note">Warmer photo?</span>}</div>
      {real ? (
        <>
          <b className="ws-title">Wood-fired, all day.</b>
          <span className="ws-btn">Book a table</span>
        </>
      ) : (
        <>
          <i className="bs-bar" style={{ width: "75%", height: "1.1em" }} />
          <span className="bs-price">Fixed price, in writing</span>
        </>
      )}
    </>
  );
}

export function WebStages() {
  return (
    <ol role="list" className="bs bs--web" tabIndex={0} aria-label="How a website project runs, step by step">
      {STAGES.map((s, i) => (
        <li key={s.id} className="bs__stage" data-stage={s.id}>
          <div className="bs__screen" aria-hidden="true">
            <div className="bs__inner">
              <Screen stage={s.id} />
            </div>
          </div>
          <span className="bs__num">{String(i + 1).padStart(2, "0")}</span>
          <h3>{s.title}</h3>
          <p>{s.line}</p>
        </li>
      ))}
    </ol>
  );
}
