import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { calculateTradeValue, listCardForTrade } from '@/lib/marketplaceSystem';

interface ListCardModalProps {
  open: boolean;
  card: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function ListCardModal({ open, card, onClose, onSuccess }: ListCardModalProps) {
  const [price, setPrice] = useState<number>(0);
  const [isListing, setIsListing] = useState(false);

  // Calculate suggested price when card changes
  useState(() => {
    if (card) {
      const suggestedPrice = calculateTradeValue(card);
      setPrice(suggestedPrice);
    }
  });

  const handleList = async () => {
    if (!card || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setIsListing(true);
    try {
      const result = await listCardForTrade(card.id, price);
      
      if (result.success) {
        toast.success(`"${card.title}" listed for ${price} spores!`);
        onSuccess();
        onClose();
      } else {
        toast.error(result.error || 'Failed to list card');
      }
    } catch (error) {
      console.error('Listing error:', error);
      toast.error('Failed to list card');
    } finally {
      setIsListing(false);
    }
  };

  if (!card) return null;

  const suggestedPrice = calculateTradeValue(card);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>List Card for Trade</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{card.title}</h3>
            <div className="flex gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-primary/20">{card.rarity}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-accent/20">{card.card_type}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (spores)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
              min="1"
              placeholder="Enter price"
            />
            <p className="text-xs text-muted-foreground">
              Suggested price: {suggestedPrice} spores (based on rarity and scores)
            </p>
          </div>

          <div className="bg-muted/50 p-3 rounded-md text-sm">
            <p className="text-muted-foreground">
              Once listed, other players can purchase this card. You'll receive the spores when sold.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleList} disabled={isListing || price <= 0}>
            {isListing ? 'Listing...' : `List for ${price} spores`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
