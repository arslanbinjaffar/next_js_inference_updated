import { cn } from "@/app/lib/utils";

export const LoadingSpinner = ({
  show,
  className,
  size = 100,
  ...props
}: {
  show: boolean;
  className?: string;
  size?: number;
}) =>
  show && (
    <section className="absolute h-screen w-screen inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm  z-[1000000]">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          {...props}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("animate-spin", className)}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        <p className="text-center font-sans font-semibold">Please wait</p>
      </div>
    </section>
  );
