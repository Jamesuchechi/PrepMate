import AuthForm from "@/components/auth/AuthForm";
import PhoneFrame from "@/components/ui/PhoneFrame";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col overflow-hidden font-sans">
      {/* Split Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Side (Content) - approx 60% */}
        <div className="flex-[1.2] relative flex flex-col p-8 md:p-16 py-24">
          {/* Logo at the top left of content area */}
          <div className="mb-12">
            <div className="w-12 h-12 relative">
               <Image 
                  src="/images/logo.png" 
                  alt="PrepMate Logo" 
                  fill 
                  className="object-contain"
               />
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center -mt-20">
            <h1 className="text-[32px] md:text-[40px] lg:text-[46px] font-bold text-white text-center leading-[1.2] mb-12 max-w-lg">
              See everyday moments from <br />
              your <span className="text-accent">future career.</span>
            </h1>

            {/* Stacked Phones Container */}
            <div className="relative w-full max-w-sm h-[500px]">
               {/* Background Left */}
               <div className="absolute left-[-20%] top-[10%] rotate-[-10deg] scale-90 opacity-40">
                  <PhoneFrame>
                    <Image src="/images/showcase-1.png" alt="Showcase 1" fill className="object-cover" />
                  </PhoneFrame>
               </div>
               {/* Background Right */}
               <div className="absolute right-[-20%] top-[10%] rotate-10 scale-90 opacity-40">
                  <PhoneFrame>
                    <Image src="/images/showcase-2.png" alt="Showcase 2" fill className="object-cover" />
                  </PhoneFrame>
               </div>
               {/* Main Foreground Center */}
               <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10">
                  <PhoneFrame className="shadow-[0_0_80px_rgba(56,189,248,0.2)]">
                    <Image src="/images/showcase-3.png" alt="Showcase 3" fill className="object-cover" />
                  </PhoneFrame>
               </div>

               {/* Decorative Emojis (IG style) */}
               <div className="absolute top-[20%] left-[-10%] w-14 h-14 bg-accent/20 backdrop-blur-xl border border-accent/30 rounded-full flex items-center justify-center text-3xl z-20">
                 🤖
               </div>
               <div className="absolute bottom-[20%] right-[-10%] w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-3xl z-20 rotate-12">
                 📈
               </div>
            </div>
          </div>
        </div>

        {/* Right Side (Auth) - approx 40% */}
        <div className="flex-1 bg-[#121212] md:bg-transparent border-t md:border-t-0 md:border-l border-slate-900 flex flex-col items-center justify-center p-8 py-20">
           <AuthForm />
        </div>
      </div>

      {/* Footer (Instagram style) */}
      <footer className="w-full py-16 px-4 flex flex-col items-center bg-black border-t border-slate-900/50">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[12px] text-slate-500 mb-4 font-normal">
          <a href="/about" className="hover:underline">About</a>
          <a href="/features" className="hover:underline">Features</a>
          <a href="/pricing" className="hover:underline">Pricing</a>
          <a href="/blog" className="hover:underline">Blog</a>
          <a href="/careers" className="hover:underline">Careers</a>
          <a href="/help" className="hover:underline">Help</a>
          <a href="/api-docs" className="hover:underline">API</a>
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
        
        <div className="flex items-center gap-4 text-[12px] text-slate-500">
           <div className="flex items-center gap-1 cursor-pointer">
              <span>English</span>
              <svg aria-label="Down chevron icon" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title>Down chevron icon</title><path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"></path></svg>
           </div>
           <span>© 2026 PrepMate from Nexa Hack</span>
        </div>
      </footer>
    </main>
  );
}
