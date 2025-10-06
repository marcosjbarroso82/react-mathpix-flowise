import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/flowise-agents.tsx"),
  route("prompts", "routes/prompts.tsx"),
  route("ocr", "routes/ocr.tsx"),
  route("camera", "routes/camera.tsx"),
  route("gallery", "routes/gallery.tsx"),
  route("multi-ocr-workflow", "routes/multi-ocr-workflow.tsx"),
  route("settings", "routes/settings.tsx"),
  route("supabase-test", "routes/supabase-test.tsx"),
  route("about", "routes/about.tsx"),
] satisfies RouteConfig;
