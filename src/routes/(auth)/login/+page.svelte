<script lang="ts">
  import LoginForm from "$lib/features/(auth)/login/login-form.svelte";

  let { data } = $props();
</script>

<div
  class="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10"
>
  <div class="w-full max-w-sm md:max-w-3xl">
    <LoginForm form={data.form} />
  </div>
</div>
