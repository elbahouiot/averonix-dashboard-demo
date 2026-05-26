import { createFileRoute } from "@tanstack/react-router";
import { AveronixSite } from "@/components/marketing/AveronixSite";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Averonix — Préparation à la conformité ISO 27001" },
      { name: "description", content: "Averonix transforme votre évaluation ISO 27001 en plan d’action clair : contrôles, écarts, risques, tâches et rapports." },
    ],
  }),
  component: AveronixSite,
});
