import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PageShell from "@/components/Base/PageShell";
import { getServerCopy } from "@/components/i18n/server";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { requireAppAuth } from "@/lib/auth/session";
import { getUsersWithRoles } from "@/lib/data/users";

type AdminUser = Awaited<ReturnType<typeof getUsersWithRoles>>[number];

export default async function AdminPage() {
  const copy = await getServerCopy();
  await requireAppAuth(PERMISSIONS.ACCESS_ADMIN);
  const users = await getUsersWithRoles();

  return (
    <PageShell align="start" density={16}>
      <div className="w-full py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <Card className="app-panel rounded-[2rem] border-0 py-0">
            <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
                {copy.authPages.admin.eyebrow}
              </Badge>
              <CardTitle className="app-title text-4xl sm:text-5xl">
                {copy.authPages.admin.title}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="app-panel-soft rounded-[2rem] border-0 py-0">
            <CardContent className="px-3 py-3 sm:px-5 sm:py-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.authPages.admin.user}</TableHead>
                    <TableHead>{copy.authPages.admin.email}</TableHead>
                    <TableHead>{copy.authPages.admin.roles}</TableHead>
                    <TableHead>{copy.authPages.admin.permissions}</TableHead>
                    <TableHead>{copy.authPages.admin.created}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: AdminUser) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-foreground">
                        {user.name ?? copy.authPages.admin.unnamedUser}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email ?? copy.authPages.admin.noEmail}
                      </TableCell>
                      <TableCell>{user.roles.join(", ")}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.permissions.join(", ")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-GB")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
