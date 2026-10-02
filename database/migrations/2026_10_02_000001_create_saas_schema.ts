import { Schema, type Migration, type TableBlueprint } from 'aerojs';

export default class CreateSaaSSchema implements Migration {
  public name = '2026_10_02_000001_create_saas_schema';

  public async up(): Promise<void> {
    // 1. Users table
    await Schema.create('users', (table: TableBlueprint) => {
      table.increments('id');
      table.string('name', 255).notNull();
      table.string('email', 191).notNull().unique();
      table.string('password', 255).notNull();
      table.string('avatar', 255).nullable();
      table.integer('current_workspace_id').nullable();
      table.string('two_factor_secret', 255).nullable();
      table.boolean('two_factor_enabled').defaultTo(false);
      table.timestamps();
      table.timestamp('deleted_at').nullable();
    });

    // 2. Workspaces table
    await Schema.create('workspaces', (table: TableBlueprint) => {
      table.increments('id');
      table.string('name', 255).notNull();
      table.string('slug', 191).notNull().unique();
      table.integer('owner_id').notNull();
      table.string('logo', 255).nullable();
      table.string('plan', 50).defaultTo('pro');
      table.timestamps();
    });

    // 3. Workspace Members table
    await Schema.create('workspace_members', (table: TableBlueprint) => {
      table.increments('id');
      table.integer('workspace_id').notNull();
      table.integer('user_id').notNull();
      table.string('role', 50).defaultTo('member');
      table.timestamps();
    });

    // 4. Projects table
    await Schema.create('projects', (table: TableBlueprint) => {
      table.increments('id');
      table.integer('workspace_id').notNull();
      table.string('name', 255).notNull();
      table.text('description').nullable();
      table.string('color', 50).defaultTo('#6366F1');
      table.string('status', 50).defaultTo('active');
      table.timestamps();
    });

    // 5. Tasks table
    await Schema.create('tasks', (table: TableBlueprint) => {
      table.increments('id');
      table.integer('project_id').notNull();
      table.integer('workspace_id').notNull();
      table.string('title', 255).notNull();
      table.text('description').nullable();
      table.string('status', 50).defaultTo('todo');
      table.string('priority', 50).defaultTo('medium');
      table.integer('assignee_id').nullable();
      table.timestamp('due_date').nullable();
      table.integer('position').defaultTo(0);
      table.timestamps();
    });

    // 6. Activity Logs table
    await Schema.create('activity_logs', (table: TableBlueprint) => {
      table.increments('id');
      table.integer('workspace_id').notNull();
      table.integer('user_id').notNull();
      table.string('action', 100).notNull();
      table.text('details').nullable();
      table.string('entity_type', 50).nullable();
      table.integer('entity_id').nullable();
      table.timestamps();
    });

    // 7. Invitations table
    await Schema.create('invitations', (table: TableBlueprint) => {
      table.increments('id');
      table.integer('workspace_id').notNull();
      table.string('email', 191).notNull();
      table.string('role', 50).defaultTo('member');
      table.string('token', 255).notNull().unique();
      table.timestamp('accepted_at').nullable();
      table.timestamp('expires_at').nullable();
      table.timestamps();
    });
  }

  public async down(): Promise<void> {
    await Schema.dropIfExists('invitations');
    await Schema.dropIfExists('activity_logs');
    await Schema.dropIfExists('tasks');
    await Schema.dropIfExists('projects');
    await Schema.dropIfExists('workspace_members');
    await Schema.dropIfExists('workspaces');
    await Schema.dropIfExists('users');
  }
}
