import type { AeroContext } from 'aerojs';
import { AuthService } from '../services/AuthService.js';

export class AuthController {
  private authService = new AuthService();

  public async showLogin(ctx: AeroContext): Promise<void> {
    if (ctx.cookies['user_id']) {
      ctx.redirect('/dashboard');
      return;
    }
    await ctx.inertia.render('Auth/Login', {
      error: ctx.req.query.error as string || null,
      message: ctx.req.query.message as string || null,
    });
  }

  public async login(ctx: AeroContext): Promise<void> {
    const { email, password } = ctx.body as any;

    if (!email || !password) {
      await ctx.inertia.render('Auth/Login', { error: 'Please enter both email and password.' });
      return;
    }

    const user = await this.authService.login(email, password);
    if (!user) {
      await ctx.inertia.render('Auth/Login', { error: 'Invalid email or password.' });
      return;
    }

    ctx.setCookie('user_id', String(user.id), {
      httpOnly: true,
      maxAge: 7 * 24 * 3600,
      path: '/',
    });

    ctx.redirect('/dashboard');
  }

  public async showRegister(ctx: AeroContext): Promise<void> {
    if (ctx.cookies['user_id']) {
      ctx.redirect('/dashboard');
      return;
    }
    await ctx.inertia.render('Auth/Register', {
      error: ctx.req.query.error as string || null,
    });
  }

  public async register(ctx: AeroContext): Promise<void> {
    const { name, email, password, workspaceName } = ctx.body as any;

    if (!name || !email || !password) {
      await ctx.inertia.render('Auth/Register', { error: 'All fields are required.' });
      return;
    }

    try {
      const { user } = await this.authService.register(name, email, password, workspaceName);

      ctx.setCookie('user_id', String(user.id), {
        httpOnly: true,
        maxAge: 7 * 24 * 3600,
        path: '/',
      });

      ctx.redirect('/dashboard');
    } catch (err: any) {
      await ctx.inertia.render('Auth/Register', { error: err.message || 'Registration failed.' });
    }
  }

  public async logout(ctx: AeroContext): Promise<void> {
    ctx.setCookie('user_id', '', { maxAge: 0, path: '/' });
    ctx.redirect('/login');
  }
}
