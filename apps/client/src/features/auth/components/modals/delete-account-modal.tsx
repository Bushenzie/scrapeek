import { useRouter } from "@tanstack/react-router";
import { Modal } from "@/components/modal/modal";
import { authClient } from "@/lib/clients/auth";

export const DeleteAccountModal = () => {
  const router = useRouter();

  const handleSubmit = async () => {
    await authClient.deleteUser();
    router.navigate({ to: "/" });
  };

  return (
    <Modal
      title="Remove account"
      description="Are you sure you want to remove your account"
      trigger={{
        content: "Delete account",
        props: {
          variant: "destructive"
        }
      }}
      submitBtn={{
        text: "Delete",
        onSubmit: handleSubmit
      }}
    />
  );
};
