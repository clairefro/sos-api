import { Response } from "express";

function cacheRes(res: Response, { hours }: { hours: number }) {
  const maxAge = hours * 3600; // Convert hours to seconds
  res.set("Cache-Control", `public, max-age=${maxAge}`);
  res.set("Last-Modified", new Date().toUTCString());
}

export { cacheRes };
