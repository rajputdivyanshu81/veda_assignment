import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex-1 bg-[#FDFDFD] flex items-center justify-center px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-white border border-gray-200 shadow-xl',
            headerTitle: 'text-[#1A1A1A]',
            headerSubtitle: 'text-gray-500',
            socialButtonsBlockButton: 'border-gray-200 bg-white hover:bg-gray-50 text-gray-800',
            socialButtonsBlockButtonText: 'text-gray-800',
            dividerLine: 'bg-gray-200',
            dividerText: 'text-gray-400',
            formFieldLabel: 'text-gray-700',
            formFieldInput: 'bg-gray-50 border-gray-200 text-gray-900',
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
