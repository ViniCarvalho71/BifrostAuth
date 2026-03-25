export type Application = {
    clientId: string;
    clientSecret: string;
    id: string;
    isActive: boolean;
    name: string;
    redirectUrl: string;
};

export type ApplicationCreateRequest = Omit<Application, "id">;
