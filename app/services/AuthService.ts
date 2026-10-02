import { Hash } from 'aerojs';
import { User } from '../models/User.js';
import { Workspace } from '../models/Workspace.js';
import { WorkspaceMember } from '../models/WorkspaceMember.js';

export class AuthService {
  public async login(email: string, pass: string): Promise<User | null> {
    const user = await User.where('email', email.trim().toLowerCase()).first();
    if (!user) return null;

    const matches = await Hash.check(pass, user.password);
    if (!matches) return null;

    return user;
  }

  public async register(name: string, email: string, pass: string, workspaceName?: string): Promise<{ user: User; workspace: Workspace }> {
    const existing = await User.where('email', email.trim().toLowerCase()).first();
    if (existing) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await Hash.make(pass);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    });

    const wsName = workspaceName?.trim() || `${name}'s Workspace`;
    const slug = wsName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

    const workspace = await Workspace.create({
      name: wsName,
      slug,
      owner_id: user.id,
      plan: 'pro',
      logo: '⚡',
    });

    await WorkspaceMember.create({
      workspace_id: workspace.id,
      user_id: user.id,
      role: 'owner',
    });

    user.current_workspace_id = workspace.id;
    await user.save();

    return { user, workspace };
  }
}
