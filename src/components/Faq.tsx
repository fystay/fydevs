import { faqs } from "@/lib/faq";

/** Accessible accordion built on <details>, so it works without JavaScript. */
export function Faq() {
  return (
    <div className="faq">
      {faqs.map((item) => (
        <details key={item.q} className="faq__item">
          <summary>
            <span>{item.q}</span>
            <span className="faq__icon" aria-hidden="true" />
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
