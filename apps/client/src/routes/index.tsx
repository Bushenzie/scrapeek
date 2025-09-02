import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group/radio-group";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Box } from "@/components/ui/box/box";
import { Label } from "@/components/ui/label/label";

export const Route = createFileRoute("/")({
  component: Homepage,
});

function Homepage() {
  return (
    <div>
      <Box>
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
        <Button>test</Button>
      </Box>
    </div>
  );
}
