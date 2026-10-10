import Link from "next/link";

export default function TopicNotFound() {
  return <div className="content reviewer-content state-page"><p className="eyebrow">TOPIC NOT FOUND</p><h1>That study area isn’t here.</h1><p className="welcome-copy">It may have moved, or the address may be incomplete.</p><Link className="button-primary" href="/topics">Browse study topics <span aria-hidden="true">→</span></Link></div>;
}
