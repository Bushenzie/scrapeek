import { createFileRoute } from "@tanstack/react-router";
import { Box } from "@/components/ui/box/box";
import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog/dialog";
import { Input } from "@/components/ui/input/input";
import { Label } from "@/components/ui/label/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs/tabs";
import { Textarea } from "@/components/ui/textarea/textarea";

export const Route = createFileRoute("/")({
  component: Homepage,
});

function Homepage() {
  return (
    <div>
      <Box className="flex flex-col p-6 items-start gap-4">
        <Input placeholder="test" />
        <RadioGroup defaultValue="2">
          <div className="flex items-center gap-2">
            <RadioGroupItem value={"1"} id="option-1" />
            <Label>Option 1</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value={"2"} id="option-2" />
            <Label>Option 2</Label>
          </div>
        </RadioGroup>
        <Select defaultValue="2" value="2">
          <SelectTrigger>
            <SelectValue>Testing Select</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Item 1</SelectItem>
            <SelectItem value="2">Item 2</SelectItem>
          </SelectContent>
        </Select>
        <Textarea placeholder="test" />
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
        <div className="flex gap-2">
          <Checkbox id="checkbox" />
          <Label htmlFor="checkbox">Click this to enable checkbox</Label>
        </div>

        <div className="flex gap-2">
          <Button variant={"primary"}>Primary</Button>
          <Button variant={"destructive"}>Destructive</Button>
          <Button variant={"ghost"}>Ghost</Button>
          <Button variant={"link"}>Link</Button>
          <Button variant={"outline"}>Outline</Button>
          <Button variant={"secondary"}>Secondary</Button>
        </div>

        <Dialog>
          <DialogTrigger>
            <Button variant={"outline"}>Open dialog</Button>
          </DialogTrigger>
          <DialogContent overlayClickClose>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Box>
    </div>
  );
}
