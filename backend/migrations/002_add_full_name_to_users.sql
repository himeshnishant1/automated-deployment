-- Add full_name column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'full_name'
    ) THEN 
        ALTER TABLE users 
        ADD COLUMN full_name VARCHAR(255);
        
        -- Set a default value for existing records
        UPDATE users 
        SET full_name = 'User ' || id::text 
        WHERE full_name IS NULL;
        
        -- Make the column NOT NULL after setting default values
        ALTER TABLE users 
        ALTER COLUMN full_name SET NOT NULL;
    END IF;
END $$; 