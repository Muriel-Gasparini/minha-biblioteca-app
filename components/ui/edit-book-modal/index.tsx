import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "../modal";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  RadioGroup,
  Radio,
  RadioIndicator,
  RadioIcon,
  RadioLabel,
} from "../radio";
import { CircleIcon } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ActivityIndicator } from "react-native";
import { IBook } from "@/app/home";
import axiosInstance from "@/app/utils/axios-instance";

const editBookSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório"),
  autor: z.string().min(1, "O autor é obrigatório"),
  anoPublicacao: z
    .number({ invalid_type_error: "Ano de publicação deve ser um número" })
    .int("Ano de publicação deve ser um número inteiro")
    .min(1300, "Ano de publicação é muito antigo")
    .max(new Date().getFullYear(), "Não é permitido livros do futuro"),
  genero: z.string().min(1, "O gênero é obrigatório"),
  statusLeitura: z.enum(["LIDO", "NAO_LIDO"], {
    errorMap: () => ({ message: "Status de leitura inválido" }),
  }),
});

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: IBook | null;
  onSave: () => void;
}

const EditBookModal: React.FC<EditBookModalProps> = ({
  isOpen,
  onClose,
  book,
  onSave,
}) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm({
    resolver: zodResolver(editBookSchema),
    mode: "onChange",
    defaultValues: {
      titulo: book?.titulo || "",
      autor: book?.autor || "",
      anoPublicacao: book?.anoPublicacao || 0, // Ensure this is a number
      genero: book?.genero || "",
      statusLeitura: book?.statusLeitura || "NAO_LIDO",
    },
  });

  useEffect(() => {
    if (book) {
      reset({
        titulo: book.titulo || "",
        autor: book.autor || "",
        anoPublicacao: book.anoPublicacao || 0,
        genero: book.genero || "",
        statusLeitura: book.statusLeitura || "NAO_LIDO",
      });
      trigger();
    }
  }, [book, reset, trigger]);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      await axiosInstance.patch(`/livros/${book?.id}`, data);
      onSave();
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent className="w-11/12 border p-6 shadow-lg bg-gray-900/90 backdrop-blur-sm border-blue-500">
        <ModalHeader>
          <VStack>
            <Heading size="md" className="text-typography-950">
              Editar Livro
            </Heading>
            <Text className="text-sm text-gray-400">
              Atualize os detalhes do livro
            </Text>
          </VStack>
          <ModalCloseButton onPress={onClose} />
        </ModalHeader>
        <ModalBody>
          <VStack className="w-full h-full items-center mt-3">
            <VStack space="xs" className="w-11/12 mb-6">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Título
              </Text>
              <Controller
                control={control}
                name="titulo"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    className={`flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 ${
                      errors.titulo ? "border-red-500" : "border-blue-500"
                    } text-gray-100`}
                  >
                    <InputField
                      type="text"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      cursorColor={"#3b82f6"}
                      placeholderTextColor={"#4b5563"}
                    />
                  </Input>
                )}
              />
              {errors.titulo && (
                <Text className="text-red-500 mt-1">
                  {errors.titulo.message}
                </Text>
              )}
            </VStack>
            <VStack space="xs" className="w-11/12 mb-6">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Autor
              </Text>
              <Controller
                control={control}
                name="autor"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    className={`flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 ${
                      errors.autor ? "border-red-500" : "border-blue-500"
                    } text-gray-100`}
                  >
                    <InputField
                      type="text"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      cursorColor={"#3b82f6"}
                      placeholderTextColor={"#4b5563"}
                    />
                  </Input>
                )}
              />
              {errors.autor && (
                <Text className="text-red-500 mt-1">
                  {errors.autor.message}
                </Text>
              )}
            </VStack>
            <VStack space="xs" className="w-11/12 mb-6">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Ano de Publicação
              </Text>
              <Controller
                control={control}
                name="anoPublicacao"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    className={`flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 ${
                      errors.anoPublicacao
                        ? "border-red-500"
                        : "border-blue-500"
                    } text-gray-100`}
                  >
                    <InputField
                      type="text"
                      value={value.toString()}
                      onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, "");
                        onChange(numericValue ? parseInt(numericValue, 10) : 0);
                      }}
                      onBlur={onBlur}
                      cursorColor={"#3b82f6"}
                      placeholderTextColor={"#4b5563"}
                    />
                  </Input>
                )}
              />
              {errors.anoPublicacao && (
                <Text className="text-red-500 mt-1">
                  {errors.anoPublicacao.message}
                </Text>
              )}
            </VStack>
            <VStack space="xs" className="w-11/12 mb-6">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Gênero
              </Text>
              <Controller
                control={control}
                name="genero"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    size="lg"
                    className={`flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 ${
                      errors.genero ? "border-red-500" : "border-blue-500"
                    } text-gray-100`}
                  >
                    <InputField
                      type="text"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      cursorColor={"#3b82f6"}
                      placeholderTextColor={"#4b5563"}
                    />
                  </Input>
                )}
              />
              {errors.genero && (
                <Text className="text-red-500 mt-1">
                  {errors.genero.message}
                </Text>
              )}
            </VStack>
            <VStack className="w-11/12 justify-start">
              <Text className="text-sm font-medium leading-none text-gray-100 mb-2">
                Status da Leitura
              </Text>
              <Controller
                control={control}
                name="statusLeitura"
                render={({ field: { onChange, value } }) => (
                  <RadioGroup value={value} onChange={onChange}>
                    <Radio value="LIDO" size="md">
                      <RadioIndicator>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>Lido</RadioLabel>
                    </Radio>
                    <Radio value="NAO_LIDO" size="md">
                      <RadioIndicator>
                        <RadioIcon as={CircleIcon} />
                      </RadioIndicator>
                      <RadioLabel>Não Lido</RadioLabel>
                    </Radio>
                  </RadioGroup>
                )}
              />
              {errors.statusLeitura && (
                <Text className="text-red-500 mt-1">
                  {errors.statusLeitura.message}
                </Text>
              )}
            </VStack>
            <Button
              onPress={handleSubmit(onSubmit)}
              className={`w-11/12 mt-4 ${
                isValid
                  ? "bg-blue-600 data-[active=true]:bg-blue-600/80"
                  : "bg-gray-400"
              }`}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-gray-100">Salvar</Text>
              )}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditBookModal;
