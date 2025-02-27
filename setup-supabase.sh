#!/bin/bash

# Bubble Pop Challenge - Supabase Setup Script
# This script helps set up your Supabase project for the game

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Bubble Pop Challenge - Supabase Setup Script${NC}"
echo "This script will help you set up your Supabase project."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}Supabase CLI not found. Installing...${NC}"
    npm install -g supabase
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Supabase CLI. Please install it manually:${NC}"
        echo "npm install -g supabase"
        exit 1
    fi
fi

echo -e "${GREEN}Supabase CLI is installed.${NC}"

# Ask for Supabase project reference
echo ""
echo "Please enter your Supabase project reference (found in your project URL):"
echo "Example: if your URL is https://abcdefghijklm.supabase.co, enter 'abcdefghijklm'"
read -p "Project reference: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo -e "${RED}Project reference cannot be empty.${NC}"
    exit 1
fi

# Ask for Supabase anon key
echo ""
echo "Please enter your Supabase anon key (found in your project API settings):"
read -p "Anon key: " ANON_KEY

if [ -z "$ANON_KEY" ]; then
    echo -e "${RED}Anon key cannot be empty.${NC}"
    exit 1
fi

# Update config.js with the provided values
echo ""
echo -e "${YELLOW}Updating config.js with your Supabase credentials...${NC}"

# Create backup of config.js
cp js/config.js js/config.js.bak

# Update config.js
sed -i '' "s|const SUPABASE_URL = 'YOUR_SUPABASE_URL';|const SUPABASE_URL = 'https://$PROJECT_REF.supabase.co';|g" js/config.js
sed -i '' "s|const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';|const SUPABASE_KEY = '$ANON_KEY';|g" js/config.js

echo -e "${GREEN}Config file updated successfully.${NC}"

# Ask if user wants to push the database migration
echo ""
echo "Would you like to push the database migration to your Supabase project?"
echo "This will create the leaderboard table and necessary functions."
read -p "Push migration? (y/n): " PUSH_MIGRATION

if [[ $PUSH_MIGRATION == "y" || $PUSH_MIGRATION == "Y" ]]; then
    echo ""
    echo -e "${YELLOW}Logging in to Supabase...${NC}"
    supabase login
    
    echo ""
    echo -e "${YELLOW}Linking to your Supabase project...${NC}"
    supabase link --project-ref $PROJECT_REF
    
    echo ""
    echo -e "${YELLOW}Pushing database migration...${NC}"
    supabase db push
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Database migration successful!${NC}"
    else
        echo -e "${RED}Database migration failed. Please check the error message above.${NC}"
        echo "You can manually run the SQL commands from supabase/migrations/20250227_leaderboard.sql in the Supabase SQL Editor."
    fi
else
    echo ""
    echo -e "${YELLOW}Skipping database migration.${NC}"
    echo "You can manually run the SQL commands from supabase/migrations/20250227_leaderboard.sql in the Supabase SQL Editor."
fi

echo ""
echo -e "${GREEN}Setup complete!${NC}"
echo "Your game should now be configured to use Supabase."
echo "Open http://localhost:3000 in your browser to test the game."
echo ""
echo "If you encounter any issues, please refer to SUPABASE_SETUP.md for troubleshooting."
