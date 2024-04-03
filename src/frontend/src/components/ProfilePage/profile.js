import { Fragment, useState } from "react";
import PostCardForProfile from "../../components/HomePage/Feed.js";
import SideBarEdit from "../../components/HomePage/SidebarEdit";

const secondaryNavigation = [
  { name: "Overview", href: "#", current: true },
  { name: "Posts", href: "/my-posts", current: false },
  { name: "Friends", href: "/my-friends", current: false },
  { name: "Dogs", href: "/my-dogs", current: false },
];
const stats = [
  { name: "Number of deploys", value: "405" },
  { name: "Average deploy time", value: "3.65", unit: "mins" },
  { name: "Number of servers", value: "3" },
  { name: "Success rate", value: "98.5%" },
];

const statuses = {
  Completed: "text-green-400 bg-green-400/10",
  Error: "text-rose-400 bg-rose-400/10",
};
const activityItems = [
  {
    user: {
      name: "Michael Foster",
      imageUrl:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    commit: "2d89f0c8",
    branch: "main",
    status: "Completed",
    duration: "25s",
    date: "45 minutes ago",
    dateTime: "2023-01-23T11:00",
  },
  // More items...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Profile({ posts, friends, dogs }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [post, setPost] = useState(posts);

  console.log("posts" , post);
  return (
    <>
      <main>
        <header>
          {/* Secondary navigation */}
          <nav className="flex overflow-x-auto border-b border-white/10 py-4">
            <ul
              role="list"
              className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
            >
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={item.current ? "text-indigo-400" : ""}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
{/* 
          <div>
            // <h2>Posts:</h2>
            // <pre>{JSON.stringify(posts, null, 2)}</pre>
            // <h2>Friends:</h2>
            // <pre>{JSON.stringify(friends, null, 2)}</pre>
            // <h2>Dogs:</h2>
            // <pre>{JSON.stringify(dogs, null, 2)}</pre>
            //{" "}
          </div> */}
          {/* Heading */}
          <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
            <div>
              <div className="flex items-center gap-x-3">
                <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                  <div className="h-2 w-2 rounded-full bg-current" />
                </div>
                <h1 className="flex gap-x-3 text-base leading-7">
                  <span className="font-semibold text-black">My Profile</span>
                  <span className="text-gray-600">/</span>
                  <span className="font-semibold text-black">basic info</span>
                </h1>
              </div>
              <p className="mt-2 text-xs leading-6 text-gray-400">
                
              </p>
            </div>
            <div className="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
              Complete
            </div>
          </div>
        </header>
      </main>
    </>
  );
}
