import {
  logout,
  updateUser,
  updateUserPassword,
} from "@/services/api/modules/user";
import { useAuthStore } from "@/stores/auth";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formateDate";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Edit,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  Save,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import LoadingSpinner from "../components/LoadingSpinner";

const profileSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nome é obrigatório")
      .min(2, "Nome deve ter pelo menos 2 caracteres"),
    password: z.string().optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        if (data.password.length < 6) {
          return false;
        }
        if (!data.confirmPassword || data.confirmPassword.length === 0) {
          return false;
        }
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Senhas não coincidem ou confirmação não preenchida",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password.length >= 6;
      }
      return true;
    },
    {
      message: "Senha deve ter pelo menos 6 caracteres",
      path: ["password"],
    }
  );

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    if (data.name !== user?.name) {
      const response = await updateUser(data.name);

      if (!response.success) {
        toast.error("Erro ao atualizar nome");
        return;
      }
    }

    if (data.password && data.password.length > 0) {
      const res = await updateUserPassword(data.password);

      if (!res.success) {
        toast.error("Erro ao atualizar senha");
        return;
      }
    }

    useUserStore.getState().setUser({
      ...user,
      name: data.name,
    });
    setValue("password", "");
    setValue("confirmPassword", "");
    setIsEditing(false);
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: user?.name || "",
      password: "",
      confirmPassword: "",
    });
  };

 

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <User className="text-primary" size={24} />
              <h1 className="text-sm md:text-lg font-semibold text-gray-900">
                Meu Perfil
              </h1>
            </div>
              <button
                onClick={async () => {
                  await logout();
                  useUserStore.getState().clearUser();
                  useAuthStore.getState().clearAccessToken();
                  sessionStorage.removeItem("accessToken");
                }}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-red-600 hover:bg-muted rounded-lg transition-colors"
              >
                <LogOut size={16} />
                Sair
              </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary-600 px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-primary-100">{user.email}</p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  <Edit size={16} />
                  Editar
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Nome Completo
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.name ? "border-destructive" : "border-gray-300"
                    }`}
                    placeholder="Seu nome completo"
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nova Senha (opcional)
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                          errors.password
                            ? "border-destructive"
                            : "border-gray-300"
                        }`}
                        placeholder="Digite a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                          errors.confirmPassword
                            ? "border-destructive"
                            : "border-gray-300"
                        }`}
                        placeholder="Confirme a nova senha"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-destructive text-sm mt-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Salvar
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <User size={20} className="text-gray-600" />
                      <span className="font-medium text-gray-700">Nome</span>
                    </div>
                    <p className="text-gray-900 text-lg">{user.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail size={20} className="text-gray-600" />
                      <span className="font-medium text-gray-700">Email</span>
                    </div>
                    <p className="text-gray-900 text-lg">{user.email}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar size={20} className="text-gray-600" />
                      <span className="font-medium text-gray-700">
                        Membro desde
                      </span>
                    </div>
                    <p className="text-gray-900 text-lg">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
