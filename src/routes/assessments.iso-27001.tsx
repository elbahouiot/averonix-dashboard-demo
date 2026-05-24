import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/assessments/iso-27001")({
  component: () => <Outlet />,
});
