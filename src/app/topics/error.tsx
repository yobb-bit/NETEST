"use client";

export default function TopicsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="content reviewer-content state-page" role="alert"><p className="eyebrow">SOMETHING WENT WRONG</p><h1>Study topics didn’t load.</h1><p className="welcome-copy">Try loading the reviewer again.</p><button className="button-primary retry-button" onClick={reset}>Try again <span aria-hidden="true">↻</span></button></div>;
}
