import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button/button";
import { Input } from "@/components/ui/input/input";
import { Select } from "@/components/ui/select/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group/radio-group";
import { Textarea } from "@/components/ui/textarea/textarea";
import { Box } from "@/components/ui/box/box";

export const Route = createFileRoute("/")({
  component: Homepage,
});

function Homepage() {
  return (
    <div>
      <Box>
        <Input />
        <Select />
        <RadioGroup>
          <RadioGroupItem value={"1"}>1</RadioGroupItem>
          <RadioGroupItem value={"1"}>2</RadioGroupItem>
        </RadioGroup>
        <Textarea />
        <Button>test</Button>
      </Box>
    </div>
  );
}
