import { Fragment, useState } from "react";
import PostCardForProfile from "../../components/HomePage/Feed.js";
import SideBarEdit from "../../components/HomePage/SidebarEdit";

const secondaryNavigation = [
  { name: "Overview", href: "/1", current: true },
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

export default function MyDogs({ posts, friends, dogs }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [post, setPost] = useState(posts);

  console.log("posts" , post);
  return (
    <>
      <main>
        {/* Activity list */}
        <div className="border-t border-white/10 pt-11">
          <h2 className="px-4 text-base font-semibold leading-7 text-black sm:px-6 lg:px-8">
            My Posts
          </h2>
          <table className="mt-6 w-full whitespace-nowrap text-left">
            <colgroup>
              <col className="w-full sm:w-4/12" />
              <col className="lg:w-4/12" />
              <col className="lg:w-2/12" />
              <col className="lg:w-1/12" />
              <col className="lg:w-1/12" />
            </colgroup>
            <thead className="border-b border-white/10 text-sm leading-6 text-black">
              <tr>
                <th
                  scope="col"
                  className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
                >
                  Commit
                </th>
                <th
                  scope="col"
                  className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
                >
                  Duration
                </th>
                <th
                  scope="col"
                  className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
                >
                  Deployed at
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
