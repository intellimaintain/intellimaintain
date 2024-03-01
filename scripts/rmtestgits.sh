#!/bin/bash

# Define the starting directory
START_DIR="tests/git"

# Find and remove all .git directories recursively
find "$START_DIR" -type d -name ".git" | while read git_dir; do
    echo "rm -rf $git_dir"
    rm -rf "$git_dir"
done

echo "All .git directories under $START_DIR have been removed."
