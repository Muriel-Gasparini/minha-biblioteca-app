import React from "react";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";

const Register = () => {
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
                Email
              </Text>
              <Input
                size="lg"
                className="flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 border-blue-500 text-gray-100"
              >
                <InputField
                  type="text"
                  cursorColor={"#3b82f6"}
                  placeholder="email@exemplo.com"
                  placeholderTextColor={"#4b5563"}
                />
              </Input>
            </VStack>
            <VStack space="xs" className="mt-5 w-11/12">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Senha
              </Text>
              <Input
                size="lg"
                className="flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 border-blue-500 text-gray-100"
              >
                <InputField size="lg" type="password" cursorColor={"#3b82f6"} />
              </Input>
            </VStack>
            <VStack space="xs" className="mt-5 w-11/12">
              <Text className="text-sm font-medium leading-none text-gray-100">
                Confirmar Senha
              </Text>
              <Input
                size="lg"
                className="flex h-10 rounded-md border text-sm placeholder:text-muted-foreground w-full bg-gray-700 border-blue-500 text-gray-100"
              >
                <InputField size="lg" type="password" cursorColor={"#3b82f6"} />
              </Input>
            </VStack>
            <Button className="w-11/12 mt-5 bg-blue-600 rounded-md" size="lg">
              <Text className="text-white" bold>
                Cadastrar
              </Text>
            </Button>
          </VStack>
          <HStack className="w-full flex-row items-center justify-center p-6">
            <Text className="text-slate-400 mr-2">Já possui uma conta?</Text>
            <Text
              bold
              className="text-blue-400 hover:text-blue-300"
              onPress={() =>
                router.push({
                  pathname: "./",
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
