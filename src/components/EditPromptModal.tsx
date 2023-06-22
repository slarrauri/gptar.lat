import {
  ActionIcon,
  Button,
  Modal,
  Stack,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { db, Prompt } from "../db";

export function EditPromptModal({ prompt }: { prompt: Prompt }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);

  const [value, setValue] = useState("");
  const [title, setTitle] = useState("");
  useEffect(() => {
    setValue(prompt?.content ?? "");
    setTitle(prompt?.title ?? "");
  }, [prompt]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Editar Prompt" size="lg">
        <form
          onSubmit={async (event) => {
            try {
              setSubmitting(true);
              event.preventDefault();
              await db.prompts.where({ id: prompt.id }).modify((chat) => {
                chat.title = title;
                chat.content = value;
              });
              notifications.show({
                title: "Guardado",
                message: "Prompt updated",
              });
            } catch (error: any) {
              if (error.toJSON().message === "Network Error") {
                notifications.show({
                  title: "Error",
                  color: "red",
                  message: "Sin Conexion a Internet.",
                });
              }
              const message = error.response?.data?.error?.message;
              if (message) {
                notifications.show({
                  title: "Error",
                  color: "red",
                  message,
                });
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Stack>
            <TextInput
              label="Titulo"
              value={title}
              onChange={(event) => setTitle(event.currentTarget.value)}
              formNoValidate
              data-autofocus
            />
            <Textarea
              label="Contenido"
              autosize
              minRows={5}
              maxRows={10}
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
            />
            <Button type="submit" loading={submitting}>
              Guardar
            </Button>
          </Stack>
        </form>
      </Modal>
      <Tooltip label="Editar Prompt">
        <ActionIcon size="lg" onClick={open}>
          <IconPencil size={20} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
