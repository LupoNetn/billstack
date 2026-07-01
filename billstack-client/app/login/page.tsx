// ── Premium Login Page ─────────────────────────────────────────────────────────

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ArrowRight, Shield, Zap as Bolt, BarChart3, Lock } from 'lucide-react';
import { useLogin } from '@/lib/auth/hooks';
import AnimatedBackground from '@/components/auth/AnimatedBackground';
import GlassPanel from '@/components/auth/GlassPanel';
import PremiumInput from '@/components/auth/PremiumInput';
import PremiumPasswordInput from '@/components/auth/PremiumPasswordInput';
import PremiumButton from '@/components/auth/PremiumButton';
import { FloatingPaymentCard, MiniChart, CodeSnippet, FeatureCard, StatsRow, SuccessNotification } from '@/components/auth/PremiumVisuals';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync(data);
      router.push('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Main Content - Asymmetrical Layout */}
      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel - Visual Elements */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 xl:w-[55%] p-12 flex-col justify-center items-start"
        >
          <div className="max-w-xl w-full space-y-8">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-[#5B21B6]/30">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-semibold text-white tracking-tight">Billstack</span>
            </motion.div>

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-5xl xl:text-6xl font-bold text-white leading-tight">
                Payment infrastructure for the modern web
              </h1>
              <p className="text-lg text-white/60 max-w-lg">
                Accept subscriptions, manage billing, and scale your business with enterprise-grade payment processing.
              </p>
            </motion.div>

            {/* Floating Elements */}
            <div className="relative h-[400px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute top-0 right-0"
              >
                <FloatingPaymentCard />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute top-48 left-0 w-64"
              >
                <GlassPanel variant="subtle" className="p-4">
                  <MiniChart />
                </GlassPanel>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="absolute bottom-0 right-20 w-72"
              >
                <CodeSnippet />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="absolute bottom-20 left-10"
              >
                <SuccessNotification />
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <StatsRow />
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12"
        >
          <div className="w-full max-w-xl">
            {/* Mobile Brand */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:hidden flex items-center gap-3 mb-8"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-semibold text-white tracking-tight">Billstack</span>
            </motion.div>

            {/* Login Panel */}
            <GlassPanel className="p-6 sm:p-8 lg:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2 mb-8"
              >
                <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                <p className="text-white/60">Sign in to your merchant dashboard</p>
              </motion.div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <PremiumInput
                  id="email"
                  label="Email address"
                  type="email"
                  placeholder="you@company.com"
                  error={errors.email?.message}
                  {...register('email')}
                  autoComplete="email"
                />

                <PremiumPasswordInput
                  id="password"
                  label="Password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                  autoComplete="current-password"
                />

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-white/60 cursor-pointer hover:text-white/80 transition-colors">
                    <input type="checkbox" className="rounded border-white/20 bg-white/5 text-[#7C3AED] focus:ring-[#7C3AED] focus:ring-offset-0" />
                    Remember me
                  </label>
                  <Link href="#" className="text-[#7C3AED] hover:text-[#8C4AFD] font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <PremiumButton type="submit" loading={isLoading} className="w-full">
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </PremiumButton>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 pt-6 border-t border-white/10"
              >
                <p className="text-center text-white/60 text-sm">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-[#7C3AED] hover:text-[#8C4AFD] font-medium transition-colors">
                    Get started
                  </Link>
                </p>
              </motion.div>
            </GlassPanel>

            {/* Feature Cards - Desktop */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="hidden lg:block mt-8 grid grid-cols-3 gap-4"
            >
              <FeatureCard
                icon={Shield}
                title="Secure"
                description="Bank-grade encryption"
                delay={0.8}
              />
              <FeatureCard
                icon={Bolt}
                title="Fast"
                description="Instant payouts"
                delay={0.9}
              />
              <FeatureCard
                icon={BarChart3}
                title="Analytics"
                description="Real-time insights"
                delay={1.0}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
