export class Credentials {
    token: string;
    expiresAt: string;
    claims: {
        isAdministrator: boolean;
        isTechnician: boolean;
        isBroker: boolean;
        isAgent: boolean;
        isAssistant: boolean;
    }
}
