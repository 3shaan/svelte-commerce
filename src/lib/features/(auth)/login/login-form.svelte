<script lang="ts">
  import * as Card from "$lib/components/ui/card/index.js";
  import {
    FieldGroup,
    Field,
    FieldLabel,
    FieldDescription,
    FieldSeparator,
  } from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { cn } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  import { superForm, type SuperValidated } from "sveltekit-superforms";
  import type { LoginSchema } from "$lib/server/(auth)/login/login.schema";
  import { enhance } from "$app/forms";
  import FieldError from "$lib/components/ui/field/field-error.svelte";

  interface Props {
    form: SuperValidated<LoginSchema>;
  }

  let {
    form: initialForm,
    class: className,
    ...restProps
  }: HTMLAttributes<HTMLDivElement> & Props = $props();

  let { form, errors, constraints, message } = superForm(initialForm);

  const id = $props.id();
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
  <Card.Root class="overflow-hidden p-0">
    <Card.Content class="grid p-0 md:grid-cols-2">
      <form class="p-6 md:p-8" method="POST">
        <FieldGroup>
          <div class="flex flex-col items-center gap-2 text-center">
            <h1 class="text-2xl font-bold">Welcome back</h1>
            <p class="text-muted-foreground text-balance">
              Login to your Acme svelte Ecommerce account
            </p>
          </div>
          <Field>
            <FieldLabel for="email-{id}">Email</FieldLabel>
            <Input
              id="email-{id}"
              type="email"
              placeholder="m@example.com"
              required
              bind:value={$form.email}
              {...$constraints.email}
            />
            {#if $errors.email}
              <FieldError>
                {$errors.email}
              </FieldError>
            {/if}
          </Field>
          <Field>
            <div class="flex items-center">
              <FieldLabel for="password-{id}">Password</FieldLabel>
              <!-- <a
                href="##"
                class="ms-auto text-sm underline-offset-2 hover:underline"
              >
                Forgot your password?
              </a> -->
            </div>
            <Input
              id="password-{id}"
              type="password"
              required
              bind:value={$form.password}
              {...$constraints.password}
            />
            {#if $errors.password}
              <FieldError>
                {$errors.password}
              </FieldError>
            {/if}
          </Field>
          <Field>
            <Button type="submit">Login</Button>
          </Field>
          <FieldSeparator class="*:data-[slot=field-separator-content]:bg-card">
            Or continue with
          </FieldSeparator>
          <Field class="w-full">
            <Button variant="default" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              <span class="">Login with Google</span>
            </Button>
          </Field>
          <FieldDescription class="text-center">
            Don't have an account? <a href="##">Sign up</a>
          </FieldDescription>
        </FieldGroup>
      </form>
      <div class="bg-muted relative hidden md:block">
        <img
          src="/placeholder.svg"
          alt="placeholder"
          class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </Card.Content>
  </Card.Root>
  <FieldDescription class="px-6 text-center">
    By clicking continue, you agree to our <a href="##">Terms of Service</a> and
    <a href="##">Privacy Policy</a>.
  </FieldDescription>
</div>
