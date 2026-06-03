import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            cardBox: 'shadow-2xl shadow-orange-500/10',
            card: 'bg-[#141414] border border-[#2A2A2A]',
            headerTitle: 'text-white',
            headerSubtitle: 'text-[#737373]',
            socialButtonsBlockButton: 'bg-[#1A1A1A] border-[#2A2A2A] text-white hover:bg-[#2A2A2A]',
            formFieldLabel: 'text-[#A0A0A0]',
            formFieldInput: 'bg-[#1A1A1A] border-[#2A2A2A] text-white',
            formButtonPrimary: 'bg-[#FF8000] hover:bg-[#E67300]',
            footerActionLink: 'text-[#FF8000] hover:text-[#E67300]',
            identityPreviewEditButton: 'text-[#FF8000]',
            formFieldAction: 'text-[#FF8000]',
          },
        }}
        forceRedirectUrl="/"
      />
    </div>
  );
}
