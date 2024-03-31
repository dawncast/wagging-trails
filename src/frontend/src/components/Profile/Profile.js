export default function Profile({ posts, friends, dogs }) {
  return (
    <div>
      <h2>Posts:</h2>
      <pre>{JSON.stringify(posts, null, 2)}</pre>
      <h2>Friends:</h2>
      <pre>{JSON.stringify(friends, null, 2)}</pre>
      <h2>Dogs:</h2>
      <pre>{JSON.stringify(dogs, null, 2)}</pre>
    </div>
  );
}
