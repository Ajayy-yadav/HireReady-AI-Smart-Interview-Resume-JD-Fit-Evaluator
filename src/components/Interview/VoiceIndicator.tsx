import UserProfile from "../dashboard/user/user-profile";

interface VoiceIndicatorProps {
  kind: "ai" | "user";
  active: boolean;
  imageSrc?: string;
  label: string;
  userId?: string;
}

export function VoiceIndicator({
  kind,
  active,
  imageSrc,
  label,
  userId,
}: VoiceIndicatorProps) {
  const visualizerBars = 32;

  if (kind === "ai") {
    return (
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={[
              "relative rounded-full transition-all duration-500",
              "w-16 h-16 sm:w-20 sm:h-20 shrink-0",
              active ? "scale-105" : "scale-100",
            ].join(" ")}
            aria-live="polite"
            aria-label={`${label} ${active ? "active" : "idle"}`}
            style={{
              padding: "2px",
              background:
                "linear-gradient(135deg, rgba(216, 180, 254, 0.95), rgba(192, 132, 252, 0.8))",
              boxShadow: active
                ? "0 0 12px rgba(168, 85, 247, 0.4), 0 0 24px rgba(168, 85, 247, 0.2), 0 4px 12px rgba(168, 85, 247, 0.2)"
                : "0 4px 12px rgba(168, 85, 247, 0.15)",
            }}
          >
            <div className="w-full h-full rounded-full bg-white p-1">
              <div
                className={`w-full h-full rounded-full ${
                  active ? "animate-pulse" : ""
                }`}
                style={{
                  background:
                    "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 20%, #d8b4fe 40%, #c084fc 60%, #a855f7 80%, #9333ea 100%)",
                  boxShadow: `
                    inset -4px -4px 12px rgba(147, 51, 234, 0.5),
                    inset 4px 4px 12px rgba(255, 255, 255, 0.8)
                  `,
                }}
              />
            </div>
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground leading-tight mb-1">
              {label}
            </p>
            <p className="text-xs text-muted-foreground leading-tight flex items-center gap-1.5">
              <span
                className={[
                  "inline-block w-1.5 h-1.5 rounded-full",
                  active
                    ? "bg-purple-400 animate-pulse"
                    : "bg-muted-foreground/40",
                ].join(" ")}
              />
              {active ? "Speaking…" : "Idle"}
            </p>
          </div>
        </div>

        <div className="h-12 w-32 sm:w-40 flex items-center justify-end gap-0.5 shrink-0">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={[
                "w-0.5 rounded-full transition-all duration-300",
                active
                  ? "bg-purple-400/70 animate-pulse"
                  : "bg-muted-foreground/20 h-1",
              ].join(" ")}
              style={
                active
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="flex items-center gap-4 min-w-0">
        <div
          className={[
            "relative w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-500 shrink-0",
            active ? "scale-105" : "scale-100",
          ].join(" ")}
          aria-live="polite"
          aria-label={`${label} ${active ? "active" : "idle"}`}
          style={{
            padding: "2px",
            background:
              "linear-gradient(135deg, rgba(209, 213, 219, 0.95), rgba(156, 163, 175, 0.8))",
            boxShadow: active
              ? "0 0 12px rgba(34, 197, 94, 0.4), 0 0 24px rgba(34, 197, 94, 0.2), 0 4px 12px rgba(34, 197, 94, 0.2)"
              : "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div className="w-full h-full rounded-full bg-white p-1">
            <div
              className={`w-full h-full rounded-full overflow-hidden border border-gray-200 ${
                active ? "animate-pulse" : ""
              }`}
            >
              {imageSrc && !imageSrc.startsWith("/assets") && userId ? (
                <UserProfile
                  id={userId}
                  image={imageSrc}
                  avatarStyles="w-full h-full object-cover"
                />
              ) : imageSrc ? (
                <img
                  src={imageSrc}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted" />
              )}
            </div>
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight mb-1">
            {label}
          </p>
          <p className="text-xs text-muted-foreground leading-tight flex items-center gap-1.5">
            <span
              className={[
                "inline-block w-1.5 h-1.5 rounded-full",
                active
                  ? "bg-green-500 animate-pulse"
                  : "bg-muted-foreground/40",
              ].join(" ")}
            />
            {active ? "Listening…" : "Idle"}
          </p>
        </div>
      </div>

      <div className="h-12 w-32 sm:w-40 flex items-center justify-end gap-0.5 shrink-0">
        {[...Array(visualizerBars)].map((_, i) => (
          <div
            key={i}
            className={[
              "w-0.5 rounded-full transition-all duration-300",
              active
                ? "bg-green-500/70 animate-pulse"
                : "bg-muted-foreground/20 h-1",
            ].join(" ")}
            style={
              active
                ? {
                    height: `${20 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.05}s`,
                  }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
