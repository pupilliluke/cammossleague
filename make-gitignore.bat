@echo off
(
  echo # Environment files
  echo *.env
  echo **/.env
  echo client/.env
  echo
  echo # Node modules
  echo node_modules/
  echo **/node_modules/
) > .gitignore

echo Created .gitignore with envs and node_modules rules.
