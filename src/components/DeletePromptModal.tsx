import { ActionIcon, Button, Modal, Stack, Text, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconTrash } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-location";
import { useEffect, useState } from "react";
import { db, Prompt } from "../db";
import { useApiKey } from "../hooks/useApiKey";
import { useChatId } from "../hooks/useChatId";

export function DeletePromptModal({ prompt }: { prompt: Prompt }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);

  const [key, setKey] = useApiKey();

  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(key);
  }, [key]);
  const chatId = useChatId();
  const navigate = useNavigate();

  return (
    <>
      <Modal opened={opened} onClose={close} title="Borrar Prompt" size="md">
        <form
          onSubmit={async (event) => {
            try {
              setSubmitting(true);
              event.preventDefault();
              await db.prompts.where({ id: prompt.id }).delete();
              close();

              notifications.show({
                title: "Borrado",
                message: "Chat Borrado.",
              });
            } catch (error: any) {
              if (error.toJSON().message === "Network Error") {
                notifications.show({
                  title: "Error",
                  color: "red",
                  message: "Sin Conexcion a Internet.",
                });
              } else {
                notifications.show({
                  title: "Error",
                  color: "red",
                  message:
                  "No se puede acceder al char, por favor refresca la pagina he intenta nuevamente.",
                });
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Stack>
            <Text size="sm">Esta seguroq ue quiere borrar los Promots?</Text>
            <Button type="submit" color="red" loading={submitting}>
              Borrar
            </Button>
          </Stack>
        </form>
      </Modal>
      <Tooltip label="Borrar Prompt">
        <ActionIcon color="red" size="lg" onClick={open}>
          <IconTrash size={20} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
