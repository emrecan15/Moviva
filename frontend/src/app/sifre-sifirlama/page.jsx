import ResetPasswordForm from "./_components/ResetPasswordForm";
import Logo from "@/components/ui/Logo";

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const token = params.token;

  return (
    <section className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex flex-col items-center gap-3">
            <Logo />

            <div className="text-center">
              <h1 className="text-2xl font-semibold text-black">
                Şifre Sıfırlama
              </h1>

              <p className="mt-2 text-sm leading-5 text-gray-500">
                Yeni şifrenizi belirleyin. Güvenliğiniz için güçlü bir şifre
                kullanmanızı öneririz.
              </p>
            </div>
          </div>

          <ResetPasswordForm token={token} />
        </div>
      </div>
    </section>
  );
}
