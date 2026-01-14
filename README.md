# SD Bachelor Project - Munchora

Rails command for generating services

```bash
rails new auth-service --api --database=mysql --skip-test --skip-system-test -T --skip-git
```

## Static Testing

# Rubocop

Linting and style enforcement. Rules are defined in ./server/.rubocop.yml.

```bash
# analyze project
bundle exec rubocop

# Run analyzer and make rubocop automatically fix linting issues
bundle exec rubocop -a
```