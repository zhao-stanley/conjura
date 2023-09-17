import fs from "fs";
import path from "path";
import Client from "./Client";

export default function Interface() {
  const publicPath = path.join(process.cwd(), "public/images");
  const imageFiles = fs.readdirSync(publicPath);

  return (
    <>
      <Client imageFiles={imageFiles} />
    </>
  );
}
