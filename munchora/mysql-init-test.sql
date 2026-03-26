CREATE DATABASE IF NOT EXISTS ai_test;
CREATE DATABASE IF NOT EXISTS auth_test;
CREATE DATABASE IF NOT EXISTS shopping_lists_test;
CREATE DATABASE IF NOT EXISTS recipes_test;

GRANT ALL PRIVILEGES ON ai_test.* TO 'munchora'@'%';
GRANT ALL PRIVILEGES ON auth_test.* TO 'munchora'@'%';
GRANT ALL PRIVILEGES ON shopping_lists_test.* TO 'munchora'@'%';
GRANT ALL PRIVILEGES ON recipes_test.* TO 'munchora'@'%';

FLUSH PRIVILEGES;
