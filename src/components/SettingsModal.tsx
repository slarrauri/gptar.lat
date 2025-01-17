import {
  Alert,
  Anchor,
  Button,
  Flex,
  List,
  Modal,
  PasswordInput,
  TextInput,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useLiveQuery } from "dexie-react-hooks";
import { cloneElement, ReactElement, useEffect, useState } from "react";
import { db } from "../db";
import { config } from "../utils/config";
import { checkOpenAIKey } from "../utils/openai";

export function SettingsModal({ children }: { children: ReactElement }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [submitting, setSubmitting] = useState(false);

  const [value, setValue] = useState("");
  const [model, setModel] = useState(config.defaultModel);
  const [type, setType] = useState(config.defaultType);
  const [auth, setAuth] = useState(config.defaultAuth);
  const [base, setBase] = useState("");
  const [version, setVersion] = useState("");

  const settings = useLiveQuery(async () => {
    return db.settings.where({ id: "general" }).first();
  });

  useEffect(() => {
    if (settings?.openAiApiKey) {
      setValue(settings.openAiApiKey);
    }
    if (settings?.openAiModel) {
      setModel(settings.openAiModel);
    }
    if (settings?.openAiApiType) {
      setType(settings.openAiApiType);
    }
    if (settings?.openAiApiAuth) {
      setAuth(settings.openAiApiAuth);
    }
    if (settings?.openAiApiBase) {
      setBase(settings.openAiApiBase);
    }
    if (settings?.openAiApiVersion) {
      setVersion(settings.openAiApiVersion);
    }
  }, [settings]);

  return (
    <>
      {cloneElement(children, { onClick: open })}
      <Modal opened={opened} onClose={close} title="Configuracion" size="lg">
        <Stack>
          <form
            onSubmit={async (event) => {
              try {
                setSubmitting(true);
                event.preventDefault();
                await checkOpenAIKey(value);
                await db.settings.where({ id: "general" }).modify((apiKey) => {
                  apiKey.openAiApiKey = value;
                  console.log(apiKey);
                });
                notifications.show({
                  title: "Guardado",
                  message: "Su Api Key ha sido guardado.",
                });
              } catch (error: any) {
                if (error.toJSON().message === "Network Error") {
                  notifications.show({
                    title: "Error",
                    color: "red",
                    message: "Sin conexcion a internet",
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
            <Flex gap="xs" align="end">
              <PasswordInput
                label="OpenAI API Key"
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                sx={{ flex: 1 }}
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
                formNoValidate
              />
              <Button type="submit" loading={submitting}>
                Guardar
              </Button>
            </Flex>
          </form>
          <List withPadding>
            <List.Item>
              <Text size="sm">
                <Anchor
                  href="https://platform.openai.com/account/api-keys"
                  target="_blank"
                >
                  Obten tu API key
                </Anchor>
              </Text>
            </List.Item>
            <List.Item>
              <Text size="sm" color="dimmed">
                Su API Key es guardada en el navegador y nunca se envia a ningun lado.
              </Text>
            </List.Item>
          </List>
          <Select
            label="Tipo OpenAI"
            value={type}
            onChange={async (value) => {
              setSubmitting(true);
              try {
                await db.settings.update("general", {
                  openAiApiType: value ?? 'openai',
                });
                notifications.show({
                  title: "Guardado",
                  message: "Su OpenAI key ha sido guardada.",
                });
              } catch (error: any) {
                if (error.toJSON().message === "Network Error") {
                  notifications.show({
                    title: "Error",
                    color: "red",
                    message: "Sin conexion a Internet.",
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
            withinPortal
            data={[{ "value": "openai", "label": "OpenAI"}, { "value": "custom", "label": "Custom (e.g. Azure OpenAI)"}]}
          />
          <Select
            label="Modelo OpenAI (Solo OpenAI)"
            value={model}
            onChange={async (value) => {
              setSubmitting(true);
              try {
                await db.settings.update("general", {
                  openAiModel: value ?? undefined,
                });
                notifications.show({
                  title: "Guardado",
                  message: "SU Modelo ha sido guardado.",
                });
              } catch (error: any) {
                if (error.toJSON().message === "Network Error") {
                  notifications.show({
                    title: "Error",
                    color: "red",
                    message: "Sin Conexcion a Internet.",
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
            withinPortal
            data={config.availableModels}
          />
          <Alert color="orange" title="Warning">
          El costo mostrado aún no ha sido actualizado para reflejar los costos de cada modelo. En este momento, siempre mostrará el costo para GPT-3.5 en OpenAI.
          </Alert>
          <Select
            label="OpenAI Auth (Solo Custom)"
            value={auth}
            onChange={async (value) => {
              setSubmitting(true);
              try {
                await db.settings.update("general", {
                  openAiApiAuth: value ?? 'none',
                });
                notifications.show({
                  title: "Guardado",
                  message: "Su OpenAI Auth ha sido guardada.",
                });
              } catch (error: any) {
                if (error.toJSON().message === "Network Error") {
                  notifications.show({
                    title: "Error",
                    color: "red",
                    message: "Sin Conexcion a Internet.",
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
            withinPortal
            data={[{ "value": "none", "label": "None"}, { "value": "bearer-token", "label": "Bearer Token"}, { "value": "api-key", "label": "API Key"}]}
          />
          <form
            onSubmit={async (event) => {
              try {
                setSubmitting(true);
                event.preventDefault();
                await db.settings.where({ id: "general" }).modify((row) => {
                  row.openAiApiBase = base;
                  console.log(row);
                });
                notifications.show({
                  title: "Saved",
                  message: "Su OpenAI Base ha sido guardada.",
                });
              } catch (error: any) {
                if (error.toJSON().message === "Network Error") {
                  notifications.show({
                    title: "Error",
                    color: "red",
                    message: "Sin Conexcion a Internet.",
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
            <Flex gap="xs" align="end">
              <TextInput
                label="OpenAI API Base (Custom Only)"
                placeholder="https://<resource-name>.openai.azure.com/openai/deployments/<deployment>"
                sx={{ flex: 1 }}
                value={base}
                onChange={(event) => setBase(event.currentTarget.value)}
                formNoValidate
              />
              <Button type="submit" loading={submitting}>
                Guardar
              </Button>
            </Flex>
          </form>
          <form
            onSubmit={async (event) => {
              try {
                setSubmitting(true);
                event.preventDefault();
                await db.settings.where({ id: "general" }).modify((row) => {
                  row.openAiApiVersion = version;
                  console.log(row);
                });
                notifications.show({
                  title: "Guardado",
                  message: "Su version de OpenAI se ha guardado.",
                });
              } catch (error: any) {
                if (error.toJSON().message === "Network Error") {
                  notifications.show({
                    title: "Error",
                    color: "red",
                    message: "Sin Conexcion oa Internet.",
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
            <Flex gap="xs" align="end">
              <TextInput
                label="OpenAI API Version (Custom Only)"
                placeholder="2023-03-15-preview"
                sx={{ flex: 1 }}
                value={version}
                onChange={(event) => setVersion(event.currentTarget.value)}
                formNoValidate
              />
              <Button type="submit" loading={submitting}>
                Guardar
              </Button>
            </Flex>
          </form>
        </Stack>
      </Modal>
    </>
  );
}
