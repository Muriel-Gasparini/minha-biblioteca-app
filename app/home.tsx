import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { router } from "expo-router";
import { Box } from "@/components/ui/box";
import { SafeAreaView, StatusBar } from "react-native";
import {
  AddIcon,
  CircleIcon,
  CloseIcon,
  Icon,
  SearchIcon,
} from "@/components/ui/icon";
import { Book, LogOut } from "lucide-react-native";
import { Badge } from "@/components/ui/badge";
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";

const Home = () => {
  return (
    <SafeAreaView style={{ marginTop: StatusBar.currentHeight }}>
      <LinearGradient
        className="flex-col w-full h-full"
        colors={["#111827", "#1e3a8a", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Box className="mb-6 w-full h-24 bg-gray-800/50 backdrop-blur-sm border-b border-blue-500 py-6 px-4 flex flex-row justify-between items-center">
          <HStack>
            <Text className="text-3xl font-bold text-gray-100 ">
              Minha Biblioteca
            </Text>
          </HStack>
          <VStack>
            <Button
              onPress={() => router.push("./")}
              className="border text-card-foreground shadow-sm overflow-hidden hover:shadow-lg bg-gray-800/50 backdrop-blur-sm border-blue-500"
            >
              <LogOut color="white" size={20} />
            </Button>
          </VStack>
        </Box>
        <VStack className="w-full flex-col items-center mb-6  ">
          <Input
            size="lg"
            className="p-1 h-12 flex w-11/12  rounded-md border text-sm placeholder:text-muted-foreground bg-gray-700 border-blue-500 text-gray-100"
          >
            <InputSlot>
              <InputIcon className="ml-2" as={SearchIcon} />
            </InputSlot>

            <InputField
              size="lg"
              type="text"
              cursorColor={"#3b82f6"}
              placeholder="Pesquisar por título ou autor"
              placeholderTextColor={"#4b5563"}
            />
          </Input>
        </VStack>
        <VStack className="w-full flex-col items-center mb-6 ">
          <Card className="w-11/12 p-6 rounded-lg border text-card-foreground shadow-sm overflow-hidden hover:shadow-lg bg-gray-800/50 backdrop-blur-sm border-blue-500">
            <HStack className="justify-between align-items-center mb-4">
              <Book color="#3b82f6" size={50} />
              <Badge
                action="success"
                variant="solid"
                className="text-center px-4 whitespace-nowrap rounded-full border border-white h-8 font-semibold bg-green-600 text-white"
              >
                <Text className="text-gray-100 text-sm text-center">Lido</Text>
              </Badge>
            </HStack>
            <Text className="text-xl font-semibold text-gray-100 mb-2">
              To Kill a Mockingbird
            </Text>
            <Text className="text-sm text-gray-300 mb-1">Harper Lee</Text>
            <Text className="text-xs text-gray-400">1960</Text>
          </Card>

          <Card className="mt-6 w-11/12 p-6 rounded-lg border text-card-foreground shadow-sm overflow-hidden hover:shadow-lg bg-gray-800/50 backdrop-blur-sm border-blue-500">
            <HStack className="justify-between align-items-center mb-4">
              <Book color={"#3b82f6"} size={50} />
              <Badge
                action="error"
                variant="solid"
                className="text-center px-4 whitespace-nowrap rounded-full border border-white h-8 font-semibold bg-red-600 text-white"
              >
                <Text className="text-gray-100 text-sm text-center">
                  Não Lido
                </Text>
              </Badge>
            </HStack>
            <Text className="text-xl font-semibold text-gray-100 mb-2">
              Pride and Prejudice
            </Text>
            <Text className="text-sm text-gray-300 mb-1">Jane Austen</Text>
            <Text className="text-xs text-gray-400">1813</Text>
          </Card>
        </VStack>
        <Fab
          size="md"
          className="border hover:bg-blue-700 text-card-foreground shadow-sm overflow-hidden hover:shadow-lg bg-gray-800/50 backdrop-blur-sm border-blue-500"
          placement="bottom right"
        >
          <FabIcon as={AddIcon} className="text-gray-100" />
          <FabLabel className="text-gray-100">Novo Livro</FabLabel>
        </Fab>
      </LinearGradient>

      <Modal isOpen size="md">
        <ModalBackdrop />
        <ModalContent className="w-11/12 border p-6 shadow-lg bg-gray-900/90 backdrop-blur-sm border-blue-500">
          <ModalHeader>
            <VStack>
              <Heading size="md" className="text-typography-950">
                Adicionar Novo Livro
              </Heading>
              <Text className="text-sm text-gray-400">
                Informe os detalhes do novo livro
              </Text>
            </VStack>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <VStack className="w-full h-full items-center">
              <VStack space="xs" className="w-11/12 mb-4">
                <Text className="text-sm font-medium leading-none text-gray-100">
                  Titulo
                </Text>
                <Input
                  size="lg"
                  className="flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 border-blue-500 text-gray-100"
                >
                  <InputField
                    type="text"
                    cursorColor={"#3b82f6"}
                    placeholderTextColor={"#4b5563"}
                  />
                </Input>
              </VStack>
              <VStack space="xs" className="w-11/12 mb-4">
                <Text className="text-sm font-medium leading-none text-gray-100">
                  Autor
                </Text>
                <Input
                  size="lg"
                  className="flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 border-blue-500 text-gray-100"
                >
                  <InputField
                    type="text"
                    cursorColor={"#3b82f6"}
                    placeholderTextColor={"#4b5563"}
                  />
                </Input>
              </VStack>
              <VStack space="xs" className="w-11/12 mb-4">
                <Text className="text-sm font-medium leading-none text-gray-100">
                  Ano da Publicação
                </Text>
                <Input
                  size="lg"
                  className="flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 border-blue-500 text-gray-100"
                >
                  <InputField
                    type="text"
                    cursorColor={"#3b82f6"}
                    placeholderTextColor={"#4b5563"}
                  />
                </Input>
              </VStack>
              <VStack className="w-11/12 justify-start">
                <Text className="text-sm font-medium leading-none text-gray-100 mb-2">
                  Status da leitura
                </Text>
                <RadioGroup>
                  <Radio
                    value="change"
                    size="md"
                    isInvalid={false}
                    isDisabled={false}
                  >
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel className="text-sm">Lido</RadioLabel>
                  </Radio>
                  <Radio
                    value="change"
                    size="md"
                    isInvalid={false}
                    isDisabled={false}
                  >
                    <RadioIndicator>
                      <RadioIcon as={CircleIcon} />
                    </RadioIndicator>
                    <RadioLabel className="text-sm">Não lido</RadioLabel>
                  </Radio>
                </RadioGroup>
              </VStack>
              <Button className="w-11/12 mt-8 bg-blue-600 rounded-md" size="lg">
                <Text className="text-white" bold>
                  Adicionar Livro
                </Text>
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
