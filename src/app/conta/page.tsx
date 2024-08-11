"use client"
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { AnimatedAgencyCarousel } from "@/components/ui/Animated";
import { app } from "@/firebaseConfig";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setDoc, doc} from 'firebase/firestore';
import { getFirestore} from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword  , updateProfile} from "firebase/auth";

const formSchema = z.object({
  password: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  check:z.boolean()
});

export default function Conta() {
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(false);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName:"",
      check,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    
    try {

        setLoading(true);

        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password)
        
        const user = userCredential.user;
      
        const currentDate = new Date();

        const formattedDate = currentDate.toISOString().split('T'); 

        const newUser = {
          fullName: fullName,
          email: email,
          account: true,
          uid:user.uid,
          create_date:formattedDate[0],
          amount:0
        };
  
        const userDocRef = doc(db, 'users', user.uid);

        await setDoc(userDocRef, newUser);          
    
        console.log('Documento adicionado com ID:', user.uid);

        await updateProfile(user, {
          displayName: fullName,
        });
  
        router.push('/dashboard');

        console.log("alerta")

    } catch (error) {
      setErrorMessage("Por favor, verifique seu email e senha.");
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
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nome Completo</FormLabel>
                      <FormControl>
                        <Input required value={fullName} onChangeText={setFullName}  style={{ width: 270 }}  className="h-18 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="text" placeholder="Digite o seu email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</FormLabel>
                      <FormControl>
                        <Input value={email} onChangeText={setEmail}  style={{ width: 270 }}   className="h-18 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" type="email" placeholder="Digite o seu email" {...field} />
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
                <FormField
                  control={form.control}
                  name="check"
                  render={({ field }) => (
                  <FormItem>
                    <div class="flex items-center mb-4">
                      <input id="default-checkbox" type="checkbox" checked value={check} onChange={setCheck} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                      <label for="default-checkbox" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Conta Empresárial</label>
                    </div>
                  </FormItem>
                  )}
                />
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
                        "CADASTRAR"
                      )}
                    </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
