import { useState, React } from "react";
import { Disclosure, RadioGroup, Tab } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import { HeartIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

const post = {
  title: "Beach Stroll",
  rating: 4,
  images: [
    {
      id: 1,
      name: "Angled view",
      src: "walkingdog.jpeg",
    },
    // More images...
  ],
  description: `
    <p>good sunny day, foraged a seashell</p>
  `,
  comments: [
    {
      name: "Comments",
      items: ["comment1", "comment2"],
    },
    // More sections...
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Post({ data }) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {post.images.map((image) => (
                  <Tab
                    key={image.id}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="sr-only">{image.name}</span>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <img
                            src={image.src}
                            alt=""
                            className="h-full w-full object-cover object-center"
                          />
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
              {post.images.map((image) => (
                <Tab.Panel key={image.id}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-32 w-32 sm:h-full sm:w-full object-cover object-center sm:rounded-lg"
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            {/* Post Title */}
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Trailing with{" "}
              {data.dogs.map((dog, index) => (
                <span key={index}>
                  {dog}
                  {index !== data.dogs.length - 1 && ", "}{" "}
                  {/* Add comma if not the last item */}
                </span>
              ))}
            </h1>

            {/* Post Owner */}
            <h2 className="text-xl tracking-tight text-gray-700">
              {data.owner_name}
            </h2>

            {/* Post Review */}
            <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        post.rating > rating
                          ? "text-indigo-500"
                          : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="sr-only">{post.rating} out of 5 stars</p>
              </div>
            </div>

            <div className="mt-6">
              <span>{data.location}</span>
              <h3 className="sr-only">Captions</h3>

              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: data.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
