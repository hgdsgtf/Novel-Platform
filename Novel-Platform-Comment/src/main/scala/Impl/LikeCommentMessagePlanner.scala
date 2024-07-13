package Impl

import cats.effect.IO
import io.circe.generic.auto._
import Common.API.{PlanContext, Planner}
import Common.DBAPI.{writeDB}
import Common.Object.SqlParameter
import Common.ServiceUtils.schemaName
import io.circe.KeyEncoder.encodeKeyInt

case class LikeCommentMessagePlanner(novelTitle: String, userName: String, userType: String, commentId: Int, override val planContext: PlanContext) extends Planner[String] {
  override def plan(using planContext: PlanContext): IO[String] = {
    // Construct the SQL update query
    val updateQuery = s"UPDATE ${schemaName}.comment SET likes = likes + 1, liker = liker || jsonb_build_array(?::text, ?::text) WHERE id = ?"
    val updateParams = List(SqlParameter("String", userName), SqlParameter("String", userType), SqlParameter("Int", commentId.toString))

    // Perform the update operation in the database
    val updateIO = writeDB(updateQuery, updateParams)

    updateIO.flatMap { result =>
      // Assuming update is successful (check result if necessary)
      IO.pure(s"评论点赞成功，评论ID: $commentId")
    }.handleErrorWith { error =>
      IO.raiseError(new Exception(s"点赞评论失败: ${error.getMessage}"))
    }
  }
}


