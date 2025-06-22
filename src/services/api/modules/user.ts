import { fail, ok, Result } from "@/services/utils/result";
import { AxiosError } from "axios";
import { apiPrivateClient, apiPublicClient } from "../client";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string | null;
  last_login_at: string | null;
};

type RegisterResponse = User;

export async function register({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<Result<RegisterResponse, AxiosError>> {
  try {
    const { data } = await apiPublicClient.post(
      "/auth/register",
      {
        name,
        email,
        password,
      },
      { withCredentials: false }
    );
    return ok(data);
  } catch (error) {
    return fail(error as AxiosError);
  }
}

type LoginResponse = {
  access_token: string;
  user: User;
};

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Result<LoginResponse, AxiosError>> {
  try {
    const { data } = await apiPublicClient.post("/auth/login", {
      email,
      password,
    });
    return ok(data);
  } catch (error) {
    return fail(error as AxiosError);
  }
}

export async function me(): Promise<Result<User, AxiosError>> {
  try {
    const { data } = await apiPrivateClient.get("/users/me");
    return ok(data);
  } catch (error) {
    return fail(error as AxiosError);
  }
}

type RefreshTokenResponse = {
  access_token: string;
};

export async function refreshToken(): Promise<
  Result<RefreshTokenResponse, AxiosError>
> {
  try {
    const { data } = await apiPublicClient.post("/auth/refresh");
    return ok(data);
  } catch (error) {
    return fail(error as AxiosError);
  }
}

export async function updateUser(
  name: string
): Promise<Result<User, AxiosError>> {
  try {
    const { data } = await apiPrivateClient.patch("/users/me", {
      name,
    });

    return ok(data);
  } catch (error) {
    return fail(error as AxiosError);
  }
}

type NoReturn = {
  success: boolean;
};

export async function updateUserPassword(
  password: string
): Promise<Result<NoReturn, AxiosError>> {
  try {
    await apiPrivateClient.patch("/users/password", {
      password,
    });

    return ok({ success: true });
  } catch (error) {
    return fail(error as AxiosError);
  }
}

type ListUsersQuery = {
  filters?: {
    role?: string;
    search?: string;
  };
  sorting?: {
    field: "name" | "createdAt";
    order: "asc" | "desc";
  };
  pagination: {
    page: number;
    limit: number;
  };
};

type ListResponse = {
  users: User[];
  total: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
};

export async function listUsers({
  filters,
  sorting,
  pagination,
}: ListUsersQuery): Promise<Result<ListResponse, AxiosError>> {
  try {
    const params: {
      page: number;
      limit: number;
      sortBy: "name" | "createdAt";
      order: "asc" | "desc";
      role?: string;
      search?: string;
    } = {
      page: pagination.page,
      limit: pagination.limit,
      sortBy: sorting.field,
      order: sorting.order,
    };

    if (filters.role) {
      params.role = filters.role;
    }
    if (filters.search) {
      params.search = filters.search;
    }

    const { data } = await apiPrivateClient.get("/users", { params });

    return ok(data);
  } catch (error) {
    return fail(error as AxiosError);
  }
}

export async function listInactiveUsers({
  pagination,
}: ListUsersQuery): Promise<Result<ListResponse, AxiosError>> {
  try {
    const params: {
      page: number;
      limit: number;
    } = {
      page: pagination.page,
      limit: pagination.limit,
    };

    const { data } = await apiPrivateClient.get("/users/inactives", { params });

    return ok(data);
  } catch (error) {
    return fail(error as AxiosError);
  }
}

export async function deleteUser(
  id: string
): Promise<Result<NoReturn, AxiosError>> {
  try {
    await apiPrivateClient.delete(`/users/${id}`);

    return ok({ success: true });
  } catch (error) {
    return fail(error as AxiosError);
  }
}

export async function logout(): Promise<Result<void, AxiosError>> {
  try {
    await apiPublicClient.post("/auth/logout");
  } catch (error) {
    return fail(error as AxiosError);
  }
}
