import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	// highestMo3: integer('mo3').notNull(),
	// highestAo5: integer('ao5').notNull(),
	// highestAo12: integer('ao12').notNull()
});

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
});

export const events = sqliteTable('events', {
	id: text('event_id').primaryKey(),
	name: text('event_name')
})

export const solves = sqliteTable('solves', {
	solveId: integer('solve_id').primaryKey(),
	scramble: text('scramble'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	minutes: integer('minutes').notNull(),
	seconds: integer('seconds').notNull(),
	ms: integer('ms').notNull(),
	timeRecord: integer('timeRecorded').notNull(),
	event: text('event_id')
		.references(() => events.id),
	isPlusTwo: integer('+2').notNull(),
	isDNF: integer('DNF').notNull()
});

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
