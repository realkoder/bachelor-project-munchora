CREATE DATABASE IF NOT EXISTS ai_development;
CREATE DATABASE IF NOT EXISTS auth_development;
CREATE DATABASE IF NOT EXISTS shopping_lists_development;
CREATE DATABASE IF NOT EXISTS recipes_development;

GRANT ALL PRIVILEGES ON ai_development.* TO 'munchora'@'%';
GRANT ALL PRIVILEGES ON auth_development.* TO 'munchora'@'%';
GRANT ALL PRIVILEGES ON shopping_lists_development.* TO 'munchora'@'%';
GRANT ALL PRIVILEGES ON recipes_development.* TO 'munchora'@'%';

FLUSH PRIVILEGES;
