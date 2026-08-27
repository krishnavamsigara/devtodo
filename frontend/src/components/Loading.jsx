export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="loading-container" role="status">
      <span>⏳ {message}</span>
    </div>
  );
}
