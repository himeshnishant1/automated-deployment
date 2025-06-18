const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const isDeployment = process.env.VERCEL === '1';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false,
  } : false
});

async function logMigrationStatus(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  if (isDeployment) {
    // Log to Vercel deployment logs
    if (isError) {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
  } else {
    // Local logging
    console.log(logMessage);
  }
}

async function runMigrations() {
  try {
    await logMigrationStatus('Starting database migration process...');
    
    // Test database connection
    try {
      await pool.query('SELECT NOW()');
      await logMigrationStatus('Database connection successful');
    } catch (error) {
      await logMigrationStatus(`Database connection failed: ${error.message}`, true);
      throw error;
    }

    // Create migrations table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        deployment_env VARCHAR(50)
      );
    `);
    await logMigrationStatus('Migrations table verified/created');

    // Get all migration files
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    await logMigrationStatus(`Reading migrations from: ${migrationsDir}`);
    
    const files = await fs.readdir(migrationsDir);
    const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
    await logMigrationStatus(`Found ${sqlFiles.length} migration files`);

    // Run each migration in a transaction
    for (const file of sqlFiles) {
      const migrationName = file;
      await logMigrationStatus(`Processing migration: ${migrationName}`);

      // Check if migration has already been executed
      const { rows } = await pool.query(
        'SELECT id FROM migrations WHERE name = $1',
        [migrationName]
      );

      if (rows.length === 0) {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
          await logMigrationStatus(`Starting transaction for ${migrationName}`);

          // Read and execute the migration file
          const migrationPath = path.join(migrationsDir, file);
          const migrationSql = await fs.readFile(migrationPath, 'utf8');
          await client.query(migrationSql);

          // Record the migration
          await client.query(
            'INSERT INTO migrations (name, deployment_env) VALUES ($1, $2)',
            [migrationName, process.env.VERCEL_ENV || 'local']
          );

          await client.query('COMMIT');
          await logMigrationStatus(`Migration ${migrationName} executed successfully`);
        } catch (error) {
          await client.query('ROLLBACK');
          await logMigrationStatus(`Error in migration ${migrationName}: ${error.message}`, true);
          throw error;
        } finally {
          client.release();
        }
      } else {
        await logMigrationStatus(`Migration ${migrationName} already executed, skipping`);
      }
    }

    await logMigrationStatus('All migrations completed successfully');
  } catch (error) {
    await logMigrationStatus(`Migration process failed: ${error.message}`, true);
    throw error;
  } finally {
    await pool.end();
  }
}

// Execute if this file is run directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logMigrationStatus('Migration process completed successfully')
        .then(() => process.exit(0));
    })
    .catch(async (err) => {
      await logMigrationStatus(`Migration process failed with error: ${err.message}`, true);
      process.exit(1);
    });
}

module.exports = { runMigrations }; 