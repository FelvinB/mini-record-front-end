import { Alert } from "@/components/ui/alert";
import { XIcon } from "@/components/ui/icons";

interface MessageBannerProps {
  message: string;
  variant?: "success" | "error" | "info";
  onDismiss: () => void;
}

export function MessageBanner({
  message,
  variant = "success",
  onDismiss,
}: MessageBannerProps) {
  return (
    <div className="relative">
      <Alert variant={variant} message={message} className="pr-10" />
      <button
        type="button"
        onClick={onDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
        aria-label="Dismiss message"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}