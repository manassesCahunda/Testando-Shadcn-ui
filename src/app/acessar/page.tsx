"use client"
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AnimatedAgencyCarousel } from "@/components/ui/Animated";
import { app } from "@/firebaseConfig";
import { getAuth, signInWithEmailAndPassword ,sendPasswordResetEmail} from "firebase/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function Acessar() {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth(app);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, values.email, values.password).then(()=>{
        router.push('/dashboard');
        console.log("alerta")
      });
    } catch (error) {
      setErrorMessage("Credenciais inválidas. Por favor, verifique seu email e senha.");
      console.error("Erro ao fazer login:", error.message);
    }
  };

  const resert = async (values: z.infer<typeof formSchema>) => {
    try {
      if(values.email){
        await sendPasswordResetEmail(auth, values.email).then(()=>{
          setErrorMessage("Foi lhe enviado um link para redefiner a palavra-passe"+values.email);
          console.log("alerta")
        });
      }
      else{
        setErrorMessage("Campo de Email Vazio");
      }
    } catch (error) {
      setErrorMessage("Campo de Email Vazio");
      console.error("Erro ao fazer login:", error.message);
    }
  };

  return (
    <section className="bg-black dark:bg-gray-900">
      <div className="flex flexbox-rows items-center justify-center mx-auto">
        <AnimatedAgencyCarousel />
        <div className="fixed bg-white rounded-lg shadow">
          <div className="p-5">
            <br />
            <Form  {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</FormLabel>
                      <FormControl>
                        <Input value={email} onChangeText={setEmail}  style={{ width: 270 }} className="h-18 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="email" placeholder="Digite o seu email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Senha</FormLabel>
                      <FormControl>
                        <Input value={password} onChangeText={setPassword} className="h-18 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="password" placeholder="Digite a sua senha" {...field} />
                      </FormControl>
                      <FormMessage>{errorMessage}</FormMessage>
                    </FormItem>
                  )}
                />
                <br />
                <a  href="#" onClick={()=>resert()} className="text-xs font-normal text-gray-500 dark:text-gray-300 hover:underline">Esqueceu sua senha ?</a>
                <br />
                <button
                      type="submit"
                      className="mt-2 mb-2 w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center p-6"
                    >
                      {loading ? (
                        <>
                          <svg
                            aria-hidden="true"
                            role="status"
                            className="inline w-4 h-4 mr-3 text-white animate-spin"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="#E5E7EB"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span>Carregando...</span>
                        </>
                      ) : (
                        "ACESSAR"
                      )}
                    </button>
                <br />
                <a href="/conta" className="text-sm font-medium text-blue-600 hover:underline">Criar conta gratuitamente</a>
                <br />
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
