import { createFileRoute } from "@tanstack/react-router";
import { AveronixSite } from "@/components/marketing/AveronixSite";

export const Route = createFileRoute("/site")({
  head: () => ({
    meta: [
      { title: "Averonix — Présentation du produit" },
      { name: "description", content: "Présentation publique d’Averonix, plateforme de préparation à la conformité cybersécurité." },
    ],
  }),
  component: AveronixSite,
});
