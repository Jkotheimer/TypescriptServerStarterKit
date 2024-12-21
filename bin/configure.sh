#!/usr/bin/env bash
show_help() {
    echo 'Configure the environment variables and other settings for this web service'
    echo
    echo '-e, --environment : Specify the environment you will be configuring. Options are dev, staging, and production. Default is dev'
    echo '-h, --help : Show this help dialog'
    echo
}

handle_interrupt() {
    trap SIGINT
    echo
    echo
    echo 'Exiting...'
    echo
    exit
}
trap "handle_interrupt" INT

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
PROJECT_DIR=$(dirname "$SCRIPT_DIR")

# Define defaults
ENVIRONMENT=dev

# Parse input arguments
for arg in "$@"; do
    case $arg in
        -e | --environment)
            ENVIRONMENT="$(awk '{print tolower($0)}' <<< $2)"
            shift
            ;;
        -h | --help)
            show_help
            exit 0
            ;;
        *)
            echo "Error | Invalid argument: $1"
            show_help
            exit 1
            ;;
    esac
    shift
done

# Validate inputs
if [ "$ENVIRONMENT" != 'dev' ] && [ "$ENVIRONMENT" != 'staging' ] && [ "$ENVIRONMENT" != 'production' ]; then
    echo "Error | Invalid environment: $ENVIRONMENT"
    exit 1
fi

DOTENV="$PROJECT_DIR/.env.$ENVIRONMENT"

# If the dotenv already exists, read it and copy it to a backup.
if [ -f "$DOTENV" ]; then
    source "$DOTENV"
    cp "$DOTENV" "$DOTENV.backup"
fi

# Capture environment variable values

# MySQL Host
if [ -z "$MYSQL_HOST" ]; then
    MYSQL_HOST='localhost'
fi
read -r -p "Please enter your MySQL Host (default: $MYSQL_HOST): " MYSQL_HOST_INPUT
if [ -n "$MYSQL_HOST_INPUT" ]; then
    MYSQL_HOST="$MYSQL_HOST_INPUT"
fi
echo "MYSQL_HOST='$MYSQL_HOST'" > "$DOTENV"

# MySQL Database
if [ -z "$MYSQL_DATABASE" ]; then
    MYSQL_DATABASE='typescript_server_starter_kit'
fi
read -r -p "Please enter your MySQL Database name (default: $MYSQL_DATABASE): " MYSQL_DATABASE_INPUT
if [ -n "$MYSQL_DATABASE_INPUT" ]; then
    MYSQL_DATABASE="$MYSQL_DATABASE_INPUT"
fi
echo "MYSQL_DATABASE='$MYSQL_DATABASE'" >> "$DOTENV"

# MySQL User
if [ -z "$MYSQL_USER" ]; then
    MYSQL_USER='admin'
fi
read -r -p "Please enter your MySQL User name (default: $MYSQL_USER): " MYSQL_USER_INPUT
if [ -n "$MYSQL_USER_INPUT" ]; then
    MYSQL_USER="$MYSQL_USER_INPUT"
fi
echo "MYSQL_USER='$MYSQL_USER'" >> "$DOTENV"

# MySQL Password
while [ -z "$MYSQL_PASSWORD" ]; do
    read -r -s -p "Please enter your MySQL Password: " MYSQL_PASSWORD
    echo
done
echo "MYSQL_PASSWORD='$MYSQL_PASSWORD'" >> "$DOTENV"

echo

trap SIGINT