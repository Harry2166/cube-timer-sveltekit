import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const events = sqliteTable('events', {
	name: text('event_name').primaryKey()
})

export const solves = sqliteTable('solves', {
	solveId: integer('solve_id').primaryKey(),
	scramble: text('scramble'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	time: text('time').notNull(),
	timeRecord: integer('timeRecorded').notNull(),
	event: text('event_name')
		.references(() => events.name)
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
