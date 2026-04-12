import React, { useState } from 'react';
import SEO from '@/components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Auth = () => {
    const { signIn, signUp, resetPassword } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password) return;
        setLoading(true);
        const { error } = await signIn(email.trim(), password);
        setLoading(false);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Signed in successfully!');
            navigate('/builder');
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password) return;
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        const { error } = await signUp(email.trim(), password);
        setLoading(false);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Account created! Check your email to confirm, then sign in.');
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!forgotEmail.trim()) return;
        setForgotLoading(true);
        const { error } = await resetPassword(forgotEmail.trim());
        setForgotLoading(false);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Password reset email sent. Use the most recent email and open the link once.');
            setShowForgot(false);
            setForgotEmail('');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 border-b border-border">
                <Link to="/" className="inline-flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <span className="font-display text-xl font-bold text-foreground">ResumeForge</span>
                </Link>
            </header>

            {/* Auth card */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">

                        {/* ── Forgot Password view ── */}
                        {showForgot ? (
                            <>
                                <div className="mb-6">
                                    <h1 className="font-display text-2xl font-bold text-foreground">Reset password</h1>
                                    <p className="text-muted-foreground text-sm mt-1">Enter your email to receive a reset link</p>
                                </div>
                                <form onSubmit={handleForgotPassword} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="forgot-email">Email</Label>
                                        <Input
                                            id="forgot-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={forgotEmail}
                                            onChange={e => setForgotEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full btn-gold border-0" disabled={forgotLoading}>
                                        {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Reset Link'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => setShowForgot(false)}
                                    >
                                        ← Back to Sign In
                                    </Button>
                                </form>
                            </>
                        ) : (
                            <Tabs defaultValue="signin">
                                <TabsList className="w-full mb-6">
                                    <TabsTrigger value="signin" className="flex-1">Sign In</TabsTrigger>
                                    <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
                                </TabsList>

                                {/* Sign In */}
                                <TabsContent value="signin">
                                    <div className="mb-6">
                                        <h1 className="font-display text-2xl font-bold text-foreground">Welcome back</h1>
                                        <p className="text-muted-foreground text-sm mt-1">Sign in to access your CV profiles</p>
                                    </div>
                                    <form onSubmit={handleSignIn} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="signin-email">Email</Label>
                                            <Input
                                                id="signin-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                                autoComplete="email"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="signin-password">Password</Label>
                                                <button
                                                    type="button"
                                                    className="text-xs text-accent hover:underline"
                                                    onClick={() => setShowForgot(true)}
                                                >
                                                    Forgot password?
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id="signin-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    required
                                                    autoComplete="current-password"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                    onClick={() => setShowPassword(v => !v)}
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full btn-gold border-0 mt-2" disabled={loading}>
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                                        </Button>
                                    </form>
                                </TabsContent>

                                {/* Sign Up */}
                                <TabsContent value="signup">
                                    <div className="mb-6">
                                        <h1 className="font-display text-2xl font-bold text-foreground">Create account</h1>
                                        <p className="text-muted-foreground text-sm mt-1">Free forever — no credit card needed</p>
                                    </div>
                                    <form onSubmit={handleSignUp} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="signup-email">Email</Label>
                                            <Input
                                                id="signup-email"
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                                required
                                                autoComplete="email"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="signup-password">Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="signup-password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Min. 6 characters"
                                                    value={password}
                                                    onChange={e => setPassword(e.target.value)}
                                                    required
                                                    autoComplete="new-password"
                                                    className="pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                                    onClick={() => setShowPassword(v => !v)}
                                                    tabIndex={-1}
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full btn-gold border-0 mt-2" disabled={loading}>
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                                        </Button>
                                    </form>
                                </TabsContent>
                            </Tabs>
                        )} {/* end showForgot ternary */}

                        {!showForgot && (
                            <p className="text-center text-xs text-muted-foreground mt-6">
                                By continuing, you agree to our terms of service.
                            </p>
                        )}
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-4">
                        <Link to="/builder" className="text-accent hover:underline">
                            Continue without an account →
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
