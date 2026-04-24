'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { UserPlus, UserX, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi, getErrorMessage } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/LoadingSpinner';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [createModal, setCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: authApi.listUsers,
  });

  const users: User[] = data?.users || [];

  const handleDeactivate = async (id: string, name: string) => {
    if (!confirm(`Deactivate ${name}? They will no longer be able to log in.`)) return;
    try {
      await authApi.deactivateUser(id);
      toast.success(`${name} deactivated`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setCreating(true);
    try {
      await authApi.createUser({
        employeeId: (fd.get('employeeId') as string).toUpperCase().trim(),
        name: (fd.get('name') as string).trim(),
        email: fd.get('email'),
        password: fd.get('password'),
        role: fd.get('role'),
      });
      toast.success('User created');
      setCreateModal(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCreating(false);
    }
  };

  if (currentUser?.role !== 'admin') {
    return (
      <>
        <Header title="Users" />
        <div className="p-6"><p className="text-slate-500">Admin access required.</p></div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Users"
        subtitle={`${users.filter((u) => (u as unknown as { isActive: boolean }).isActive).length} active`}
        actions={
          <Button size="sm" onClick={() => setCreateModal(true)} leftIcon={<UserPlus className="h-4 w-4" />}>
            Add User
          </Button>
        }
      />

      <div className="p-6">
        {isLoading ? (
          <PageLoader />
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Users className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500">No users found</p>
          </div>
        ) : (
          <Card padding="none">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {['Employee ID', 'Name', 'Email', 'Role', 'Status', 'Last Login', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const isActive = (u as unknown as { isActive: boolean }).isActive;
                  const lastLogin = (u as unknown as { lastLogin?: string }).lastLogin;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{u.employeeId}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{u.name}</td>
                      <td className="px-4 py-3 text-slate-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <Badge variant={u.role === 'admin' ? 'purple' : 'blue'}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={isActive ? 'green' : 'gray'}>
                          {isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {lastLogin ? format(new Date(lastLogin), 'MMM d, yyyy') : 'Never'}
                      </td>
                      <td className="px-4 py-3">
                        {isActive && u.id !== currentUser?.id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeactivate(u.id, u.name)}
                            leftIcon={<UserX className="h-3.5 w-3.5" />}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Deactivate
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      <Modal
        isOpen={createModal}
        onClose={() => setCreateModal(false)}
        title="Create User"
        size="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input name="employeeId" label="Employee ID" placeholder="EMP001" required />
            <Input name="name" label="Full Name" placeholder="Jane Smith" required />
          </div>
          <Input name="email" type="email" label="Email" placeholder="jane@company.com" required />
          <Input
            name="password"
            type="password"
            label="Password"
            placeholder="Min 8 chars, upper + lower + number"
            required
          />
          <Select
            name="role"
            label="Role"
            options={[
              { value: 'staff', label: 'Staff' },
              { value: 'admin', label: 'Admin' },
            ]}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button type="submit" isLoading={creating} leftIcon={<UserPlus className="h-4 w-4" />}>
              Create User
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
