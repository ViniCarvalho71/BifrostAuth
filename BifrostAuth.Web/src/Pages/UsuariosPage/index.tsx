import {
    ActionsGroup,
    ActionButton,
    Badge,
    CheckboxRow,
    CreateButton,
    Header,
    InputLabel,
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
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "../../Services/userService";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import Input from "../../Components/Input";
import ConfirmationModal from "../../Components/ConfirmationModal";

type UserEditForm = {
    email: string;
    login: string;
    isActive: boolean;
};

function UsuariosPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
    const [createError, setCreateError] = useState("");
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
    const [editError, setEditError] = useState("");
    const [createForm, setCreateForm] = useState<UserCreateRequest>({
        email: "",
        login: "",
        password: "",
        isActive: true
    });

    const loadUsers = async () => {
        setIsLoading(true);
        setErrorMessage("");

        const resultado = await getUsers();

        if (resultado.status < 200 || resultado.status >= 300) {
            setUsers([]);
            setErrorMessage("Nao foi possivel carregar os usuarios.");
            setIsLoading(false);
            return;
        }

        setUsers(resultado.data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreate = () => {
        setCreateError("");
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
        setCreateError("");
    };

    const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreateError("");

        if (createForm.password !== confirmPassword) {
            setCreateError("As senhas nao conferem.");
            return;
        }

        setIsSubmittingCreate(true);

        try {
            const resultado = await createUser(createForm);

            if (resultado.status < 200 || resultado.status >= 300) {
                setCreateError("Nao foi possivel criar o usuario.");
                return;
            }

            setIsCreateModalOpen(false);
            await loadUsers();
        } catch {
            setCreateError("Nao foi possivel criar o usuario.");
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
                setActionError("Nao foi possivel carregar os detalhes do usuario.");
                return null;
            }

            return resultado.data;
        } catch {
            setActionError("Nao foi possivel carregar os detalhes do usuario.");
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

        setSelectedUser(loadedUser);
        setEditError("");
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
                setActionError("Nao foi possivel excluir o usuario.");
                return;
            }

            setIsDeleteModalOpen(false);
            setDeleteTargetUser(null);
            await loadUsers();
        } catch {
            setActionError("Nao foi possivel excluir o usuario.");
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
        setEditError("");
        setSelectedUser(null);
    };

    const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedUser) {
            setEditError("Usuario nao encontrado.");
            return;
        }

        setEditError("");
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
                setEditError("Nao foi possivel atualizar o usuario.");
                return;
            }

            setIsEditModalOpen(false);
            setSelectedUser(null);
            await loadUsers();
        } catch {
            setEditError("Nao foi possivel atualizar o usuario.");
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
                    <ActionButton type="button" aria-label="Visualizar usuario" $variant="view" onClick={() => handleView(user)}>
                        <FaEye size={14} />
                    </ActionButton>
                    <ActionButton type="button" aria-label="Editar usuario" $variant="edit" onClick={() => handleEdit(user)}>
                        <FaEdit size={14} />
                    </ActionButton>
                    <ActionButton type="button" aria-label="Excluir usuario" $variant="danger" onClick={() => handleDelete(user)}>
                        <FaTrash size={14} />
                    </ActionButton>
                </ActionsGroup>
            )
        }
    ];

    return (
        <Page>
            <Header>
                <Title>Usuarios</Title>
                <CreateButton type="button" onClick={handleCreate}>
                    <FaPlus size={12} />
                    Novo Usuario
                </CreateButton>
            </Header>
            {errorMessage && <Subtitle>{errorMessage}</Subtitle>}
            {actionError && <Subtitle>{actionError}</Subtitle>}
            <DataTable
                columns={columns}
                data={users}
                rowKey={(user) => user.id}
                emptyMessage={isLoading ? "Carregando usuarios..." : "Nenhum usuario cadastrado."}
            />

            {isCreateModalOpen && (
                <ModalOverlay onClick={handleCloseCreateModal}>
                    <Modal onClick={(event) => event.stopPropagation()}>
                        <ModalTitle>Novo Usuario</ModalTitle>

                        <form onSubmit={handleCreateSubmit}>
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
                                <label htmlFor="usuario-ativo">Usuario ativo</label>
                            </CheckboxRow>

                            {createError && <Subtitle>{createError}</Subtitle>}

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
                        <ModalTitle>Visualizar Usuario</ModalTitle>

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
                        <ModalTitle>Editar Usuario</ModalTitle>

                        <form onSubmit={handleEditSubmit}>
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
                                <label htmlFor="editar-ativo">Usuario ativo</label>
                            </CheckboxRow>

                            {editError && <Subtitle>{editError}</Subtitle>}

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
                title="Excluir usuario"
                message={
                    deleteTargetUser
                        ? `Tem certeza que deseja excluir o usuario ${deleteTargetUser.login}?`
                        : "Tem certeza que deseja excluir este usuario?"
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