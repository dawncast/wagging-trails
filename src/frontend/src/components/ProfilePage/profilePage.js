import { PaperClipIcon } from "@heroicons/react/20/solid";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState, React } from "react";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(true);
  const [userData, setUserData] = useState(null);
  const [editedData, setEditedData] = useState({
    ...userData,
  });

  const handleEditClick = () => {
    if (isEditing) {
      setIsEditing(false);
      console.log("edit clicked");
    } else {
      setIsEditing(true);
    }
  };

  const handleUpdateClick = () => {
    setIsEditing(false); // Exit the editing mode
  };
  return (
    <div>
      {isEditing ? (
        <div className="px-4 sm:px-0">
          <>
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Edit Profile
            </h3>
            <div className="flex items-center space-x-1">
              <PencilSquareIcon
                className="h-6 w-5 hover:text-blue-600 text-gray-400"
                aria-hidden="true"
                onClick={handleEditClick}
              />
            </div>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Personal details
          </p>
          </>



          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Name{" "}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  defaultValue={editedData?.name || 'N/A'}
                  onChange={(v) => {
                    setEditedData({
                      ...editedData,
                      name: v.target.value,
                    });
                  }}
                />
              </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Email address
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  defaultValue={editedData?.email || 'N/A'}
                  onChange={(v) => {
                    setEditedData({
                      ...editedData,
                      email: v.target.value,
                    });
                  }}
                />
              </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Dogs
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  defaultValue={editedData?.dogName || 'N/A'}
                  onChange={(v) => {
                    setEditedData({
                      ...editedData,
                      dogName: v.target.value,
                    });
                  }}
                />
              </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Personal Bio
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  defaultValue={editedData?.bio || 'N/A'}
                  onChange={(v) => {
                    setEditedData({
                      ...editedData,
                      bio: v.target.value,
                    });
                  }}
                />
              </dd>
              </div>
            </dl>
          </div>
        </div>
      ) : (
        <div className="px-4 sm:px-0">
          <>
          <div className="flex justify-between items-center">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
             Profile
            </h3>
            <div className="flex items-center space-x-1">
              <PencilSquareIcon
                className="h-6 w-5 hover:text-blue-600 text-gray-400"
                aria-hidden="true"
                onClick={handleEditClick}
              />
            </div>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Personal details
          </p>
          </>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Name{" "}
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  Seva
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Email address
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  seva@gmail.com
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Dogs
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  Dog1
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Personal Bio
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  I'm a dog owner and I own a dog
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
