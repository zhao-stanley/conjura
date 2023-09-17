import { NextResponse } from "next/server";

export async function POST(request) {
  const req = await request.json();
  const type = res.type;
  const query = res.query;

  if (type === "filter") {
    const res = await fetch("http://localhost:5000/filter", {
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return NextResponse.json({ data: data.images, type: "filter" });
  } else if (type === "qna") {
    const res = await fetch("http://localhost:5000/qna", {
      body: JSON.stringify({ filename: req.selectedImage, query }),
    });
    const data = await res.json();
    return NextResponse.json({ data: data.response, type: "qna" });
  } else {
    return NextResponse.json({ message: "Error with request" });
  }
}
