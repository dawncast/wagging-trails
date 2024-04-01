import { useState, useEffect } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UpcomingSchedules() {
  const ownerID = 1;
  const [schedules, setSchedules] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8800/notification/walk-task/${ownerID}`)
      .then((response) => response.json())
      .then((data) => setSchedules(data))
      .catch((error) => console.error("Error fetching post:", error));
  }, [ownerID]);

  if (!schedules) {
    return <div>Loading...</div>;
  }

  console.log("Schedules state:", schedules);

  return (
    <li>
      <div className="flex justify-center mb-6">
        {" "}
        <button
          onClick={null}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded-lg"
        >
          {" "}
          Schedule a Task!
        </button>
      </div>
      <div className="text-sm font-semibold leading-6 text-indigo-200">
        Upcoming Tasks
      </div>
      <ul className="-mx-2 mt-2 space-y-1">
        {schedules.data.map((walk) => (
          <li key={walk.taskid}>
            <a
              href={`#task-${walk.taskid}`}
              className={classNames(
                "text-indigo-200 hover:text-white hover:bg-indigo-700",
                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                {walk.dogname[0].toUpperCase()}
              </span>

              {walk.walkeventtype !== null ? (
                <span>
                  {walk.walkeventtype} with {walk.dogname}
                </span>
              ) : (
                <span>Schedule with {walk.dogname}</span>
              )}
              {walk.date !== null ? (
                <span className="truncate">
                  {new Date(walk.date).toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                  })}{" "}
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}
