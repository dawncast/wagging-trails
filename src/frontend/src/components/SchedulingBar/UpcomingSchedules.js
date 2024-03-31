import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const myDogs = [
  { id: 1, name: "dog1", href: "#", initial: "H", current: false },
  { id: 2, name: "dog2", href: "#", initial: "T", current: false },
  { id: 3, name: "dog3", href: "#", initial: "W", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UpcomingSchedules() {
  return (
    <li>
      <div className="text-sm font-semibold leading-6 text-indigo-200">
        Upcoming Schedules
      </div>
      <ul className="-mx-2 mt-2 space-y-1">
        {myDogs.map((team) => (
          <li key={team.name}>
            <a
              href={team.href}
              className={classNames(
                team.current
                  ? "bg-indigo-700 text-white"
                  : "text-indigo-200 hover:text-white hover:bg-indigo-700",
                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
              )}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                {team.initial}
              </span>
              <span className="truncate">{team.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}
