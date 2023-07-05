#!/bin/bash

# Get the current date and time
#current_time=$(date "+%Y.%m.%d-%H.%M.%S")
current_time=$(date "+%Y.%m.%d")

# Define the log file name
log_file_name="obweb_backend_$current_time.log"

# Execute your script and redirect the output to the log file
npm run dev >> $log_file_name 2>&1 &
