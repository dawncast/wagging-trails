import { React, Fragment, useState } from "react";
import SideBarEdit from "../../components/HomePage/SidebarEdit";
import PostCardForProfile from "./profilePosts";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  CalendarDaysIcon,
  CreditCardIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import {
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}



export default function Profile({
  ownerDetails,
  posts,
  friends,
  dogs,
  ownerID,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [postData, setPostData] = useState(posts.data);
  const [ownerInfo, setOwnerInfo] = useState(ownerDetails.data[0]);
  const [dogData, setDogData] = useState(dogs.data);
  const [editClicked, setEditClicked] = useState(false);

  const [newOwnerName, setNewOwnerName] = useState(ownerInfo.owner_name);
  const [newNumber, setNewNumber] = useState(ownerInfo.phonenumber);
  const [newEmail, setNewEmail] = useState(ownerInfo.email);

  


  const handleEditClick = () => {
    setEditClicked(!editClicked);
  }
  const handleNameChange = (e) => {
    setNewOwnerName(e.target.value);
  }

  const handlePhoneNumberChange = (e) => {
    setNewNumber(e.target.value);
  }

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  }





  console.log("post data", postData);

  return (
    <div className="lg:col-start-3 lg:row-end-1">
      {/* owner details */}
      <div className="flex gap-10">
        <h2 className="sr-only">Profile</h2>
        <div className="rounded-lg grid-cols-2 bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
          <dl className="flex flex-wrap">
            <div className="flex-auto pl-6 pt-6">
              <dt className="text-sm font-semibold leading-6 text-gray-900">
                Profile
              </dt>
              <dd className="mt-1 text-base font-semibold leading-6 text-gray-900"></dd>
            </div>
            <div className="flex-none self-end px-6 pt-4">
              <dt className="sr-only">Status</dt>
              <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                {editClicked ? (<button onClick={handleEditClick}>editing</button>): <button onClick={handleEditClick}>edit</button>}
              </dd>
            </div>
            <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
              <dt className="flex-none">
                <span className="sr-only">name</span>
                <UserCircleIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm font-medium leading-6 text-gray-900">
                {editClicked ? (
                  <input
                    type="text"
                    value={newOwnerName}
                    onChange={handleNameChange}
                  />
                ) : (
                  ownerInfo.owner_name
                )}
              </dd>
            </div>
            <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
              <dt className="flex-none">
                <span className="sr-only">Phone number</span>
                <PhoneIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm leading-6 text-gray-500">
                {editClicked ? (
                  <input
                    type="text"
                    value={newNumber}
                    onChange={handlePhoneNumberChange}
                  />
                ) : (
                  ownerInfo.phonenumber
                )}
              </dd>
            </div>
            <div className="mt-4 flex w-full flex-none gap-x-4 px-6">
              <dt className="flex-none">
                <span className="sr-only">Email</span>
                <EnvelopeIcon
                  className="h-6 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </dt>
              <dd className="text-sm leading-6 text-gray-500">
                {editClicked ? (
                  <input
                    type="text"
                    value={newEmail}
                    onChange={handleEmailChange}
                  />
                ) : (
                  ownerInfo.email
                )}
              </dd>
            </div>
          </dl>
          <div className="mt-6 px-2 py-2"></div>
        </div>
     
    

        {/* my dogs */}
        <h2 className="sr-only">My dogs</h2>
        <div className="rounded-lg grid-cols-2 flex-auto bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
          <dl className="flex flex-wrap">
            <div className="flex-auto pl-6 pt-6">
              <dt className="text-sm font-semibold leading-6 text-gray-900">
                My dogs
              </dt>
              <dd className="mt-1 text-base font-semibold leading-6 text-gray-900"></dd>
            </div>
            <div className="flex-none self-end px-6 pt-4">
              <dt className="sr-only">Status</dt>
              <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                edit
              </dd>
            </div>
            <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
              {dogData.map((dog, index) => [
                <dt key={`dt-${index}`} className="flex-none">
                  <span className="sr-only">Dogs</span>
                  <FaceSmileIcon className="h-6 w-5 text-gray-400" aria-hidden="true" />
                </dt>,
                <dd
                  key={`dd-${index}`}
                  className="text-sm font-medium leading-6 text-gray-900"
                >
                  {dog.name}
                </dd>,
              ])}
            </div>   
          </dl>
          <div className="mt-6 px-2 py-2"></div>
        </div>
      </div>

      {/* my posts */}
      <div className=" mt-10 rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5">
        <dl className="flex flex-wrap">
          <div className="flex-auto pl-6 pt-6">
            <dt className="text-sm font-semibold leading-6 text-gray-900">
              My Posts
            </dt>
            <dd className="mt-1 text-base font-semibold leading-6 text-gray-900"></dd>
          </div>

          <div className="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6">
            <PostCardForProfile data={postData} />
          </div>
        </dl>
      </div>
    </div>
  );
}
