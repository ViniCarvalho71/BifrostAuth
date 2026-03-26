export type UserApplication = {
    id: string;
    userId: string;
    applicationId: string;
};

export type UserApplicationCreateRequest = Omit<UserApplication, "id">;
