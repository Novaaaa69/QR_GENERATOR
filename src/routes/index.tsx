import { createFileRoute } from "@tanstack/react-router";
import { QrStudio } from "@/components/qr-studio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <main className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <QrStudio />
    </main>
  );
}
