"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Client({ imageFiles }) {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [images, setImages] = useState(imageFiles);
  const [selectedImage, setSelectedImage] = useState(null);

  function fetchChats() {
    if (window !== undefined) {
      setChat(JSON.parse(localStorage.getItem("chat")));
    }
  }

  function addChat(input, author) {
    localStorage.setItem(
      "chat",
      JSON.stringify([
        ...(JSON.parse(localStorage.getItem("chat")) || []),
        { message: input, author: author },
      ])
    );
    fetchChats();
  }

  async function query(input) {
    const res = await fetch("/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: input,
        type: selectedImage === null ? "filter" : "qna",
        selectedImage: selectedImage,
      }),
    });

    const data = await res.json();
    if (data.type === "filter") {
      return setImages(data.data);
    }
    if (data.type === "qna") {
      return addChat(data.data, "sys");
    }
  }

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <>
      <ul
        role="list"
        className="w-[75%] h-full grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8 p-4"
      >
        {images.map((file, key) => (
          <li
            key={key}
            className={`relative w-full h-fit`}
            onClick={() => {
              if (selectedImage === file) {
                setSelectedImage(null);
                addChat(`${file} has been deselected.`, "sys");
                return;
              }
              setSelectedImage(file);
              addChat(`${file} has been selected.`, "sys");
            }}
          >
            <div
              className={`relative group aspect-square block w-full overflow-hidden ${
                selectedImage === file && "ring-2 ring-green-500"
              } rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100`}
            >
              <Image
                src={`/images/${file}`}
                alt=""
                layout="fill"
                className="pointer-events-none object-cover object-center group-hover:opacity-75"
              />
            </div>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
              {file.name}
            </p>
            <p className="pointer-events-none block text-sm font-medium text-gray-500">
              {file.size}
            </p>
          </li>
        ))}
      </ul>
      <div className="w-[25%] bg-white text-black h-full flex flex-col justify-between min-h-screen fixed top-0 right-0 p-4 border-l border-neutral-300">
        <div className="w-full h-full flex flex-col gap-2 overflow-auto pb-4">
          {chat?.map((c, key) => (
            <div
              key={key}
              className={`w-full h-fit break-words text-sm p-2 ${
                c.author == "me"
                  ? "bg-blue-500 text-white"
                  : "bg-neutral-100 text-black"
              } rounded-lg`}
            >
              {c.message}
            </div>
          ))}
        </div>
        <textarea
          className="w-full min-h-[64px] max-h-48 border border-neutral-300 rounded-lg text-black text-sm p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              setInput("");
              //add to localStorage chat object, which should be an array of objects with message and author
              addChat(input, "me");
              query(input);
            }
          }}
        ></textarea>
      </div>
    </>
  );
}
