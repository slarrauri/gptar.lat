import {
  Badge,
  Button,
  Center,
  Container,
  Group,
  SimpleGrid,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCloudDownload,
  IconCurrencyDollar,
  IconKey,
  IconLock,
  IconNorthStar,
} from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import { Logo } from "../components/Logo";
import { SettingsModal } from "../components/SettingsModal";
import { db } from "../db";
import { config } from "../utils/config";

export function IndexRoute() {
  const settings = useLiveQuery(() => db.settings.get("general"));
  const { openAiApiKey } = settings ?? {};

  return (
    <>
      <Center py="xl" sx={{ height: "100%" }}>
        <Container size="sm">
          <Badge mb="lg">Listo Para GPT-4</Badge>
          <Text>
            <Logo style={{ maxWidth: 240 }} />
          </Text>
          <Text mt={4} size="xl">
           ChatGPT en Español
          </Text>
          <SimpleGrid
            mt={50}
            cols={3}
            spacing={30}
            breakpoints={[{ maxWidth: "md", cols: 1 }]}
          >
            {features.map((feature) => (
              <div key={feature.title}>
                <ThemeIcon variant="outline" size={50} radius={50}>
                  <feature.icon size={26} stroke={1.5} />
                </ThemeIcon>
                <Text mt="sm" mb={7}>
                  {feature.title}
                </Text>
                <Text size="sm" color="dimmed" sx={{ lineHeight: 1.6 }}>
                  {feature.description}
                </Text>
              </div>
            ))}
          </SimpleGrid>
          <Group mt={50}>
            {config.allowSettingsModal && (
              <SettingsModal>
                <Button
                  size="md"
                  variant={openAiApiKey ? "light" : "filled"}
                  leftIcon={<IconKey size={20} />}
                >
                  {openAiApiKey ? "Cambiar OpenAI Key" : "Ingresar OpenAI Key"}
                </Button>
              </SettingsModal>
            )}
            {config.showDownloadLink && !window.todesktop && (
              <Button
                component="a"
                href="https://gpt.ar"
                size="md"
                variant="outline"
                leftIcon={<IconCloudDownload size={20} />}
              >
               Integraciones Para Empresas 
              </Button>
            )}
          </Group>
        </Container>
      </Center>
    </>
  );
}

const features = [
  {
  icon: IconCurrencyDollar,
  title: "Integra ChatGPT en tu empresa",
  description:
  "¡Aprovecha la potencia de ChatGPT en tu negocio a bajos costos!",
  },
  {
  icon: IconLock,
  title: "Enfoque en la privacidad",
  description:
  "Sin rastreo, sin cookies, sin tonterías. Todos tus datos se almacenan localmente.",
  },
  {
  icon: IconNorthStar,
  title: "Potentes integraciones empresariales",
  description:
  "¿Deseas integrar el poder de ChatGPT en tu negocio?",
  },
  ];
