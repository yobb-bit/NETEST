export default function TopicsLoading() {
  return <div className="content reviewer-content" aria-label="Loading study topics" aria-busy="true"><div className="loading-line"/><div className="loading-grid">{Array.from({ length: 6 }, (_, index) => <div className="loading-card" key={index}/>)}</div></div>;
}
