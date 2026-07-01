// ── Premium Register Page ───────────────────────────────────────────────────────

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Check, Shield, Zap as Bolt, Globe, Users, BarChart3 } from 'lucide-react';
import { useRegister } from '@/lib/auth/hooks';
import AnimatedBackground from '@/components/auth/AnimatedBackground';
import GlassPanel from '@/components/auth/GlassPanel';
import PremiumInput from '@/components/auth/PremiumInput';
import PremiumPasswordInput from '@/components/auth/PremiumPasswordInput';
import PremiumButton from '@/components/auth/PremiumButton';
import { FloatingPaymentCard, MiniChart, CodeSnippet, FeatureCard, StatsRow, SuccessNotification } from '@/components/auth/PremiumVisuals';

const registerSchema = z
  .object({
    personal_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await registerMutation.mutateAsync({
        personal_name: data.personal_name,
        email: data.email,
        password: data.password,
      });
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />

      {/* Main Content - Asymmetrical Layout (Same as Login) */}
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
                Start accepting payments in minutes
              </h1>
              <p className="text-lg text-white/60 max-w-lg">
                Join thousands of businesses using Billstack to manage subscriptions, process payments, and scale revenue.
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

        {/* Right Panel - Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12"
        >
          <div className="w-full max-w-2xl">
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

            {/* Register Panel */}
            <GlassPanel className="p-6 sm:p-8 lg:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2 mb-8"
              >
                <h2 className="text-3xl font-bold text-white">Create your account</h2>
                <p className="text-white/60">Start your 14-day free trial</p>
              </motion.div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <PremiumInput
                  id="personal_name"
                  label="Full name"
                  type="text"
                  placeholder="John Doe"
                  error={errors.personal_name?.message}
                  {...register('personal_name')}
                  autoComplete="name"
                />

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
                  autoComplete="new-password"
                />

                <PremiumPasswordInput
                  id="confirmPassword"
                  label="Confirm password"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                  autoComplete="new-password"
                />

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2.5 pt-2"
                >
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Check className="w-4 h-4 text-[#059669] shrink-0" />
                    <span>14-day free trial, no credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Check className="w-4 h-4 text-[#059669] shrink-0" />
                    <span>Access to all premium features</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <Check className="w-4 h-4 text-[#059669] shrink-0" />
                    <span>Cancel anytime, no questions asked</span>
                  </div>
                </motion.div>

                <PremiumButton type="submit" loading={isLoading} className="w-full">
                  Create account
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
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#7C3AED] hover:text-[#8C4AFD] font-medium transition-colors">
                    Sign in
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
                description="PCI-DSS compliant"
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
