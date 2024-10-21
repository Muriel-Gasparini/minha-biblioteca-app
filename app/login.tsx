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
import { TextInput, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/app/context/auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z
    .string({ required_error: "O e-mail é obrigatório" })
    .email("Endereço de e-mail inválido")
    .min(1, "O e-mail é obrigatório"),
  senha: z
    .string({ required_error: "A senha é obrigatória" })
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const Login = () => {
  const { login, error } = useAuth();
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FieldValues) => {
    setLoading(true);
    await login(data.email, data.senha);
    setLoading(false);
  };

  return (
    <SafeAreaView>
      <LinearGradient
        className="md:flex flex-col items-center justify-center md:w-full h-full"
        colors={["#111827", "#1e3a8a", "#111827"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Card className="w-10/11 flex-col items-center rounded-lg border text-card-foreground w-full max-w-md shadow-lg bg-gray-800/50 backdrop-blur-sm border-blue-500">
          <VStack space="xs" className="w-11/12 mt-3">
            <Heading
              className="whitespace-nowrap tracking-tight text-3xl font-bold text-center text-gray-100"
              size="3xl"
            >
              Seja bem vindo
            </Heading>
            <Text className="text-sm text-center text-gray-400">
              Faça login para acessar sua biblioteca
            </Text>
          </VStack>
          <VStack className="w-11/12 flex-col items-center mb-6">
            <VStack space="xs" className="mt-12 w-11/12">
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
            <VStack space="xs" className="mt-8 w-11/12">
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
                  Entrar
                </Text>
              )}
            </Button>
          </VStack>
          <HStack className="w-full flex-row items-center justify-center p-6">
            <Text className="text-slate-400 mr-2">Não possui uma conta?</Text>
            <Text
              bold
              className="text-blue-400 hover:text-blue-300"
              onPress={() =>
                router.push({
                  pathname: "./register",
                })
              }
            >
              Cadastre-se aqui
            </Text>
          </HStack>
        </Card>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Login;
