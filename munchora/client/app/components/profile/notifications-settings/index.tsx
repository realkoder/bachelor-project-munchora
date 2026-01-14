import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Label } from '~/components/ui/label';
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Separator } from '~/components/ui/separator';
import { Switch } from '~/components/ui/switch';

export default function NotificationsSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    recipes: true,
    lists: true,
  });

  return (
    <Card className="border backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Bell className="h-5 w-5 text-slate-600" />
          <span>Notifications</span>
        </CardTitle>
        <CardDescription>Choose what notifications you'd like to receive</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-slate-500">Receive updates via email</p>
          </div>
          <Switch
            id="email-notifications"
            checked={notifications.email}
            onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="recipe-notifications">Recipe Updates</Label>
            <p className="text-sm text-slate-500">New recipe suggestions and tips</p>
          </div>
          <Switch
            id="recipe-notifications"
            checked={notifications.recipes}
            onCheckedChange={(checked) => setNotifications({ ...notifications, recipes: checked })}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="list-notifications">Grocery List Updates</Label>
            <p className="text-sm text-slate-500">Changes to shared grocery lists</p>
          </div>
          <Switch id="list-notifications" checked={notifications.lists} onCheckedChange={(checked) => setNotifications({ ...notifications, lists: checked })} />
        </div>
      </CardContent>
    </Card>
  );
}
