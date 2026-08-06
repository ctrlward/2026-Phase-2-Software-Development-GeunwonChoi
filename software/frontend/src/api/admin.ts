import { fetchApi } from './client';
import { User } from '../types';

export async function getAllUsers(): Promise<User[]> {
  return fetchApi<User[]>('/admin/users');
}

export async function deleteUser(userId: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
}
