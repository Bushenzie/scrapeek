import { createFileRoute } from "@tanstack/react-router"
import { Group, Pen } from "lucide-react"
import { useState } from "react"
import { Modal } from "@/components/modal/modal"
import { Badge } from "@/components/ui/badge/badge"
import { Box } from "@/components/ui/box/box"
import { Button } from "@/components/ui/button/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/card"
import { Checkbox } from "@/components/ui/checkbox/checkbox"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/dropdown-menu"
import { Input } from "@/components/ui/input/input"
import { Label } from "@/components/ui/label/label"
import { Pagination } from "@/components/ui/pagination/pagination"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs/tabs"
import { Textarea } from "@/components/ui/textarea/textarea"
import { toast } from "@/components/ui/toasts/toast"
// import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [{ title: "Scrapeek - dashboard" }],
  }),
  component: DashboardPage,
})

function DashboardPage() {
  // const [page, setPage] = useState(1)
  const [openOutOfBountModal, setOpenOutOfBountModal] = useState(false)

  return (
    <div>
      <Box className="flex flex-col p-6 items-start gap-4">
        <Button
          onClick={() =>
            toast({
              title: "Created normal toast",
              description: "Wow these toast are toasty",
            })
          }
        >
          Summon normal toast
        </Button>
        <Button
          onClick={() =>
            toast({
              title: "Created action toast",
              description: "Wow these toast are toasty, but with action",
              action: {
                btnText: "click",
                onClick: () => alert("Hi!"),
              },
            })
          }
        >
          Summon action toast
        </Button>
        <Button icon={<Pen />} onClick={() => setOpenOutOfBountModal(true)}>
          Out of bound btn to open modal
        </Button>
        <div className="flex flex-col gap-2">
          <Modal
            title="Called out of nowhere"
            description="This modal way called out of nowhere and not managed by internal state"
            trigger={null}
            state={{
              open: openOutOfBountModal,
              setOpen: setOpenOutOfBountModal,
            }}
          ></Modal>
          <Modal
            title="Called normally by trigger btn"
            description="This modal way called out of nowhere and not managed by internal state"
          ></Modal>
        </div>
        <div className="flex gap-2">
          <Badge variant={"default"}>primary</Badge>
          <Badge variant={"destructive"}>destructive</Badge>
          <Badge variant={"outline"}>outline</Badge>
          <Badge variant={"secondary"}>secondary</Badge>
        </div>
        {/*Current page: {page}*/}
        {/*<Pagination currentPage={page} setCurrentPage={setPage} itemsPerPage={10} itemsTotal={89} />*/}
        <Input placeholder="test" />
        <RadioGroup defaultValue="2">
          <div className="flex items-center gap-2">
            <RadioGroupItem value={`1`} id="option-1" />
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
          <TabsContent value="account">Make changes to your account here.</TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
        <div className="flex gap-2">
          <Checkbox id="checkbox" />
          <Label htmlFor="checkbox">Click this to enable checkbox</Label>
        </div>
        <div className="flex gap-2">
          <Button variant={"default"}>Primary</Button>
          <Button variant={"destructive"}>Destructive</Button>
          <Button variant={"ghost"}>Ghost</Button>
          <Button variant={"link"}>Link</Button>
          <Button variant={"outline"}>Outline</Button>
          <Button variant={"secondary"}>Secondary</Button>
        </div>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            Open dropdown
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Box>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="http://localhost:3000/"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
