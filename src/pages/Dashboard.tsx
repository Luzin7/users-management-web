import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  deleteUser,
  listInactiveUsers,
  listUsers,
  logout,
} from "@/services/api/modules/user";
import { useAuthStore } from "@/stores/auth";
import { User, useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formateDate";
import { LogOut, Search, SortAsc, SortDesc, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "admin" | "user" | "inactives"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "createdAt">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { user } = useUserStore();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      const response =
        roleFilter === "inactives"
          ? await listInactiveUsers({
              pagination: {
                page,
                limit,
              },
            })
          : await listUsers({
              filters: {
                role: roleFilter === "all" ? undefined : roleFilter,
                search: searchTerm.trim() || undefined,
              },
              sorting: {
                field: sortBy,
                order: sortOrder,
              },
              pagination: {
                page,
                limit,
              },
            });

      if (response.success) {
        setUsers(
          response.data.users.map((u) => ({
            ...u,
            createdAt: u.created_at,
            updatedAt: u.updated_at,
            lastLoginAt: u.last_login_at,
          }))
        );
        setTotal(response.data.total);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        toast.error("Erro ao buscar usuários");
      }
      setIsLoading(false);
    };

    const timeoutId = setTimeout(
      () => {
        fetchUsers();
      },
      searchTerm ? 400 : 0
    );

    return () => clearTimeout(timeoutId);
  }, [searchTerm, roleFilter, sortBy, sortOrder, page, limit]);

  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, roleFilter]);

  const toggleSort = (field: "name" | "createdAt") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setIsLoading(true);
    const response = await deleteUser(userId);

    if (!response.success) {
      toast.error("Não foi possível excluir o usuário");
      setIsLoading(false);
      return;
    }

    toast.success("Usuário removido com sucesso");
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setTotal((prev) => prev - 1);
    setIsLoading(false);
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Users className="text-primary" size={24} />
              <h1 className="hidden text-sm font-semibold text-gray-900 md:block">
                Dashboard Admin
              </h1>
              <h1 className="text-sm font-semibold text-gray-900 md:hidden">
                Olá, {user?.name}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-muted-foreground md:block">
                Olá, {user?.name}
              </span>
              <button
                onClick={async () => {
                  await logout();
                  useUserStore.getState().clearUser();
                  useAuthStore.getState().clearAccessToken();
                  sessionStorage.removeItem("accessToken");
                  toast.success("Você saiu com sucesso!");
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-red-600 hover:bg-muted rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {isLoading && searchTerm !== debouncedSearchTerm && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <LoadingSpinner size="sm" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setPage(1);
                  setRoleFilter(
                    e.target.value as "all" | "admin" | "user" | "inactives"
                  );
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="admin">Administradores</option>
                <option value="user">Usuários</option>
                <option value="inactives">Inativos</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex gap-4 items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Usuários ({total})
            </h2>
              <div
                    className="p-2 text-left text-xs font-medium rounded-lg text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-gray-100 md:hidden"
                    onClick={() => toggleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Data de Criação
                      {sortBy === "createdAt" &&
                        (sortOrder === "asc" ? (
                          <SortAsc size={14} />
                        ) : (
                          <SortDesc size={14} />
                        ))}
                    </div>
            </div>
          </div>
          <div className="md:hidden">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow border p-4 mt-2"
              >
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs">
                    <span
                      className={`px-2 py-1 rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="flex gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <button className="text-destructive hover:text-destructive/80 p-1 hover:bg-destructive/10 rounded">
                          <Trash2 size={24} />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso irá excluir
                            permanentemente o usuário e remover seus dados dos
                            nossos servidores.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Continuar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Nome
                      {sortBy === "name" &&
                        (sortOrder === "asc" ? (
                          <SortAsc size={14} />
                        ) : (
                          <SortDesc size={14} />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    cargo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleSort("createdAt")}
                  >
                    <div className="flex items-center gap-2">
                      Data de Criação
                      {sortBy === "createdAt" &&
                        (sortOrder === "asc" ? (
                          <SortAsc size={14} />
                        ) : (
                          <SortDesc size={14} />
                        ))}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === "admin"
                            ? "bg-primary-100 text-primary-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Usuário"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? "bg-success/10 text-success"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.isActive ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <button className="text-destructive hover:text-destructive/80 p-1 hover:bg-destructive/10 rounded">
                            <Trash2 size={24} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Você tem certeza?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso irá excluir
                              permanentemente o usuário e remover seus dados dos
                              nossos servidores.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isLoading && users.length > 0 && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <LoadingSpinner size="md" />
            </div>
          )}

          {users.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-700">
              Mostrando {(page - 1) * limit + 1} a{" "}
              {Math.min(page * limit, total)} de {total} usuários
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-3 py-2 text-sm border rounded-lg ${
                        page === pageNum
                          ? "bg-primary text-white border-primary"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
