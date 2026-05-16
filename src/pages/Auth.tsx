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
import { lovable } from '@/integrations/lovable';

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
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleGoogle = async () => {
        setGoogleLoading(true);
        const result = await lovable.auth.signInWithOAuth('google', {
            redirect_uri: `${window.location.origin}/builder`,
        });
        if (result.error) {
            setGoogleLoading(false);
            toast.error(result.error.message || 'Google sign-in failed');
            return;
        }
        if (result.redirected) return;
        setGoogleLoading(false);
        toast.success('Signed in with Google!');
        navigate('/builder');
    };

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
            <SEO
              title="Sign In or Create Account"
              description="Sign in or create a free ResumeForge account to sync your CVs across devices, access cloud storage, and never lose your work."
              canonical="/auth"
              noindex
            />
            {/* Header */}
            <header className="px-6 py-4 border-b border-border">
                <Link to="/" className="inline-flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <span className="font-display text-xl font-bold text-foreground">ResumeForge</span>
                </Link>
            </header>
            <h1 className="sr-only">Sign In to ResumeForge</h1>

            {/* Auth card */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">

                        {/* ── Forgot Password view ── */}
                        {showForgot ? (
                            <>
                                <div className="mb-6">
                                    <h2 className="font-display text-2xl font-bold text-foreground">Reset password</h2>
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
                                        <h2 className="font-display text-2xl font-bold text-foreground">Welcome back</h2>
                                        <p className="text-muted-foreground text-sm mt-1">Sign in to access your CV profiles</p>
                                    </div>
                                    <GoogleButton loading={googleLoading} onClick={handleGoogle} />
                                    <Divider />
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
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                                        <h2 className="font-display text-2xl font-bold text-foreground">Create account</h2>
                                        <p className="text-muted-foreground text-sm mt-1">Free forever — no credit card needed</p>
                                    </div>
                                    <GoogleButton loading={googleLoading} onClick={handleGoogle} label="Sign up with Google" />
                                    <Divider />
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
                                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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

const GoogleButton: React.FC<{ loading: boolean; onClick: () => void; label?: string }> = ({ loading, onClick, label = 'Continue with Google' }) => (
    <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={onClick}
        disabled={loading}
    >
        {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.59-5.17 3.59-8.82z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z" />
                <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29A11.99 11.99 0 0 0 0 12c0 1.94.46 3.78 1.29 5.38l3.98-3.09z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z" />
            </svg>
        )}
        {label}
    </Button>
);

const Divider: React.FC = () => (
    <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
            <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
    </div>
);
