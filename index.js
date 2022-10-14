/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import App from './App';

import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { mySchema } from './src/models/schema.js';
import { dbModels } from './src/models/index.js';

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  dbName: 'rnwatermelon',
  schema: mySchema,
});

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: dbModels,
});

AppRegistry.registerComponent(appName, () => App);
