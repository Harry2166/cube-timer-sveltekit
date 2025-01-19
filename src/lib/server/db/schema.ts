import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at').notNull()
});

export const events = pgTable('events', {
	id: text('event_id').primaryKey(),
	name: text('event_name')
})

export const solves = pgTable('solves', {
	solve_id: serial('solve_id').primaryKey(),
	scramble: text('scramble'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	minutes: integer('minutes').notNull(),
	seconds: integer('seconds').notNull(),
	ms: integer('ms').notNull(),
	timeRecord: timestamp('timeRecorded').notNull(),
	event: text('event_id')
		.references(() => events.id),
	isPlusTwo: integer('+2').notNull(),
	isDNF: integer('DNF').notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
