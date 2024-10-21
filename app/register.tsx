import React, { useState } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button } from "@/components/ui/button";
import { TextInput, ActivityIndicator, StatusBar } from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { z } from "zod";
import { ToastDescription, Toast, useToast } from "@/components/ui/toast";
import { CheckCircleIcon } from "lucide-react-native";

const registerSchema = z
  .object({
    nome: z.string().nonempty("O nome é obrigatório"),
    email: z
      .string({ required_error: "O e-mail é obrigatório" })
      .email("Endereço de e-mail inválido")
      .min(1, "O e-mail é obrigatório"),
    senha: z
      .string({ required_error: "A senha é obrigatória" })
      .min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
      .string({ required_error: "A confirmação de senha é obrigatória" })
      .min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.senha === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);
    setError(null);

    try {
      await axios.post("http://192.168.1.23:3000/usuarios", {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      });
      showSuccessToast();
      router.push("./login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const messages = error.response.data.message;
        setError(
          messages.join(", ") || "Registro falhou. Por favor, tente novamente."
        );
      } else {
        setError("Erro desconhecido. Por favor, tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const showSuccessToast = () => {
    const toastId = Math.random().toString();
    toast.show({
      id: toastId,
      placement: "top",
      containerStyle: {
        width: "100%",
      },
      duration: 4000,
      render: ({ id }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast
            nativeID={uniqueToastId}
            action="muted"
            variant="solid"
            className="w-full bg-gray-800/50 backdrop-blur-sm border-green-500 p-4 rounded-lg shadow-lg border flex-row items-center"
            style={{
              marginTop: StatusBar.currentHeight
                ? StatusBar.currentHeight + 20
                : 20,
            }}
          >
            <CheckCircleIcon size={24} color="#22c55e" className="mr-2" />
            <VStack className="ml-3">
              <ToastDescription className="text-md text-semibold text-green-500">
                Conta criada com sucesso
              </ToastDescription>
            </VStack>
          </Toast>
        );
      },
    });
  };

  return (
    <SafeAreaView>
      <LinearGradient
        className="flex-col items-center justify-center w-full h-full"
        colors={["#111827", "#1e3a8a", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Card className="flex-col items-center rounded-lg border text-card-foreground w-full max-w-md shadow-lg bg-gray-800/50 backdrop-blur-sm border-blue-500">
          <VStack space="xs" className="w-11/12 mt-3">
            <Heading
              className="whitespace-nowrap tracking-tight text-3xl font-bold text-center text-gray-100"
              size="3xl"
            >
              Crie uma Conta
            </Heading>
            <Text className="text-sm text-center text-gray-400">
              Comece hoje sua nova biblioteca pessoal
            </Text>
          </VStack>
          <VStack className="w-11/12 flex-col items-center mb-4">
            <VStack space="xs" className="mt-12 w-11/12">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Nome
              </Text>
              <Controller
                control={control}
                name="nome"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`flex h-10 rounded-md border text-sm placeholder:text-muted-foreground px-2 w-full bg-gray-700 text-gray-100 ${
                      errors.nome ? "border-red-500" : "border-blue-500"
                    }`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Seu Nome"
                    placeholderTextColor={"#9ca3af"}
                  />
                )}
              />
              {errors.nome && (
                <Text className="text-red-500 mt-1">
                  {errors.nome.message as string}
                </Text>
              )}
            </VStack>
            <VStack space="xs" className="mt-5 w-11/12">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Email
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`flex h-10 rounded-md border text-sm placeholder:text-muted-foreground px-2 w-full bg-gray-700 text-gray-100 ${
                      errors.email ? "border-red-500" : "border-blue-500"
                    }`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="email@exemplo.com"
                    placeholderTextColor={"#9ca3af"}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 mt-1">
                  {errors.email.message as string}
                </Text>
              )}
            </VStack>
            <VStack space="xs" className="mt-5 w-11/12">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Senha
              </Text>
              <Controller
                control={control}
                name="senha"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`flex h-10 rounded-md border text-sm placeholder:text-muted-foreground px-2 w-full bg-gray-700 text-gray-100 ${
                      errors.senha ? "border-red-500" : "border-blue-500"
                    }`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Senha"
                    placeholderTextColor={"#9ca3af"}
                    secureTextEntry
                  />
                )}
              />
              {errors.senha && (
                <Text className="text-red-500 mt-1">
                  {errors.senha.message as string}
                </Text>
              )}
            </VStack>
            <VStack space="xs" className="mt-5 w-11/12">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Confirmar Senha
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`flex h-10 rounded-md border text-sm placeholder:text-muted-foreground px-2 w-full bg-gray-700 text-gray-100 ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-blue-500"
                    }`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Confirmar Senha"
                    placeholderTextColor={"#9ca3af"}
                    secureTextEntry
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text className="text-red-500 mt-1">
                  {errors.confirmPassword.message as string}
                </Text>
              )}
            </VStack>
            {error && <Text className="text-red-500 mt-4">{error}</Text>}
            <Button
              className={`w-11/12 mt-8 rounded-md ${
                isValid
                  ? "bg-blue-600 data-[active=true]:bg-blue-600/80"
                  : "bg-gray-400"
              }`}
              size="lg"
              onPress={handleSubmit(onSubmit)}
              disabled={!isValid || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white" bold>
                  Cadastrar
                </Text>
              )}
            </Button>
          </VStack>
          <HStack className="w-full flex-row items-center justify-center p-6">
            <Text className="text-slate-400 mr-2">Já possui uma conta?</Text>
            <Text
              bold
              className="text-blue-400 hover:text-blue-300"
              onPress={() =>
                router.push({
                  pathname: "./login",
                })
              }
            >
              Faça login aqui
            </Text>
          </HStack>
        </Card>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Register;
