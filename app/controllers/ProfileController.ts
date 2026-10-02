import type { AeroContext } from 'aerojs';
import { Hash } from 'aerojs';
import { User } from '../models/User.js';

export class ProfileController {
  public async index(ctx: AeroContext): Promise<void> {
    const user = ctx.state.user;
    const workspace = ctx.state.workspace;

    await ctx.inertia.render('Settings/Profile', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        two_factor_enabled: Boolean(user.two_factor_enabled),
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
      success: ctx.req.query.success === 'true',
    });
  }

  public async update(ctx: AeroContext): Promise<void> {
    const user = await User.find(ctx.state.user.id);
    if (!user) {
      ctx.redirect('/login');
      return;
    }

    const { name, password } = ctx.body as any;

    if (name && name.trim()) {
      user.name = name.trim();
    }

    if (password && password.trim()) {
      user.password = await Hash.make(password.trim());
    }

    await user.save();
    ctx.redirect('/settings/profile?success=true');
  }
}
