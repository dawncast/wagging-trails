import { Fragment } from 'react'
import React, { useState, useEffect } from "react";
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";






export default function Example() {
let ownerID = 1;
const [notification, setNotification] = useState([]);



useEffect(() => {
  fetch(`http://localhost:8800/recieves-notif/${ownerID}`)
    .then((response) => response.json())
    .then((data) => {
      setNotification(data.data);
      console.log("Fetched notification:",data.data);
    })
    .catch((error) => console.error("Error fetching notification", error));
}, []);

console.log("notification" + notification);

const solutions = [
  { name: 'Blog', description: 'Learn about tips, product updates and company culture', href: '#' },
  {
    name: 'Help center',
    description: 'Get all of your questions answered in our forums of contact support',
    href: '#',
  },
  { name: 'Guides', description: 'Learn how to maximize our platform to get the most out of it', href: '#' },
  { name: 'Events', description: 'Check out webinars with experts and learn about our annual conference', href: '#' },
  { name: 'Security', description: 'Understand how we take your privacy seriously', href: '#' },
]

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
      <BellIcon className="h-6 w-6" aria-hidden="true"/>
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
          <div className="w-screen max-w-sm flex-auto rounded-3xl bg-white p-4 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
          {notification.map((item) => (
            <div key={item.notificationid} className="relative rounded-lg p-4 hover:bg-gray-50">
              <p className="font-semibold text-gray-900">{item.notifcontent}</p>
              {/* You can include additional data from the item here */}
            </div>
          ))}
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
