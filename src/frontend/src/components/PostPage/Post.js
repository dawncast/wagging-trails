import { React } from "react";
import { Tab } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Function to check if URL is an image
function isImage(url) {
  const extension = url.split(".").pop().toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "bmp"].includes(extension);
}

export default function Post({ data }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          {data.urls.every((url) => !url) ? (
            // Placeholder for no media
            <img
              src="/walkingdog.jpeg"
              alt="Placeholder"
              className="h-full w-full object-cover object-center rounded-lg"
              style={{ aspectRatio: "4/3", width: "100%" }}
            />
          ) : data.urls.filter((url) => url).length === 1 ? (
            // One media: render the media without a gallery
            <>
              {isImage(data.urls[0]) ? (
                // Image
                <img
                  src={`http://localhost:8800/images/${data.urls[0]}`}
                  alt=""
                  className="h-full w-full object-cover object-center rounded-lg"
                  style={{ aspectRatio: "4/3", width: "100%" }}
                />
              ) : (
                // Video
                <video
                  src={`http://localhost:8800/videos/${data.urls[0]}`}
                  alt=""
                  className="h-full w-full object-cover object-center rounded-lg"
                  style={{ aspectRatio: "4/3", width: "100%" }}
                  controls
                />
              )}
            </>
          ) : (
            <Tab.Group as="div" className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                <Tab.List className="grid grid-cols-4 gap-6">
                  {data.urls.map((url, index) => (
                    <Tab
                      key={index}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="sr-only">{`Media ${
                            index + 1
                          }`}</span>
                          <span className="absolute inset-0 overflow-hidden rounded-md">
                            {isImage(url) ? (
                              // Image
                              <img
                                src={`http://localhost:8800/images/${url}`}
                                alt={`Media ${index + 1}`}
                                className="h-full w-full object-cover object-center"
                              />
                            ) : (
                              // Video
                              <div className="h-full w-full relative">
                                <video
                                  src={`http://localhost:8800/videos/${url}`}
                                  alt={`Media ${index + 1}`}
                                  className="h-full w-full object-cover object-center rounded-lg"
                                  controls
                                />
                                <div className="absolute inset-0 bg-transparent"></div>
                              </div>
                            )}
                          </span>
                          <span
                            className={classNames(
                              selected ? "ring-indigo-500" : "ring-transparent",
                              "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
              </div>

              <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
                {data.urls.map((url, index) => (
                  <Tab.Panel key={index}>
                    {isImage(url) ? (
                      // Image
                      <img
                        src={`http://localhost:8800/images/${url}`}
                        alt={`Media ${index + 1}`}
                        className="h-full w-full object-cover object-center rounded-lg"
                        style={{
                          aspectRatio: "4/3",
                          width: "100%",
                        }}
                      />
                    ) : (
                      // Video
                      <video
                        src={`http://localhost:8800/videos/${url}`}
                        alt={`Media ${index + 1}`}
                        className="h-full w-full object-cover object-center rounded-lg"
                        style={{ aspectRatio: "4/3", width: "100%" }}
                        controls
                      />
                    )}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          )}

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            {/* Post Title */}
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {data.met_up_owners && data.met_up_owners.length > 0 ? (
                <>
                  <div>
                    Met up with{" "}
                    {data.met_up_owners.map((owner, index) => (
                      <span key={index}>
                        {owner}
                        {index !== data.met_up_owners.length - 1 && ", "}{" "}
                      </span>
                    ))}
                  </div>
                  <span className="mt-4 text-xl font-semibold text-gray-800">
                    Along by{" "}
                    {data.dogs.map((dog, index) => (
                      <span key={index}>
                        {dog}
                        {index !== data.dogs.length - 1 && ", "}{" "}
                      </span>
                    ))}
                  </span>
                </>
              ) : (
                <div>
                  Trailing with{" "}
                  {data.dogs.map((dog, index) => (
                    <span key={index}>
                      {dog}
                      {index !== data.dogs.length - 1 && ", "}{" "}
                    </span>
                  ))}
                </div>
              )}
            </h1>

            {/* Post Owner */}
            <h2 className="text-lg mt-1 tracking-tight text-gray-700">
              Post by {data.owner_name}
            </h2>

            {/* Walk Rating */}
            <div className="mt-3">
              <h3 className="sr-only">Walk Rating</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        data.rating > rating
                          ? "text-indigo-500"
                          : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{data.rating} out of 5 stars</p>
              </div>
            </div>

            {/* Walk Details */}
            <div className="mt-6">
              <span>{data.location}</span>
              <br />
              {data.date && (
                <span>{new Date(data.date).toLocaleDateString()}</span>
              )}{" "}
              {data.time && <span>{data.time}</span>}
              <br />
              {data.distance && <span>{data.distance} kilometers</span>}
              <h3 className="sr-only">Post Content</h3>
              <div
                className="space-y-6 mt-6 py-4 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
              {/* Dog Tags*/}
              <div className="mt-4">
                {data.tagged_dogs && data.tagged_dogs.length > 0 && (
                  <>
                    <span>Spotted Dogs: </span>
                    {data.tagged_dogs.map((dog, index) => (
                      <span key={index}>
                        {dog}
                        {index < data.tagged_dogs.length - 1 && ", "}{" "}
                      </span>
                    ))}
                  </>
                )}
              </div>
              {/* Post Tags */}
              <div className="mt-0 lg:mt-32">
                {data.tags.map((tag, index) => (
                  <a
                    href={`http://localhost:3000/post/${tag}`}
                    key={index}
                    className="bg-stone-200 text-stone-900 rounded-lg px-2 py-1 mr-2 mt-1"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
