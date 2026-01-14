import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { isIOSDevice } from '~/utils/check--devices';

export function IosAppModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('iosAppModalDismissed');

    if (isIOSDevice() && dismissed !== 'true') {
      setOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('iosAppModalDismissed', 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Download Our App</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">It looks like you're on an iOS device. Want to try our app from the App Store for a better experience?</p>
        <DialogFooter className="pt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" className="w-full sm:w-auto" onClick={handleDismiss}>
            Don't show again
          </Button>
          <Button asChild className="w-full sm:w-auto" onClick={handleDismiss}>
            <a href="https://apps.apple.com/dk/app/munchora/id6747978117" target="_blank" rel="noopener noreferrer">
              Open in App Store
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
