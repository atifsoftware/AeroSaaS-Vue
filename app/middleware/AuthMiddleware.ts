import type { AeroContext, NextFunction } from 'aerojs';
import { User } from '../models/User.js';
import { Workspace } from '../models/Workspace.js';
import { WorkspaceMember } from '../models/WorkspaceMember.js';

export async function authMiddleware(ctx: AeroContext, next: NextFunction): Promise<void> {
  const userId = ctx.cookies['user_id'];

  if (!userId) {
    if (ctx.req.headers['accept']?.includes('application/json') || ctx.req.path.startsWith('/api/')) {
      ctx.status(401).json({ error: 'Unauthorized' });
      return;
    }
    ctx.redirect('/login');
    return;
  }

  const user = await User.find(Number(userId));
  if (!user) {
    ctx.setCookie('user_id', '', { maxAge: 0 });
    ctx.redirect('/login');
    return;
  }

  ctx.state.user = user;

  // Resolve current workspace
  let workspace: any = null;
  if (user.current_workspace_id) {
    workspace = await Workspace.find(user.current_workspace_id);
  }

  if (!workspace) {
    const member = await WorkspaceMember.where('user_id', user.id).first();
    if (member) {
      workspace = await Workspace.find(member.workspace_id);
      if (workspace) {
        user.current_workspace_id = workspace.id;
        await user.save();
      }
    }
  }

  ctx.state.workspace = workspace;

  await next();
}
