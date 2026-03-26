export type Role = {
    id: string;
    name: string;
};

export type RoleCreateRequest = Omit<Role, "id">;
