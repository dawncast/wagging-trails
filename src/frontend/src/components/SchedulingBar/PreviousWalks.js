import { useState, useEffect } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function PreviousWalks() {
  const ownerID = 1;
  const [walks, setWalks] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8800/walk/${ownerID}`)
      .then((response) => response.json())
      .then((data) => setWalks(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [ownerID]);

  if (!walks) {
    return <div>Loading...</div>;
  }

  console.log("Walks state:", walks);

  return (
    <li>
      <div className="text-sm font-semibold leading-6 text-indigo-200">
        Previous Walks
      </div>
      <ul className="-mx-2 mt-2 space-y-1">
        {walks.data.map((walk) => (
          <li key={walk.walkid}>
            <a
              href={
                walk.postid !== null
                  ? `/post/${walk.ownerid}/${walk.postid}`
                  : `#walk-${walk.walkid}`
              }
              className={classNames(
                "text-indigo-200 hover:text-white hover:bg-indigo-700",
                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              )}
            >
              {/*Check if it's a meetup or not*/}
              {walk.meetupid !== null ? (
                <>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                    {walk.name[0].toUpperCase()}
                  </span>
                  <span className="truncate">
                    {new Date(walk.date).toLocaleDateString()} meetup
                  </span>
                </>
              ) : (
                <>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                    {walk.name[0].toUpperCase()}
                  </span>
                  <span className="truncate">
                    {new Date(walk.date).toLocaleDateString()} {walk.name}
                  </span>
                </>
              )}
              {/*check if it has a post already*/}
              {walk.postid !== null ? (
                <div className="ml-auto hover:text-gray-100 text-gray-300 font-bold py-1 px-2 text-xs">
                  View
                </div>
              ) : (
                <div className="ml-auto hover:text-gray-100 text-gray-300 font-bold py-1 px-2 text-xs">
                  Post
                </div>
              )}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}
