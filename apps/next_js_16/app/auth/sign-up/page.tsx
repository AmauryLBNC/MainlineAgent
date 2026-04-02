"use client"
import { signUpSchema } from "@/app/schemas/auth"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import { FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import  {authClient} from "@/lib/auth-client"
import z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function SignUpPage(){
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(signUpSchema), 
        defaultValues: {
            email: "",
            name: "",
            password: "",
        },
    });
    async function onSubmit(data : z.infer<typeof signUpSchema>){
        await authClient.signUp.email({
            email : data.email,
            name: data.name,
            password:data.password,
            fetchOptions : {
                onSuccess: ()=>{
                    toast.success("Account created Succesfully");
                    router.push("/");
                },
                onError: (error)=>{
                    toast.error(error.error.message)
                }
            }
        });
        
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Create an account to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
                        <Controller name="name" control={form.control} render={({field, fieldState})=>(
                            <Field>
                                <FieldLabel>Full name</FieldLabel>
                                <Input aria-invalid={fieldState.invalid} placeholder="John Doe" {...field}/>
                                {fieldState.invalid &&(
                                    <FieldError errors={[fieldState.error]}/>
                                )}

                                
                            </Field>

                        )}/>
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
                        <Button>Sign Up</Button>

                        
                    </FieldGroup>


                </form>
            </CardContent>
        </Card>
    )
}