import { Model } from '@nozbe/watermelondb';
import { field, text, date, children} from '@nozbe/watermelondb/decorators';
import { Q } from '@nozbe/watermelondb';

export default class Post extends Model {
  // Table name in db
  static table = 'posts';
  // OTM - posts has many comments
  static associations = {
    comments: { type: 'has_many', foreignKey: 'post_id' },
  };

  // decorators for defining field properties
  @text('title') title;
  @text('body') body;
  @field('is_pinned') isPinned;
  @date('last_event_at') lastEventAt;
  @date('archived_at') archived_at;
  // Comments that belong to a Post, define a simple Query using @children:
  @children('comments') comments;

  // custom queries
  @lazy verifiedComments = this.comments.extend(Q.where('is_verified', true));
  // Getters on db fields
  get isRecentlyArchived() {
    return this.archivedAt && this.archivedAt.getTime() > Date.now() - 7 * 24 * 3600 * 1000;
  }
}

class Comment extends Model {
  static table = 'comments';
  static associations = {
    posts: { type: 'belongs_to', key: 'post_id' },
  };

  @field('is_spam') isSpam;

  // To point to a related record, e.g. Post a Comment belongs to, use @relation or @immutableRelation:
  @relation('posts', 'post_id') post_id;
  @immutableRelation('users', 'author_id') author;

  // writer method for creating/updating records
  @writer async markAsSpam() {
    await this.update((comment) => {
      comment.isSpam = true;
    });
  }
}

Get collection
const postsCollection = database.get('posts');

Find record
const postId = 'abcdefgh';
const post = await database.get('posts').find(postId);

Query db records
const allPosts = await database.get('posts').query().fetch();
const numberofStarredPosts = await database
  .get('posts')
  .query(Q.where('is_starred', true).fetchCount());

ALL CRUD OPERATIONS PERFORMED USING WRITER METHOD
const query = await database.write(async () => {
  const comment = await database.get('comments').find(commentId);
  await comment.update(() => {
    comment.isSpam = true;
  });
});

Create new record
const newPost = await database.get('posts').create((post) => {
  post.title = 'New Post';
  post.body = 'Lorem Ipsum...';
});

Update a record
const updatePost = await somePost.update((post) => {
  post.title = 'Updated Title';
});

Delete a record
If you only use Watermelon as a local database, destroy records permanently, if you synchronize, mark as deleted instead.
const deletePost = await somePost.markAsDeleted();
const deletePost2 = await somePost.destroyPermanently();

To override the record.id during the creation, e.g. to sync with a remote database, you can do it by record._raw property. Be aware that the id must be of type string
const rawId = await database.get('posts').create((post) => {
  post._raw.id = serverId;
});
