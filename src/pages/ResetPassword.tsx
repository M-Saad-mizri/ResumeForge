import React, { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ResetPassword = () => {
    const { updatePassword } = useAuth();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ready, setReady] = useState(false);
    const [linkError, setLinkError] = useState<string | null>(null);

    // Supabase sends the recovery token in the URL hash — we need to let the
    // client exchange it for a session before we allow the user to set a new password.
    useEffect(() => {
        const hash = window.location.hash.startsWith('#')
            ? window.location.hash.slice(1)
            : window.location.hash;
        const hashParams = new URLSearchParams(hash);
        const hashError = hashParams.get('error_description') || hashParams.get('error');

        if (hashError) {
            const normalized = hashError.replace(/\+/g, ' ');
            setLinkError(normalized);
            return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setReady(true);
                setLinkError(null);
            }
        });
        // Also check if the user already has a session (e.g., page refresh)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setReady(true);
        });

        const timeout = window.setTimeout(() => {
            setLinkError('Reset link is invalid or expired. Please request a new password reset email.');
        }, 30 * 60 * 1000);

        return () => {
            subscription.unsubscribe();
            window.clearTimeout(timeout);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            toast.error('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            toast.error('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        const { error } = await updatePassword(password);
        setLoading(false);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Password updated! You are now signed in.');
            navigate('/builder');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <SEO title="Reset Password" description="Set a new password for your ResumeForge account." noindex />
            <header className="px-6 py-4 border-b border-border">
                <Link to="/" className="inline-flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <span className="font-display text-xl font-bold text-foreground">ResumeForge</span>
                </Link>
            </header>

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                        <div className="mb-6">
                            <h1 className="font-display text-2xl font-bold text-foreground">Set new password</h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                {linkError
                                    ? 'This reset link can no longer be used.'
                                    : ready
                                        ? 'Choose a strong new password.'
                                        : 'Verifying your reset link...'}
                            </p>
                        </div>

                        {linkError ? (
                            <div className="space-y-3">
                                <p className="text-sm text-destructive">{linkError}</p>
                                <Button asChild className="w-full btn-gold border-0">
                                    <Link to="/auth">Request New Reset Link</Link>
                                </Button>
                            </div>
                        ) : ready ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="new-password"
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
                                <div className="space-y-1.5">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Repeat password"
                                        value={confirm}
                                        onChange={e => setConfirm(e.target.value)}
                                        required
                                        autoComplete="new-password"
                                    />
                                </div>
                                <Button type="submit" className="w-full btn-gold border-0 mt-2" disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update Password'}
                                </Button>
                            </form>
                        ) : (
                            <div className="flex justify-center py-6">
                                <Loader2 className="w-6 h-6 animate-spin text-accent" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
