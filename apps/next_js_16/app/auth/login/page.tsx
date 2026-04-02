"use client"
import { loginSchema } from "@/app/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form"
import { FieldError, FieldGroup, FieldLabel,Field } from "@/components/ui/field";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage(){
    const router = useRouter();
    const form = useForm({
            resolver: zodResolver(loginSchema), 
            defaultValues: {
                email: "",
                password: "",
            },
        });
    async function onSubmit(data : z.infer<typeof loginSchema>){
            await authClient.signIn.email({
                email : data.email,
                password:data.password,
                fetchOptions : {
                    onSuccess: ()=>{
                        toast.success("Logged in succesfully");
                        router.push("/");
                    },
                    onError: (error)=>{
                        toast.error(error.error.message)
                    }
                }
            });
            
        }
    return(
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">

                        <Controller name="email" control={form.control} render={({field, fieldState})=>(
                            <Field>
                                <FieldLabel>Email</FieldLabel>
                                <Input type="email" aria-invalid={fieldState.invalid} placeholder="john@doe.com" {...field}/>
                                {fieldState.invalid &&(
                                    <FieldError errors={[fieldState.error]}/>
                                )}

                                
                            </Field>

                        )}/>
                        <Controller name="password" control={form.control} render={({field, fieldState})=>(
                            <Field>
                                <FieldLabel>password</FieldLabel>
                                <Input aria-invalid={fieldState.invalid} type="password" placeholder="******" {...field}/>
                                {fieldState.invalid &&(
                                    <FieldError errors={[fieldState.error]}/>
                                )}

                                
                            </Field>

                        )}/>
                        <Button >Login</Button>

                        
                    </FieldGroup>


                </form>
            </CardContent>
        </Card>
    );
}