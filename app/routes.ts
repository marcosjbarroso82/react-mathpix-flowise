import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/ocr.tsx"),
  route("camera", "routes/camera.tsx"),
  route("gallery", "routes/gallery.tsx"),
  route("settings", "routes/settings.tsx"),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
