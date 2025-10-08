import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function App() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">shadcn/ui Component Test</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Button Component */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Button Component</h2>
          <div className="flex gap-2">
            <Button>Default Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>

        {/* Dialog Component */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Dialog Component</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>
                  This dialog uses Radix UI primitives with dark theme styling. It's fully
                  accessible with keyboard navigation and ARIA labels.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p>Content goes here</p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Select Component */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Select Component</h2>
          <Select>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Input & Label Components */}
        <div>
          <h2 className="text-2xl font-semibold mb-2">Input & Label Components</h2>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Enter your email" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
