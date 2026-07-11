'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { PhoneInput } from '@/components/ui/phone-input';
import { useAuth } from '@/lib/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { changePassword, changeEmail, changePhone, deleteAccount } from '@/lib/api/auth';
import { Lock, Mail, Phone, Trash2, Loader2, Shield } from 'lucide-react';
import { PasswordInput } from '@/components/ui/password-input';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';

export default function AccountSecurityPage() {
  const { profile, signOut } = useAuth();
  const router = useRouter();

  // Change Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Change Email
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [changingEmail, setChangingEmail] = useState(false);

  // Change Phone
  const [newPhone, setNewPhone] = useState('');
  const [changingPhone, setChangingPhone] = useState(false);

  // Delete Account
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOAuth = profile.authProvider === 'google';
  const isGuest = profile.authProvider === 'guest';

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setChangingPassword(true);
    const res = await changePassword({ currentPassword, newPassword });
    if (res.ok) {
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(res.error.message);
    }
    setChangingPassword(false);
  }

  async function handleChangeEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!newEmail.trim()) {
      toast.error('Email is required');
      return;
    }
    setChangingEmail(true);
    const res = await changeEmail({ newEmail: newEmail.trim(), password: emailPassword });
    if (res.ok) {
      toast.success('Email updated. Please verify your new email.');
      setNewEmail('');
      setEmailPassword('');
    } else {
      toast.error(res.error.message);
    }
    setChangingEmail(false);
  }

  async function handleChangePhone(e: React.FormEvent) {
    e.preventDefault();
    setChangingPhone(true);
    const res = await changePhone({ phone: newPhone.trim() });
    if (res.ok) {
      toast.success('Phone number updated');
      setNewPhone('');
    } else {
      toast.error(res.error.message);
    }
    setChangingPhone(false);
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    const res = await deleteAccount({ password: deletePassword });
    if (res.ok) {
      toast.success('Account deleted');
      signOut();
      router.push('/welcome');
    } else {
      toast.error(res.error.message);
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold tracking-tight">Account Security</h2>
        <p className="text-muted-foreground text-sm text-pretty">
          Manage your password, email, phone, and account.
        </p>
      </header>

      {/* Auth Provider Badge */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Authentication Method</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="secondary" className="text-xs capitalize">
                  {profile.authProvider === 'google' ? 'Google' : profile.authProvider === 'guest' ? 'Guest' : 'Email & Password'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Change Password
          </CardTitle>
          <CardDescription>
            {isOAuth
              ? 'This account uses Google Sign In. Password change is not available.'
              : isGuest
              ? 'Guest accounts do not have a password. Create a full account to set a password.'
              : 'Update your account password.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isOAuth ? (
            <p className="text-muted-foreground text-sm">
              Your account is secured via Google. No password management needed.
            </p>
          ) : isGuest ? (
            <p className="text-muted-foreground text-sm">
              You are using a guest account. Create a full account to manage your password.
            </p>
          ) : (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="current-password">Current Password</Label>
                <PasswordInput
                  id="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  disabled={changingPassword}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="new-password">New Password</Label>
                <PasswordInput
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  disabled={changingPassword}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <PasswordInput
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  disabled={changingPassword}
                />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-destructive text-xs">Passwords do not match</p>
                )}
              </div>
              <Button type="submit" className="w-fit" disabled={changingPassword}>
                {changingPassword ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Update Password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Change Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Change Email
          </CardTitle>
          <CardDescription>Update your email address. You&apos;ll need to verify the new email.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangeEmail} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <Label>Current Email</Label>
              <Input value={profile.email || ''} disabled className="opacity-60" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-email">New Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={changingEmail}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email-password">Confirm Password</Label>
              <PasswordInput
                id="email-password"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={changingEmail}
              />
            </div>
            <Button type="submit" className="w-fit" disabled={changingEmail}>
              {changingEmail ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Update Email
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Phone */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Change Phone
          </CardTitle>
          <CardDescription>Update your phone number.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePhone} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <Label>Current Phone</Label>
              <Input value={profile.phone || 'Not set'} disabled className="opacity-60" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-phone">New Phone</Label>
              <PhoneInput
                id="new-phone"
                value={newPhone}
                onChange={setNewPhone}
                disabled={changingPhone}
              />
            </div>
            <Button type="submit" className="w-fit" disabled={changingPhone}>
              {changingPhone ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Update Phone
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
            className="gap-1.5"
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold text-destructive">
              Delete Account
            </Dialog.Title>
            <Dialog.Description className="text-muted-foreground mt-1 text-sm">
              This will permanently delete your account, all your data, and cannot be undone.
            </Dialog.Description>

            <div className="mt-4 flex flex-col gap-3">
              {isOAuth ? (
                <p className="text-muted-foreground text-sm">
                  Since you signed up with Google, no password is required.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="delete-password">Enter your password to confirm</Label>
                  <PasswordInput
                    id="delete-password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Your password"
                  />
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="outline" disabled={deleting}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleting || (!isOAuth && !deletePassword)}
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                Delete permanently
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
