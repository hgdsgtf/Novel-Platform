package APIs

case class DeleteCommentMessage(userName : String,novelId: Int)extends CommentMessage[String]
