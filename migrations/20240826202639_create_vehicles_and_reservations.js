exports.up = function (knex) {
  return knex.schema.createTable("vehicles", function (table) {
    table.string("id").primary();
    table.string("type").notNullable();
    table.string("location").notNullable();
    table.time("available_from_time").notNullable();
    table.time("available_to_time").notNullable();
    table.specificType("available_days", "text[]").notNullable();
    table.integer("minimum_minutes_between_bookings").notNullable();
  });
};
