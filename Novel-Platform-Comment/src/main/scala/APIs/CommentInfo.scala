package APIs

import io.circe.Json

case class CommentInfo(
                        id: Int,
                        user: String,
                        content: String,
                        likes: Int,
                        createdat: String,
                        parentcommentid: Option[Int],
                        parentusername: Option[String],
                        usertype : Option[String],
                        isauthorcomment : Option[String],
                        liker : List[List[String]]
                      )
