export type User = {
    email: string;
    id: string;
    isActive: boolean;
    login: string;
    password: string;
};

export type UserCreateRequest = Omit<User, "id">;
