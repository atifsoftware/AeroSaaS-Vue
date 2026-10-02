import type { AeroContext } from 'aerojs';
import { ProjectService } from '../services/ProjectService.js';
import { TeamService } from '../services/TeamService.js';

export class ProjectController {
  private projectService = new ProjectService();
  private teamService = new TeamService();

  public async index(ctx: AeroContext): Promise<void> {
    const user = ctx.state.user;
    const workspace = ctx.state.workspace;

    const projects = await this.projectService.list(workspace.id);

    await ctx.inertia.render('Projects/Index', {
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
      },
      projects,
    });
  }

  public async show(ctx: AeroContext): Promise<void> {
    const user = ctx.state.user;
    const workspace = ctx.state.workspace;
    const projectId = Number(ctx.req.params.id);

    const data = await this.projectService.findWithKanban(projectId, workspace.id);
    if (!data) {
      ctx.redirect('/projects');
      return;
    }

    const members = await this.teamService.getMembers(workspace.id);

    await ctx.inertia.render('Projects/Show', {
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
      },
      project: data.project,
      tasks: data.tasks,
      teamMembers: members,
    });
  }

  public async store(ctx: AeroContext): Promise<void> {
    const user = ctx.state.user;
    const workspace = ctx.state.workspace;
    const { name, description, color } = ctx.body as any;

    if (!name || !name.trim()) {
      ctx.redirect('/projects');
      return;
    }

    await this.projectService.create(workspace.id, user.id, {
      name: name.trim(),
      description,
      color,
    });

    ctx.redirect('/projects');
  }
}
