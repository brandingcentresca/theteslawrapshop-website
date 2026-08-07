import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center px-5 text-center">
      <div>
        <p className="font-display text-6xl font-bold text-brand">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold">
          This page took a wrong turn
        </h1>
        <p className="mt-3 text-muted max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <ButtonLink href="/">Back home</ButtonLink>
          <ButtonLink href="/#quote" variant="outline">
            Get a quote
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
