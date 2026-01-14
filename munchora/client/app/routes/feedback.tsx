import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import type { Route } from './+types/feedback';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { MessageSquare, Send } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { curUserAtom } from '~/atoms/curUserAtom';
import { useFetch } from '~/lib/api-client';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Feedback' }, { name: 'Feedback', content: 'Welcome to Munchora!' }];
}

export default function Feedbacl() {
  const curUser = useAtomValue(curUserAtom);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    message: '',
  });
  const { fetchData } = useFetch<{ msg: string }>();

  useEffect(() => {
    if (curUser?.user) {
      setFormData((cur) => ({ ...cur, name: curUser.user?.fullname || '', email: curUser.user?.email || '' }));
    }
  }, [curUser?.user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchData('/feedbacks', { method: 'POST', data: { feedback: { ...formData } } });
      toast.info("Thank you for your feedback. We'll get back to you soon.");
    } catch {
      toast.error('Your feedback could NOT be submitted - please check your connection.');
    }
    setFormData((cur) => ({ ...cur, message: '' }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/50 rounded-full mb-6">
            <MessageSquare className="w-8 h-8 text-fourth" />
          </div>
          <h1 className="text-4xl font-bold text-fourth mb-4">Share Your Feedback</h1>
          <p className="text-lg">Help us improve Munchora with your thoughts and suggestions</p>
        </div>

        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle>Tell us what you think</CardTitle>
            <CardDescription>Your feedback helps us create better recipes and experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Your name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Feedback Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recipes">Recipe Generation</SelectItem>
                    <SelectItem value="ui">User Interface</SelectItem>
                    <SelectItem value="features">New Features</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="general">General Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  placeholder="Share your thoughts, suggestions, or report any issues..."
                  className="min-h-32"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Send Feedback
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
