import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("edit/:category?", "routes/edit.tsx"),
] satisfies RouteConfig;
