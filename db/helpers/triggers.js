module.exports.updatedAtFunction = () => {
  return `CREATE OR REPLACE FUNCTION trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;`;
};

module.exports.updatedAtTrigger = (table_name) => {
  return `CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON ${table_name}
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();`;
};
