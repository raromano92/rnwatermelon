import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';
import { date } from '@nozbe/watermelondb/decorators';

export default class Post extends Model {
  static table = 'posts';
  static associations = {
    comments: { type: 'has_many', foreignKey: 'post_id' },
  };

  @text('title') title;
  @text('body') body;
  @field('is_pinned') isPinned;
  @date('last_event_at') lastEventAt;
}

class Comment extends Model {
  static table = 'comments';
  static associations = {
    posts: { type: 'belongs_to', key: 'post_id' },
  };
}
