import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface VersionSwitcherProps {
  currentVersion?: "1.0" | "1.1" | "1.2";
  variant?: "compact" | "full";
}

const VersionSwitcher = ({ currentVersion = "1.0", variant = "full" }: VersionSwitcherProps) => {
  const versions = [
    { label: "Version 1.0", version: "1.0", url: null, current: true },
    { label: "Version 1.1", version: "1.1", url: "https://myceliumteam2.lovable.app/register" },
    { label: "Version 1.2", version: "1.2", url: "https://myceliumteam3.lovable.app/register" },
  ];

  const handleVersionClick = (url: string | null) => {
    if (url) {
      window.location.href = url;
    }
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          v{currentVersion}
        </Badge>
        <div className="flex gap-1">
          {versions
            .filter(v => v.version !== currentVersion && v.url)
            .map(v => (
              <Button
                key={v.version}
                variant="ghost"
                size="sm"
                onClick={() => handleVersionClick(v.url)}
                className="h-7 text-xs gap-1"
              >
                v{v.version}
                <ExternalLink className="h-3 w-3" />
              </Button>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-card/50 rounded-lg border border-border/50">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Current:</span>
        <Badge variant="default" className="font-semibold">
          Version {currentVersion}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:inline">Switch to:</span>
        <div className="flex gap-2">
          {versions
            .filter(v => v.version !== currentVersion && v.url)
            .map(v => (
              <Button
                key={v.version}
                variant="outline"
                size="sm"
                onClick={() => handleVersionClick(v.url)}
                className="gap-2"
              >
                {v.label}
                <ExternalLink className="h-4 w-4" />
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VersionSwitcher;
