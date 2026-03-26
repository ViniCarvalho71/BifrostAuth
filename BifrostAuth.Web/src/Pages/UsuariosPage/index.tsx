import {
    ActionsGroup,
    ActionButton,
    ApplicationBindingHint,
    Badge,
    CheckboxRow,
    CreateButton,
    Header,
    InputLabel,
    ModalBody,
    Modal,
    ModalActions,
    ModalOverlay,
    ModalTitle,
    Page,
    PrimaryButton,
    SecondaryButton,
    Subtitle,
    Title,
    ViewGrid,
    ViewItem,
    ViewLabel,
    ViewValue
} from "./style";
import { useEffect, useState } from "react";
import DataTable, { type DataTableColumn } from "../../Components/DataTable";
import type { User, UserCreateRequest } from "../../Types/User";
import { createUser, deleteUser, getOData as getUsersOData, getUserById, getUsers, updateUser } from "../../Services/userService";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import Input from "../../Components/Input";
import ConfirmationModal from "../../Components/ConfirmationModal";
import { useAlert } from "../../Contexts/AlertContext";
import type { Application } from "../../Types/Application";
import { getApplications } from "../../Services/applicationService";
import FormSideBar, { type FormSideBarTab } from "../../Components/FormSideBar";
import {
    createUserApplication,
    deleteUserApplication,
    getUserApplicationsByUserId
} from "../../Services/userApplicationService";
import type { UserApplication } from "../../Types/UserApplication";

type UserEditForm = {
    email: string;
    login: string;
    isActive: boolean;
};

type UserFormTabId = "cadastro" | "aplicacoes";

