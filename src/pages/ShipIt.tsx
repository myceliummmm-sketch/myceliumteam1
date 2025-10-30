export default function ShipIt() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="h-screen grid grid-cols-12 gap-4">
        {/* Left: Team Panel (2 cols) */}
        <div className="col-span-2 bg-card rounded-lg p-4">
          <h3 className="text-sm font-mono text-muted-foreground mb-4">YOUR TEAM</h3>
          <p className="text-xs text-muted-foreground">Team panel coming soon...</p>
        </div>
        
        {/* Center: Chat & Terminal (7 cols) */}
        <div className="col-span-7 flex flex-col gap-4">
          {/* Phase Progress */}
          <div className="bg-card rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Phase progress coming soon...</p>
          </div>
          
          {/* Chat Terminal */}
          <div className="flex-1 bg-card rounded-lg p-4 overflow-y-auto">
            <p className="text-xs text-muted-foreground">Chat terminal coming soon...</p>
          </div>
          
          {/* Input Bar */}
          <div className="bg-card rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Input bar coming soon...</p>
          </div>
        </div>
        
        {/* Right: Stats & Quest Log (3 cols) */}
        <div className="col-span-3 flex flex-col gap-4 overflow-y-auto">
          <div className="bg-card rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Stats panel coming soon...</p>
          </div>
          <div className="bg-card rounded-lg p-4">
            <p className="text-xs text-muted-foreground">Quest log coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
