import { NextResponse } from "next/server";

export async function POST(request) {
  const req = await request.json();
  const type = req.type;
  const query = req.query;

  if (type === "filter") {
    const res = await fetch("http://127.0.0.1:5000/filter", {
      method: "POST",
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return NextResponse.json({ data: data.images, type: "filter" });
  } else if (type === "qna") {
    const res = await fetch("http://127.0.0.1:5000/qna", {
      method: "POST",
      body: JSON.stringify({ filename: req.selectedImage, prompt: query }),
    });
    const data = await res.json();
    return NextResponse.json({ data: data.response, type: "qna" });
  } else {
    return NextResponse.json({ message: "Error with request" });
  }
}
