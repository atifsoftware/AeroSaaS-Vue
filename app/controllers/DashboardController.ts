import type { AeroContext } from 'aerojs';
import { DashboardService } from '../services/DashboardService.js';

export class DashboardController {
  private dashboardService = new DashboardService();

  public async index(ctx: AeroContext): Promise<void> {
    const user = ctx.state.user;
    const workspace = ctx.state.workspace;

    const data = await this.dashboardService.getMetrics(workspace.id);

    await ctx.inertia.render('Dashboard', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        plan: workspace.plan,
        logo: workspace.logo,
      },
      ...data,
    });
  }
}
