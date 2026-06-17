import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';

export async function getAuthSession(req: any, res: any) {
  return await getServerSession(req, res, authOptions);
}

export function isAuthenticated(session: any): boolean {
  return !!session?.user;
}

export function isAdmin(session: any): boolean {
  return session?.user?.role === 'ADMIN';
}

export function isTeamMember(session: any): boolean {
  return ['ADMIN', 'TEAM'].includes(session?.user?.role);
}