function UsuariosPage() {
    const { showAlert } = useAlert();
    const formTabs: FormSideBarTab[] = [
        { id: "cadastro", label: "Cadastro" },
        { id: "aplicacoes", label: "Aplicações" }
    ];
    const [users, setUsers] = useState<User[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoadingApplications, setIsLoadingApplications] = useState(false);
    const [createSelectedApplicationIds, setCreateSelectedApplicationIds] = useState<string[]>([]);
    const [editSelectedApplicationIds, setEditSelectedApplicationIds] = useState<string[]>([]);
    const [createActiveTab, setCreateActiveTab] = useState<UserFormTabId>("cadastro");
    const [editActiveTab, setEditActiveTab] = useState<UserFormTabId>("cadastro");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [tableRefreshTrigger, setTableRefreshTrigger] = useState(0);
    const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [actionError, setActionError] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeletingUser, setIsDeletingUser] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deleteTargetUser, setDeleteTargetUser] = useState<User | null>(null);
    const [editForm, setEditForm] = useState<UserEditForm>({
        email: "",
        login: "",
        isActive: true
    });
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const [createForm, setCreateForm] = useState<UserCreateRequest>({
        email: "",
        login: "",
        password: "",
        isActive: true
    });

    const handleToggleCreateApplication = (applicationId: string) => {
        setCreateSelectedApplicationIds((previous) =>
            previous.includes(applicationId)
                ? previous.filter((id) => id !== applicationId)
                : [...previous, applicationId]
        );
    };

    const handleToggleEditApplication = (applicationId: string) => {
        setEditSelectedApplicationIds((previous) =>
            previous.includes(applicationId)
                ? previous.filter((id) => id !== applicationId)
                : [...previous, applicationId]
        );
    };

    const loadUserApplicationLinks = async (userId: string): Promise<UserApplication[]> => {
        const resultado = await getUserApplicationsByUserId(userId);
        if (resultado.status < 200 || resultado.status >= 300) {
            throw new Error(resultado.errorMessage ?? "Nao foi possivel carregar os vinculos do usuário.");
        }

        return resultado.data;
    };

    const syncUserApplicationLinks = async (userId: string, selectedApplicationIds: string[]) => {
        const existingLinks = await loadUserApplicationLinks(userId);
        const selectedSet = new Set(selectedApplicationIds);
        const existingByApplicationId = new Map(existingLinks.map((link) => [link.applicationId, link]));

        for (const applicationId of selectedSet) {
            if (existingByApplicationId.has(applicationId)) {
                continue;
            }

            const createResult = await createUserApplication({ userId, applicationId });
            if (createResult.status < 200 || createResult.status >= 300) {
                throw new Error(createResult.errorMessage ?? "Nao foi possivel vincular o usuário a aplicacao.");
            }
        }

        for (const link of existingLinks) {
            if (selectedSet.has(link.applicationId)) {
                continue;
            }

            const deleteResult = await deleteUserApplication(link.id);
            if (deleteResult.status < 200 || deleteResult.status >= 300) {
                throw new Error(deleteResult.errorMessage ?? "Nao foi possivel remover o vinculo do usuário com a aplicacao.");
            }
        }
    };

    const renderBindingTable = (
        selectedIds: string[],
        onToggle: (applicationId: string) => void,
        rowKeyPrefix: string
    ) => {
        const bindingColumns: DataTableColumn<Application>[] = [
            ...applicationColumns,
            {
                key: "vincular",
                header: "VINCULAR",
                width: "100px",
                align: "center",
                render: (application) => (
                    <input
                        type="checkbox"
                        aria-label={`Vincular usuário na aplicação ${application.name}`}
                        checked={selectedIds.includes(application.id)}
                        onChange={() => onToggle(application.id)}
                    />
                )
            }
        ];

        return (
            <>
                <ApplicationBindingHint>
                    Selecione as aplicações vinculadas ao usuário.
                </ApplicationBindingHint>
                <DataTable
                    columns={bindingColumns}
                    data={applications}
                    searchableFields={["name", "clientId"]}
                    searchPlaceholder="Pesquisar aplicações..."
                    rowKey={(application) => `${rowKeyPrefix}-${application.id}`}
                    emptyMessage={
                        isLoadingApplications ? "Carregando aplicações..." : "Nenhuma aplicação disponível."
                    }
                />
            </>
        );
    };

    const applicationColumns: DataTableColumn<Application>[] = [
        {
            key: "name",
            header: "APLICAÇÃO",
            render: (application) => application.name
        },
        {
            key: "clientId",
            header: "CLIENT ID",
            render: (application) => application.clientId
        },
        {
            key: "isActive",
            header: "STATUS",
            width: "110px",
            render: (application) => (
                <Badge $status={application.isActive ? "Ativo" : "Inativo"}>
                    {application.isActive ? "Ativo" : "Inativo"}
                </Badge>
            )
        }
    ];

    const loadUsers = async (): Promise<User[]> => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const resultado = await getUsers();

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possivel carregar os usuários.";
                setUsers([]);
                setErrorMessage(message);
                showAlert({ type: "error", message });
                setIsLoading(false);
                return [];
            }

            setUsers(resultado.data);
            setIsLoading(false);
            return resultado.data;
        } catch {
            const message = "Nao foi possivel carregar os usuários.";
            setUsers([]);
            setErrorMessage(message);
            showAlert({ type: "error", message });
            setIsLoading(false);
            return [];
        }
    };

    const loadApplicationsForBinding = async () => {
        if (isLoadingApplications || applications.length > 0) {
            return;
        }

        setIsLoadingApplications(true);

        try {
            const resultado = await getApplications();
            if (resultado.status < 200 || resultado.status >= 300) {
                showAlert({
                    type: "error",
                    message: resultado.errorMessage ?? "Não foi possível carregar as aplicações para vínculo."
                });
                setApplications([]);
                setIsLoadingApplications(false);
                return;
            }

            setApplications(resultado.data);
        } catch {
            showAlert({
                type: "error",
                message: "Não foi possível carregar as aplicações para vínculo."
            });
            setApplications([]);
        }

        setIsLoadingApplications(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreateTabChange = async (tabId: UserFormTabId) => {
        setCreateActiveTab(tabId);

        if (tabId === "aplicacoes") {
            await loadApplicationsForBinding();
        }
    };

    const handleEditTabChange = async (tabId: UserFormTabId) => {
        setEditActiveTab(tabId);

        if (tabId === "aplicacoes") {
            await loadApplicationsForBinding();
        }
    };

    const handleCreate = () => {
        setCreateActiveTab("cadastro");
        setCreateSelectedApplicationIds([]);
        setCreateForm({
            email: "",
            login: "",
            password: "",
            isActive: true
        });
        setConfirmPassword("");
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        if (isSubmittingCreate) {
            return;
        }

        setIsCreateModalOpen(false);
        setCreateActiveTab("cadastro");
    };

    const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!createForm.login.trim() || !createForm.email.trim() || !createForm.password.trim() || !confirmPassword.trim()) {
            const message = "Preencha todos os campos obrigatorios.";
            showAlert({ type: "warning", message });
            return;
        }

        if (!createForm.email.includes("@")) {
            const message = "Informe um e-mail valido.";
            showAlert({ type: "warning", message });
            return;
        }

        if (createForm.password !== confirmPassword) {
            const message = "As senhas nao conferem.";
            showAlert({ type: "warning", message });
            return;
        }

        setIsSubmittingCreate(true);

        try {
            const resultado = await createUser(createForm);

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possivel criar o usuário.";
                showAlert({ type: "error", message });
                return;
            }

            const refreshedUsers = await loadUsers();
            const createdUser = resultado.data?.id
                ? resultado.data
                : refreshedUsers.find((user) => user.login === createForm.login && user.email === createForm.email);

            if (!createdUser) {
                throw new Error("Usuário criado, mas nao foi possivel identificar o registro para vincular aplicacoes.");
            }

            await syncUserApplicationLinks(createdUser.id, createSelectedApplicationIds);

            setIsCreateModalOpen(false);
            showAlert({ type: "success", message: "Usuário criado com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Nao foi possivel criar o usuário.";
            showAlert({ type: "error", message });
        } finally {
            setIsSubmittingCreate(false);
        }
    };

    const loadUserById = async (id: string) => {
        setActionError("");
        setIsActionLoading(true);

        try {
            const resultado = await getUserById(id);

            if (resultado.status < 200 || resultado.status >= 300 || !resultado.data) {
                const message = resultado.errorMessage ?? "Nao foi possivel carregar os detalhes do usuário.";
                setActionError(message);
                showAlert({ type: "error", message });
                return null;
            }

            return resultado.data;
        } catch {
            const message = "Nao foi possivel carregar os detalhes do usuário.";
            setActionError(message);
            showAlert({ type: "error", message });
            return null;
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleView = async (user: User) => {
        const loadedUser = await loadUserById(user.id);
        if (!loadedUser) {
            return;
        }

        setSelectedUser(loadedUser);
        setIsViewModalOpen(true);
    };

    const handleEdit = async (user: User) => {
        const loadedUser = await loadUserById(user.id);
        if (!loadedUser) {
            return;
        }

        try {
            const userApplications = await loadUserApplicationLinks(user.id);
            setEditSelectedApplicationIds(userApplications.map((item) => item.applicationId));
        } catch (error) {
            const message = error instanceof Error ? error.message : "Nao foi possivel carregar os vinculos do usuário.";
            showAlert({ type: "error", message });
            return;
        }

        setSelectedUser(loadedUser);
        setEditActiveTab("cadastro");
        setEditForm({
            email: loadedUser.email,
            login: loadedUser.login,
            isActive: loadedUser.isActive
        });
        setIsEditModalOpen(true);
    };

    const handleDelete = (user: User) => {
        setDeleteTargetUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (isDeletingUser) {
            return;
        }

        setIsDeleteModalOpen(false);
        setDeleteTargetUser(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTargetUser) {
            return;
        }

        setActionError("");
        setIsDeletingUser(true);

        try {
            const resultado = await deleteUser(deleteTargetUser.id);

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possivel excluir o usuário.";
                setActionError(message);
                showAlert({ type: "error", message });
                return;
            }

            setIsDeleteModalOpen(false);
            setDeleteTargetUser(null);
            showAlert({ type: "success", message: "Usuário excluido com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch {
            const message = "Nao foi possivel excluir o usuário.";
            setActionError(message);
            showAlert({ type: "error", message });
        } finally {
            setIsDeletingUser(false);
        }
    };

    const handleCloseViewModal = () => {
        if (isActionLoading) {
            return;
        }

        setIsViewModalOpen(false);
        setSelectedUser(null);
    };

    const handleCloseEditModal = () => {
        if (isSubmittingEdit) {
            return;
        }

        setIsEditModalOpen(false);
        setSelectedUser(null);
        setEditActiveTab("cadastro");
    };

    const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedUser) {
            const message = "Usuário nao encontrado.";
            showAlert({ type: "warning", message });
            return;
        }

        if (!editForm.login.trim() || !editForm.email.trim()) {
            const message = "Preencha login e e-mail para salvar.";
            showAlert({ type: "warning", message });
            return;
        }

        if (!editForm.email.includes("@")) {
            const message = "Informe um e-mail valido.";
            showAlert({ type: "warning", message });
            return;
        }

        setIsSubmittingEdit(true);

        try {
            const payload: User = {
                ...selectedUser,
                email: editForm.email,
                login: editForm.login,
                isActive: editForm.isActive
            };

            const resultado = await updateUser(payload);

            if (resultado.status < 200 || resultado.status >= 300) {
                const message = resultado.errorMessage ?? "Nao foi possivel atualizar o usuário.";
                showAlert({ type: "error", message });
                return;
            }

            await syncUserApplicationLinks(selectedUser.id, editSelectedApplicationIds);

            setIsEditModalOpen(false);
            setSelectedUser(null);
            showAlert({ type: "success", message: "Usuário atualizado com sucesso." });
            setTableRefreshTrigger((previous) => previous + 1);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Nao foi possivel atualizar o usuário.";
            showAlert({ type: "error", message });
        } finally {
            setIsSubmittingEdit(false);
        }
    };

    const columns: DataTableColumn<User>[] = [
        {
            key: "id",
            header: "ID",
            render: (user) => user.id
        },
        {
            key: "login",
            header: "LOGIN",
            render: (user) => user.login
        },
        {
            key: "email",
            header: "E-MAIL",
            render: (user) => user.email
        },
        {
            key: "isActive",
            header: "STATUS",
            width: "110px",
            render: (user) => (
                <Badge $status={user.isActive ? "Ativo" : "Inativo"}>
                    {user.isActive ? "Ativo" : "Inativo"}
                </Badge>
            )
        },
        {
            key: "acoes",
            header: "AÇÕES",
            width: "180px",
            render: (user) => (
                <ActionsGroup>
                    <ActionButton type="button" aria-label="Visualizar usuário" $variant="view" onClick={() => handleView(user)}>
                        <FaEye size={14} />
                    </ActionButton>
                    <ActionButton type="button" aria-label="Editar usuário" $variant="edit" onClick={() => handleEdit(user)}>
                        <FaEdit size={14} />
                    </ActionButton>
                    <ActionButton type="button" aria-label="Excluir usuário" $variant="danger" onClick={() => handleDelete(user)}>
                        <FaTrash size={14} />
                    </ActionButton>
                </ActionsGroup>
            )
        }
    ];

    return (
        <Page>
            <Header>
                <Title>Usuários</Title>
                <CreateButton type="button" onClick={handleCreate}>
                    <FaPlus size={12} />
                    Novo Usuário
                </CreateButton>
            </Header>
            {errorMessage && <Subtitle>{errorMessage}</Subtitle>}
            {actionError && <Subtitle>{actionError}</Subtitle>}
            <DataTable
                columns={columns}
                data={users}
                rowKey={(user) => user.id}
                searchableFields={["login", "email"]}
                searchPlaceholder="Pesquisar usuários..."
                oDataFetcher={getUsersOData}
                refreshTrigger={tableRefreshTrigger}
                onFetchError={(message) => {
                    setErrorMessage(message);
                    showAlert({ type: "error", message });
                }}
                emptyMessage={isLoading ? "Carregando usuários..." : "Nenhum usuário cadastrado."}
            />

            {isCreateModalOpen && (
                <ModalOverlay onClick={handleCloseCreateModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Novo Usuário</ModalTitle>

                        <form onSubmit={handleCreateSubmit} noValidate>
                            <FormSideBar
                                tabs={formTabs}
                                activeTabId={createActiveTab}
                                onTabChange={(tabId) => handleCreateTabChange(tabId as UserFormTabId)}
                            >
                                <ModalBody>
                                    {createActiveTab === "cadastro" && (
                                        <>
                                            <InputLabel htmlFor="novo-login">Login</InputLabel>
                                            <Input
                                                id="novo-login"
                                                type="text"
                                                placeholder="Digite o login"
                                                width="100%"
                                                height="40px"
                                                value={createForm.login}
                                                onChange={(event) =>
                                                    setCreateForm((previous) => ({ ...previous, login: event.target.value }))
                                                }
                                                required
                                            />

                                            <InputLabel htmlFor="novo-email">E-mail</InputLabel>
                                            <Input
                                                id="novo-email"
                                                type="email"
                                                placeholder="Digite o e-mail"
                                                width="100%"
                                                height="40px"
                                                value={createForm.email}
                                                onChange={(event) =>
                                                    setCreateForm((previous) => ({ ...previous, email: event.target.value }))
                                                }
                                                required
                                            />

                                            <InputLabel htmlFor="nova-senha">Senha</InputLabel>
                                            <Input
                                                id="nova-senha"
                                                type="password"
                                                placeholder="Digite a senha"
                                                width="100%"
                                                height="40px"
                                                value={createForm.password}
                                                onChange={(event) =>
                                                    setCreateForm((previous) => ({ ...previous, password: event.target.value }))
                                                }
                                                required
                                            />

                                            <InputLabel htmlFor="confirmar-senha">Confirmar senha</InputLabel>
                                            <Input
                                                id="confirmar-senha"
                                                type="password"
                                                placeholder="Repita a senha"
                                                width="100%"
                                                height="40px"
                                                value={confirmPassword}
                                                onChange={(event) => setConfirmPassword(event.target.value)}
                                                required
                                            />

                                            <CheckboxRow>
                                                <input
                                                    id="usuario-ativo"
                                                    type="checkbox"
                                                    checked={createForm.isActive}
                                                    onChange={(event) =>
                                                        setCreateForm((previous) => ({ ...previous, isActive: event.target.checked }))
                                                    }
                                                />
                                                <label htmlFor="usuario-ativo">Usuário ativo</label>
                                            </CheckboxRow>
                                        </>
                                    )}

                                    {createActiveTab === "aplicacoes" && (
                                        <>
                                            {renderBindingTable(
                                                createSelectedApplicationIds,
                                                handleToggleCreateApplication,
                                                "create-binding"
                                            )}
                                        </>
                                    )}
                                </ModalBody>
                            </FormSideBar>

                            <ModalActions>
                                <SecondaryButton type="button" onClick={handleCloseCreateModal}>
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={isSubmittingCreate}>
                                    {isSubmittingCreate ? "Salvando..." : "Salvar"}
                                </PrimaryButton>
                            </ModalActions>
                        </form>
                    </Modal>
                </ModalOverlay>
            )}

            {isViewModalOpen && selectedUser && (
                <ModalOverlay onClick={handleCloseViewModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Visualizar Usuário</ModalTitle>

                        <ViewGrid>
                            <ViewItem>
                                <ViewLabel>ID</ViewLabel>
                                <ViewValue>{selectedUser.id}</ViewValue>
                            </ViewItem>
                            <ViewItem>
                                <ViewLabel>LOGIN</ViewLabel>
                                <ViewValue>{selectedUser.login}</ViewValue>
                            </ViewItem>
                            <ViewItem>
                                <ViewLabel>E-MAIL</ViewLabel>
                                <ViewValue>{selectedUser.email}</ViewValue>
                            </ViewItem>
                            <ViewItem>
                                <ViewLabel>STATUS</ViewLabel>
                                <ViewValue>{selectedUser.isActive ? "Ativo" : "Inativo"}</ViewValue>
                            </ViewItem>
                        </ViewGrid>

                        <ModalActions>
                            <SecondaryButton type="button" onClick={handleCloseViewModal}>
                                Fechar
                            </SecondaryButton>
                        </ModalActions>
                    </Modal>
                </ModalOverlay>
            )}

            {isEditModalOpen && selectedUser && (
                <ModalOverlay onClick={handleCloseEditModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Editar Usuário</ModalTitle>

                        <form onSubmit={handleEditSubmit} noValidate>
                            <FormSideBar
                                tabs={formTabs}
                                activeTabId={editActiveTab}
                                onTabChange={(tabId) => handleEditTabChange(tabId as UserFormTabId)}
                            >
                                <ModalBody>
                                    {editActiveTab === "cadastro" && (
                                        <>
                                            <InputLabel htmlFor="editar-login">Login</InputLabel>
                                            <Input
                                                id="editar-login"
                                                type="text"
                                                placeholder="Digite o login"
                                                width="100%"
                                                height="40px"
                                                value={editForm.login}
                                                onChange={(event) =>
                                                    setEditForm((previous) => ({ ...previous, login: event.target.value }))
                                                }
                                                required
                                            />

                                            <InputLabel htmlFor="editar-email">E-mail</InputLabel>
                                            <Input
                                                id="editar-email"
                                                type="email"
                                                placeholder="Digite o e-mail"
                                                width="100%"
                                                height="40px"
                                                value={editForm.email}
                                                onChange={(event) =>
                                                    setEditForm((previous) => ({ ...previous, email: event.target.value }))
                                                }
                                                required
                                            />

                                            <CheckboxRow>
                                                <input
                                                    id="editar-ativo"
                                                    type="checkbox"
                                                    checked={editForm.isActive}
                                                    onChange={(event) =>
                                                        setEditForm((previous) => ({ ...previous, isActive: event.target.checked }))
                                                    }
                                                />
                                                <label htmlFor="editar-ativo">Usuário ativo</label>
                                            </CheckboxRow>
                                        </>
                                    )}

                                    {editActiveTab === "aplicacoes" && (
                                        <>
                                            {renderBindingTable(
                                                editSelectedApplicationIds,
                                                handleToggleEditApplication,
                                                "edit-binding"
                                            )}
                                        </>
                                    )}
                                </ModalBody>
                            </FormSideBar>

                            <ModalActions>
                                <SecondaryButton type="button" onClick={handleCloseEditModal}>
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={isSubmittingEdit}>
                                    {isSubmittingEdit ? "Salvando..." : "Salvar"}
                                </PrimaryButton>
                            </ModalActions>
                        </form>
                    </Modal>
                </ModalOverlay>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Excluir usuário"
                message={
                    deleteTargetUser
                    ? `Tem certeza que deseja excluir o usuário ${deleteTargetUser.login}?`
                    : "Tem certeza que deseja excluir este usuário?"
                }
                confirmText="Excluir"
                cancelText="Cancelar"
                isSubmitting={isDeletingUser}
                onConfirm={handleConfirmDelete}
                onCancel={handleCloseDeleteModal}
            />
        </Page>
    );
}

export default UsuariosPage;