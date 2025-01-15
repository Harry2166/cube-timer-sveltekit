import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
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

export const mo3 = sqliteTable( 'mo3', {
	id: integer('id').primaryKey(),
	userid: text('user_id')
		.references(() => user.id),
	eventid: text('event_id')
		.references(() => events.id),
	solve1id: integer('solve1_id')
		.references(() => solves.solveId),
	solve2id: integer('solve2_id')
		.references(() => solves.solveId),
	solve3id: integer('solve3_id')
		.references(() => solves.solveId),
	}
)

export const ao5 = sqliteTable( 'ao5', {
	id: integer('id').primaryKey(),
	userid: text('user_id')
		.references(() => user.id),
	eventid: text('event_id')
		.references(() => events.id),
	solve1id: integer('solve1_id')
		.references(() => solves.solveId),
	solve2id: integer('solve2_id')
		.references(() => solves.solveId),
	solve3id: integer('solve3_id')
		.references(() => solves.solveId),
	solve4id: integer('solve4_id')
		.references(() => solves.solveId),
	solve5id: integer('solve5_id')
		.references(() => solves.solveId),
	}
)

export const ao12 = sqliteTable( 'ao12', {
	id: integer('id').primaryKey(),
	userid: text('user_id')
		.references(() => user.id),
	eventid: text('event_id')
		.references(() => events.id),
	solve1id: integer('solve1_id')
		.references(() => solves.solveId),
	solve2id: integer('solve2_id')
		.references(() => solves.solveId),
	solve3id: integer('solve3_id')
		.references(() => solves.solveId),
	solve4id: integer('solve4_id')
		.references(() => solves.solveId),
	solve5id: integer('solve5_id')
		.references(() => solves.solveId),
	solve6id: integer('solve6_id')
		.references(() => solves.solveId),
	solve7id: integer('solve7_id')
		.references(() => solves.solveId),
	solve8id: integer('solve8_id')
		.references(() => solves.solveId),
	solve9id: integer('solve9_id')
		.references(() => solves.solveId),
	solve10id: integer('solve10_id')
		.references(() => solves.solveId),
	solve11id: integer('solve11_id')
		.references(() => solves.solveId),
	solve12id: integer('solve12_id')
		.references(() => solves.solveId),
	}
)

export const highest_averages_per_event = sqliteTable( 'highest_averages_per_event' , {
		id: integer('id').primaryKey(),
		highestAverage2x2: integer('2x2_highest_average')
			.references(() => highest_averages.id),
		highestAverage3x3: integer('3x3_highest_average')
			.references(() => highest_averages.id),
		highestAverage4x4: integer('4x4_highest_average')
			.references(() => highest_averages.id),
	}
)

export const highest_averages = sqliteTable('highest_averages', {
		id: integer('id').primaryKey(),
		userid: text('user_id')
			.references(() => user.id),
		eventid: text('event_id')
			.references(() => events.id),
		mo3id: integer('mo3_id')
			.references(() => mo3.id),
		ao5id: integer('ao5_id')
			.references(() => ao5.id),
		ao12id: integer('ao12_id')
			.references(() => ao12.id),
	}
)

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
