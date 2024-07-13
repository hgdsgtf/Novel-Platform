package APIs

case class LikeCommentMessage(novelId: Int, comment_id: Int, likes: Int)extends CommentMessage[String]