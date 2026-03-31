import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { providerMap, signIn } from "@/app/auth";

const SIGNIN_ERROR_URL = "/error";

export default async function SignInPage(props: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const searchParams = await props.searchParams;
  const callbackUrl = searchParams?.callbackUrl ?? "/dashboard";

  return (
    <div className="flex flex-col gap-2">
      <form
        action={async (formData) => {
          "use server";

          try {
            await signIn("credentials", formData);
          } catch (error) {
            if (error instanceof AuthError) {
              return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
            }

            throw error;
          }
        }}
      >
        <label htmlFor="email">
          Email
          <input name="email" id="email" type="email" />
        </label>

        <label htmlFor="password">
          Password
          <input name="password" id="password" type="password" />
        </label>

        <input type="submit" value="Sign In" />
      </form>

      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            "use server";

            try {
              await signIn(provider.id, {
                redirectTo: callbackUrl,
              });
            } catch (error) {
              if (error instanceof AuthError) {
                return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
              }

              throw error;
            }
          }}
        >
          <button type="submit">
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
      ))}
    </div>
  );
}
