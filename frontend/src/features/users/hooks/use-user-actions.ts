import { useState } from "react";
import {
  UserResponse,
  UserCreatePayload,
  UserUpdatePayload,
} from "@/types/user.type";
import { useCreateUser, useUpdateUser } from "./use-users";
import {
  type UserCreateFormData,
  type UserUpdateFormData,
} from "@/features/users/schemas/user-form.schema";

export function useUserActions() {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: UserResponse) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalSubmit = (values: UserCreateFormData | UserUpdateFormData) => {
    if (selectedUser) {
      updateUserMutation.mutate(
        { id: selectedUser.id, data: values as UserUpdatePayload },
        {
          onSuccess: () => {
            handleCloseModal();
          },
        }
      );
    } else {
      createUserMutation.mutate(values as UserCreatePayload, {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  const isMutating = createUserMutation.isPending || updateUserMutation.isPending;

  return {
    isModalOpen,
    selectedUser,
    isMutating,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleModalSubmit,
  };
}
